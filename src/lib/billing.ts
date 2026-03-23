import { Polar } from '@polar-sh/sdk';
import { validateEvent } from '@polar-sh/sdk/webhooks';
import { Webhook } from 'standardwebhooks';

import { getDb, nowIso } from '@/lib/db';
import { env, isPolarConfigured } from '@/lib/env';

export type PlanTier = 'free' | 'pro';
export type BillingStatus = 'inactive' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';

export type BillingState = {
  userId: string;
  plan: PlanTier;
  status: BillingStatus;
  polarCustomerId: string | null;
  polarSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  updatedAt: string;
};

export type EntitlementSummary = {
  plan: PlanTier;
  subscriptionStatus: BillingStatus;
  evaluationsUsed: number;
  evaluationsRemaining: number | null;
  canStartEvaluation: boolean;
  canContinueConversation: boolean;
  requiresUpgrade: boolean;
  isPolarEnabled: boolean;
};

const db = getDb();

function getPolarClient() {
  if (!env.polarAccessToken) {
    throw new Error('POLAR_ACCESS_TOKEN is not configured.');
  }

  return new Polar({
    accessToken: env.polarAccessToken,
    server: env.polarServer,
  });
}

function normalizeBillingStatus(status?: string | null): BillingStatus {
  if (!status) return 'inactive';
  if (status === 'active') return 'active';
  if (status === 'trialing') return 'trialing';
  if (status === 'past_due') return 'past_due';
  if (status === 'canceled') return 'canceled';
  if (status === 'incomplete') return 'incomplete';
  return 'inactive';
}

function activePlanFromStatus(status: BillingStatus): PlanTier {
  return status === 'active' || status === 'trialing' ? 'pro' : 'free';
}

export function getBillingState(userId: string): BillingState {
  const row = db
    .prepare(
      `SELECT user_id, plan, status, polar_customer_id, polar_subscription_id, current_period_end, updated_at
       FROM billing_state
       WHERE user_id = ?
       LIMIT 1`,
    )
    .get(userId) as
      | {
          user_id: string;
          plan: PlanTier;
          status: BillingStatus;
          polar_customer_id: string | null;
          polar_subscription_id: string | null;
          current_period_end: string | null;
          updated_at: string;
        }
      | undefined;

  if (!row) {
    return {
      userId,
      plan: 'free',
      status: 'inactive',
      polarCustomerId: null,
      polarSubscriptionId: null,
      currentPeriodEnd: null,
      updatedAt: nowIso(),
    };
  }

  return {
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    polarCustomerId: row.polar_customer_id,
    polarSubscriptionId: row.polar_subscription_id,
    currentPeriodEnd: row.current_period_end,
    updatedAt: row.updated_at,
  };
}

export function upsertBillingState(state: BillingState & { rawStateJson?: string | null }) {
  db.prepare(
    `INSERT INTO billing_state (
      user_id, plan, status, polar_customer_id, polar_subscription_id, current_period_end, raw_state_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      plan = excluded.plan,
      status = excluded.status,
      polar_customer_id = excluded.polar_customer_id,
      polar_subscription_id = excluded.polar_subscription_id,
      current_period_end = excluded.current_period_end,
      raw_state_json = excluded.raw_state_json,
      updated_at = excluded.updated_at`,
  ).run(
    state.userId,
    state.plan,
    state.status,
    state.polarCustomerId,
    state.polarSubscriptionId,
    state.currentPeriodEnd,
    state.rawStateJson ?? null,
    state.updatedAt,
  );
}

export function getEvaluationUsage(userId: string) {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(delta), 0) AS used
       FROM usage_ledger
       WHERE user_id = ? AND type = 'evaluation'`,
    )
    .get(userId) as { used: number };

  return row.used ?? 0;
}

export function getEntitlementSummary(userId: string): EntitlementSummary {
  const billingState = getBillingState(userId);
  const evaluationsUsed = getEvaluationUsage(userId);
  const isPaid = billingState.plan === 'pro' && (billingState.status === 'active' || billingState.status === 'trialing');
  const evaluationsRemaining = isPaid ? null : Math.max(0, env.freeEvaluationsLimit - evaluationsUsed);
  const canInteract = isPaid || evaluationsUsed < env.freeEvaluationsLimit;

  return {
    plan: isPaid ? 'pro' : 'free',
    subscriptionStatus: billingState.status,
    evaluationsUsed,
    evaluationsRemaining,
    canStartEvaluation: canInteract,
    canContinueConversation: canInteract,
    requiresUpgrade: !canInteract,
    isPolarEnabled: isPolarConfigured(),
  };
}

export function assertCanStartEvaluation(userId: string) {
  const summary = getEntitlementSummary(userId);
  if (!summary.canStartEvaluation) {
    const error = new Error('Free tier exhausted');
    error.name = 'PAYWALL_REQUIRED';
    throw error;
  }
  return summary;
}

export function assertCanContinueConversation(userId: string) {
  const summary = getEntitlementSummary(userId);
  if (!summary.canContinueConversation) {
    const error = new Error('Conversation continuation requires Pro');
    error.name = 'PAYWALL_REQUIRED';
    throw error;
  }
  return summary;
}

async function ensurePolarCustomer({ userId, email, name }: { userId: string; email: string; name: string }) {
  const polar = getPolarClient();
  const { result } = await polar.customers.list({ email });
  const existing = result.items[0];

  if (existing) {
    if (existing.externalId !== userId) {
      await polar.customers.update({
        id: existing.id,
        customerUpdate: { externalId: userId, email, name },
      });
    }
    return existing.id;
  }

  const created = await polar.customers.create({
    externalId: userId,
    email,
    name,
  });
  return created.id;
}

export async function createPolarCheckoutUrl({
  userId,
  email,
  name,
  successUrl,
  returnUrl,
}: {
  userId: string;
  email: string;
  name: string;
  successUrl?: string;
  returnUrl?: string;
}) {
  if (!isPolarConfigured()) {
    throw new Error('Polar is not configured.');
  }

  const polar = getPolarClient();
  await ensurePolarCustomer({ userId, email, name });

  const checkout = await polar.checkouts.create({
    externalCustomerId: userId,
    products: [env.polarProProductId!],
    successUrl: successUrl ?? env.polarSuccessUrl ?? `${env.appUrl}/panel?checkout=success`,
    returnUrl: returnUrl ?? env.polarReturnUrl ?? `${env.appUrl}/precios`,
    metadata: {
      userId,
      plan: 'pro',
    },
  });

  return checkout.url;
}

export async function createPolarPortalUrl({
  userId,
  email,
  name,
  returnUrl,
}: {
  userId: string;
  email: string;
  name: string;
  returnUrl?: string;
}) {
  if (!isPolarConfigured()) {
    throw new Error('Polar is not configured.');
  }

  const polar = getPolarClient();
  await ensurePolarCustomer({ userId, email, name });

  const session = await polar.customerSessions.create({
    externalCustomerId: userId,
    returnUrl: returnUrl ?? env.polarReturnUrl ?? `${env.appUrl}/panel/configuracion`,
  });

  return session.customerPortalUrl;
}

export async function syncBillingStateFromPolar(userId: string) {
  if (!isPolarConfigured()) {
    const next: BillingState = {
      userId,
      plan: 'free',
      status: 'inactive',
      polarCustomerId: null,
      polarSubscriptionId: null,
      currentPeriodEnd: null,
      updatedAt: nowIso(),
    };
    upsertBillingState(next);
    return next;
  }

  const polar = getPolarClient();

  try {
    const state = await polar.customers.getStateExternal({ externalId: userId });
    const subscription = state.activeSubscriptions[0] ?? null;
    const status = normalizeBillingStatus(subscription?.status ?? 'inactive');
    const next: BillingState = {
      userId,
      plan: activePlanFromStatus(status),
      status,
      polarCustomerId: state.id,
      polarSubscriptionId: subscription?.id ?? null,
      currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString?.() ?? null,
      updatedAt: nowIso(),
    };
    upsertBillingState({ ...next, rawStateJson: JSON.stringify(state) });
    return next;
  } catch {
    const next: BillingState = {
      userId,
      plan: 'free',
      status: 'inactive',
      polarCustomerId: null,
      polarSubscriptionId: null,
      currentPeriodEnd: null,
      updatedAt: nowIso(),
    };
    upsertBillingState(next);
    return next;
  }
}

export function hasProcessedWebhook(eventId: string) {
  const row = db.prepare('SELECT id FROM webhook_events WHERE id = ? LIMIT 1').get(eventId) as { id: string } | undefined;
  return Boolean(row);
}

export function markWebhookProcessed(eventId: string, eventType: string, payload: unknown) {
  db.prepare(
    `INSERT OR IGNORE INTO webhook_events (id, event_type, payload_json, processed_at)
     VALUES (?, ?, ?, ?)`,
  ).run(eventId, eventType, JSON.stringify(payload), nowIso());
}

function extractWebhookUserId(event: { type: string; timestamp: Date; data: Record<string, unknown> }) {
  const customer =
    typeof event.data.customer === 'object' && event.data.customer ? (event.data.customer as { externalId?: unknown; id?: unknown }) : null;
  const metadata = typeof event.data.metadata === 'object' && event.data.metadata ? (event.data.metadata as Record<string, unknown>) : null;

  const customerExternalId = toMaybeString(customer?.externalId);
  const customerId = toMaybeString(customer?.id);

  if (customerExternalId) return customerExternalId;
  if (toMaybeString((event.data as { userId?: unknown }).userId)) return toMaybeString((event.data as { userId?: unknown }).userId);
  if (toMaybeString((event.data as { user_id?: unknown }).user_id)) return toMaybeString((event.data as { user_id?: unknown }).user_id);
  if (toMaybeString(event.data.externalId)) return toMaybeString(event.data.externalId);
  if (toMaybeString(event.data.customer_external_id)) return toMaybeString(event.data.customer_external_id);
  if (toMaybeString(event.data.customerId)) return toMaybeString(event.data.customerId);
  if (toMaybeString(event.data.customer_id)) return toMaybeString(event.data.customer_id);

  const mappedByCustomerId = findUserIdByPolarCustomerId(customerId);
  if (mappedByCustomerId) {
    return mappedByCustomerId;
  }

  if (toMaybeString(event.data.externalCustomerId)) return toMaybeString(event.data.externalCustomerId);
  if (toMaybeString((event.data as { customer_external_id?: unknown }).customer_external_id)) {
    return toMaybeString((event.data as { customer_external_id?: unknown }).customer_external_id);
  }

  const metadataUserId = metadata && toMaybeString(metadata.userId);
  const metadataUserIdSnakeCase = metadata && toMaybeString(metadata.user_id);

  if (metadataUserId) return metadataUserId;
  if (metadataUserIdSnakeCase) return metadataUserIdSnakeCase;

  return null;
}

type ParsedPolarEvent = {
  id?: string;
  type: string;
  timestamp: Date;
  data: Record<string, unknown>;
};

type RawPolarEventPayload = {
  id?: string;
  type?: string;
  timestamp?: string | number | Date;
  data?: Record<string, unknown>;
};

function normalizeWebhookHeaders(headers: Headers) {
  return Object.fromEntries(headers.entries()) as Record<string, string>;
}

function getWebhookSecretCandidates(secret: string) {
  const normalized = secret.trim();
  const candidates = new Set<string>([normalized]);

  candidates.add(Buffer.from(normalized, 'utf-8').toString('base64'));

  if (normalized.startsWith('whsec_')) {
    const withoutPrefix = normalized.slice('whsec_'.length);
    candidates.add(withoutPrefix);
    candidates.add(Buffer.from(withoutPrefix, 'utf-8').toString('base64'));
  }

  return [...candidates];
}

function parsePolarEvent(rawBody: string, headers: Headers, secret: string): ParsedPolarEvent {
  const normalizedHeaders = normalizeWebhookHeaders(headers);

  try {
    return validateEvent(rawBody, normalizedHeaders, secret) as ParsedPolarEvent;
  } catch (error) {
    const webhookSecrets = getWebhookSecretCandidates(secret);
    const lastError = error;
    for (const webhookSecret of webhookSecrets) {
      try {
        const webhook = new Webhook(webhookSecret);
        const raw = webhook.verify(rawBody, normalizedHeaders);

        if (!raw || typeof raw !== 'object') {
          continue;
        }

        const candidate = raw as RawPolarEventPayload;
        const type = typeof candidate.type === 'string' ? candidate.type : '';
        const timestamp = candidate.timestamp instanceof Date ? candidate.timestamp : new Date(candidate.timestamp ?? Date.now());
        const data = typeof candidate.data === 'object' && candidate.data !== null ? candidate.data : {};

        if (!type || Number.isNaN(timestamp.getTime())) {
          continue;
        }

        return {
          id: typeof candidate.id === 'string' ? candidate.id : undefined,
          type,
          timestamp,
          data,
        } as ParsedPolarEvent;
      } catch {
        continue;
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new Error('Failed to parse Polar webhook payload.');
  }
}

function toMaybeString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function findUserIdByPolarCustomerId(polarCustomerId: string | null) {
  if (!polarCustomerId) return null;

  const row = db
    .prepare('SELECT user_id FROM billing_state WHERE polar_customer_id = ? LIMIT 1')
    .get(polarCustomerId) as { user_id: string } | undefined;

  return row?.user_id ?? null;
}

export async function handlePolarWebhook(rawBody: string, headers: Headers) {
  if (!env.polarWebhookSecret) {
    throw new Error('POLAR_WEBHOOK_SECRET is not configured.');
  }
  const secret = env.polarWebhookSecret;

  const event = parsePolarEvent(rawBody, headers, secret);
  const eventId = `${event.type}:${event.id ?? event.data?.id ?? event.timestamp.toISOString()}`;

  if (hasProcessedWebhook(eventId)) {
    return { duplicate: true } as const;
  }

  const userId = extractWebhookUserId(event as { type: string; timestamp: Date; data: Record<string, unknown> });
  if (userId) {
    await syncBillingStateFromPolar(userId);
  }

  markWebhookProcessed(eventId, event.type, event);

  return { duplicate: false, event } as const;
}
