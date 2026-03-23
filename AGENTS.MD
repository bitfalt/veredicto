# AGENTS.MD

## 0. Purpose

This repository is the prompt-first operating system for ElevenHacks #1: Firecrawl x ElevenAgents.

The goal is not to ship a generic demo. The goal is to build a product that is:

1. Actually useful.
2. Clearly powered by both Firecrawl Search and ElevenAgents.
3. Weird, memorable, and easy to demo in under 90 seconds.
4. Strong enough to win on product quality, polish, and virality.

This file tells any coding agent working in this repo how to think, what tools to use, how to research current APIs, and how to turn prompts into a shippable hackathon product.

---

## 1. Hackathon Brief

Source of truth: `https://hacks.elevenlabs.io/hackathons/0`

Current challenge:

- Combine `Firecrawl Search` with `ElevenAgents`.
- Build something unique and unusual.
- Submit a high-quality viral-style video showing what was built.

Judging and meta-game takeaways from the official hackathon page and submission guide:

- Product quality matters.
- Originality matters.
- The integration of both technologies must feel meaningful, not bolted on.
- The video is mission-critical. Treat it as at least 50 percent of the project.
- Social distribution matters because the hackathon also rewards posting and engagement.

Non-negotiable interpretation for this repo:

- Firecrawl Search must be part of the core user value loop.
- ElevenAgents must be part of the actual product experience, not just narration.
- The demo must show a clear "wait, that is possible?" moment in the first 5 seconds.

---

## 2. Winning Strategy

When building inside this repo, optimize for this stack-ranked priority order:

1. `Real painkiller` - solve a problem someone already has.
2. `Unusual interaction` - voice-first, agentic, multimodal, or real-world workflow.
3. `Fast proof` - the result must be demonstrable immediately.
4. `Visual payoff` - the product should look impressive on screen and in a social clip.
5. `Promptability` - future work should be easy to request by prompt.

Good hackathon directions for this repo:

- Real-time voice research copilots.
- Voice agents that search the web, verify sources, and act.
- Search-driven assistants for time-sensitive information.
- Niche expert agents with live web grounding.
- Products that transform web knowledge into a voice workflow with obvious ROI.

Weak directions:

- Generic chatbots.
- Simple search wrappers with TTS.
- Static landing pages with no live agent behavior.
- Projects where Firecrawl or ElevenAgents could be removed and nothing important changes.

---

## 3. Connected Capabilities

This repo is expected to use the following connected skills and MCPs aggressively.

### 3.1 `agents` skill

Use for:

- Designing ElevenAgents flows.
- Choosing between widget embed, signed URL, React hooks, or server-side management.
- Structuring tools: `webhook`, `client`, and `system` tools.
- Agent configuration, conversation logic, and deployment workflows.

High-value takeaways already available in this environment:

- Recommended CLI: `@elevenlabs/cli`
- Current server SDK: `@elevenlabs/elevenlabs-js`
- Current browser SDK: `@elevenlabs/client`
- Current React hook package: `@elevenlabs/react`
- Public widget path exists, but authenticated products should prefer signed URL flows.

### 3.2 `remotion-best-practices` skill

Use for:

- Product teaser videos.
- Social clips.
- Captions, timing, transitions, motion systems, audio sync, and voiceover workflows.
- Visual storytelling for launch and submission content.

Important interpretation:

- Remotion is strongest for the submission video and launch media.
- For landing pages, borrow its storytelling, typography, pacing, and animation discipline.
- Do not force the app UI itself into Remotion unless the user explicitly asks for it.

### 3.3 `context7` MCP

Use for any library/framework/API work.

Always use this sequence:

1. Resolve the library ID.
2. Query the docs with the exact implementation question.
3. Build from the fetched docs, not memory.

Mandatory libraries for this hackathon:

- ElevenLabs platform docs: `/websites/elevenlabs_io`
- ElevenLabs JS SDK: `/elevenlabs/elevenlabs-js`
- Firecrawl docs: `/websites/firecrawl_dev`

### 3.4 Web research

Use live web fetches for:

- The hackathon page.
- Submission guide.
- Any current sponsor docs page linked by the hackathon.

---

## 4. Operating Principles For All Future Agents

Every agent working in this repository must follow these rules:

### 4.1 Product rules

- Build the smallest end-to-end experience that still feels magical.
- Prefer one unforgettable workflow over five shallow features.
- Every major feature must map to a visible demo moment.
- Bias toward products that can be understood in one sentence.

### 4.2 Technical rules

- Prefer current SDKs and current official docs only.
- Research all library usage with Context7 before implementation.
- Keep the architecture modular so tools, prompts, and UI can evolve independently.
- Design the app so voice, text, and search can be demoed separately if needed.

### 4.3 Demo rules

- The first 5 seconds must explain the outcome, not the stack.
- The product must visibly use live web data.
- The product must visibly use an ElevenLabs conversational agent.
- The output must look good on desktop and mobile.

### 4.4 Repo rules

- Keep promptable building blocks separate: UI, tools, prompts, agent config, scripts, and video assets.
- Add concise docs whenever a new subsystem is introduced.
- Prefer code that future prompts can safely extend.
- Git commits must be atomic.
- Git commit messages must be written in English.

---

## 5. Recommended Product Architecture

If the user asks to build the product from this repo, default to this structure unless the prompt says otherwise:

```text
app/ or src/app/                UI routes and pages
components/                     Reusable UI blocks
lib/elevenlabs/                 Agent client, signed URL helpers, config helpers
lib/firecrawl/                  Search, scrape, crawl, extract wrappers
lib/agents/                     System prompts, tool schemas, orchestration helpers
app/api/                        Signed URL endpoints and webhook tools
prompts/                        Reusable build prompts and product prompts
docs/                           Specs, decisions, submission notes, scripts
remotion/                       Demo video compositions, captions, assets
public/                         Static assets, cover image, brand visuals
scripts/                        Local setup, smoke tests, content generation
```

Default stack preference when scaffolding is requested:

- `Next.js` + `TypeScript`
- `Tailwind CSS`
- `@elevenlabs/react` for authenticated browser conversations
- `@elevenlabs/elevenlabs-js` on the server
- `@mendable/firecrawl-js` for Firecrawl SDK access
- `Zod` for tool and response validation

Why this stack:

- Fast to build.
- Strong for landing page + app + API routes.
- Easy to demo.
- Good fit for signed URL auth and webhook tools.

---

## 6. Core Integration Pattern

The default winning pattern for this hackathon is:

1. User speaks or types intent.
2. ElevenAgent handles the conversation and orchestration.
3. Agent calls Firecrawl-powered webhook tools.
4. Firecrawl returns live web results, clean markdown, or structured extraction.
5. Agent synthesizes the answer in voice.
6. UI shows supporting evidence, sources, and result state.
7. The user can continue the loop conversationally.

This means the product should usually contain all three layers:

- `Conversational layer` - ElevenAgent session.
- `Tool layer` - webhook/client/system tools.
- `Grounding layer` - Firecrawl search, scrape, extract, crawl, or map.

---

## 7. ElevenAgents Reference Notes

These notes are derived from current docs retrieved through Context7 and the local `agents` skill.

### 7.1 Current packages

- Server SDK: `@elevenlabs/elevenlabs-js`
- Browser client: `@elevenlabs/client`
- React hooks: `@elevenlabs/react`
- CLI: `@elevenlabs/cli`

Do not default to deprecated packages.

### 7.2 Recommended session flow

For serious products, use a signed URL flow:

1. Backend requests a signed URL for an agent.
2. Frontend requests mic permission.
3. Frontend starts the conversation with `signedUrl`.
4. Frontend optionally provides `dynamicVariables` and `clientTools`.

Reference patterns from current docs:

```ts
const conversation = useConversation({
  onConnect: () => console.log('Connected'),
  onDisconnect: () => console.log('Disconnected'),
  onMessage: (message) => console.log(message),
  onError: (error) => console.error(error),
});

const signedUrl = await getSignedUrl();

await conversation.startSession({
  signedUrl,
  dynamicVariables: {
    user_name: userName,
  },
  clientTools: {
    set_ui_state: ({ step }) => {
      setCurrentStep(step);
      return `Navigated to ${step}`;
    },
  },
});
```

### 7.3 Signed URL server flow

Current SDK reference indicates a server call shaped like:

```ts
await client.conversationalAi.conversations.getSignedUrl({
  agentId: process.env.ELEVENLABS_AGENT_ID!,
  includeConversationId: true,
});
```

### 7.4 Tools strategy

Use all three tool types deliberately:

- `webhook` tools for Firecrawl access and any secure server logic.
- `client` tools for UI transitions, navigation, local state, and modal displays.
- `system` tools for `end_call`, `language_detection`, and transfer behavior where relevant.

### 7.5 Widget rule

The ElevenLabs widget is fine for fast public prototypes.
If auth, personalization, or protected actions matter, prefer the SDK flow with signed URLs.

### 7.6 Evaluation rule

If the product becomes non-trivial, add agent tests early.

Current docs show useful categories:

- `llm` unit tests
- `simulation` tests
- `tool` call validation tests

This matters for hackathon speed because it reduces regressions while iterating prompts and tools.

---

## 8. Firecrawl Reference Notes

These notes are derived from current docs retrieved through Context7.

### 8.1 Current JS/TS SDK

Current docs expose examples using:

```ts
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });
```

### 8.2 Search is mandatory value

The hackathon specifically calls out `Firecrawl Search`.
That means search should not be an optional extra. It should be used in the core experience.

Reference usage from current docs:

```ts
const results = await firecrawl.search('firecrawl', {
  limit: 3,
  scrapeOptions: { formats: ['markdown'] },
});
```

### 8.3 Search + scrape pattern

Use search to discover sources, then scrape the winners for high-quality grounding.

### 8.4 Scrape pattern

Current docs show a scrape shape like:

```ts
const result = await firecrawl.scrape('https://example.com', {
  formats: ['markdown'],
  onlyMainContent: true,
  timeout: 30000,
});
```

### 8.5 Crawl, map, and extract

Use these only when they improve the actual product:

- `crawl` for multi-page ingestion.
- `map` for site discovery or URL inventory.
- `extract` or structured output for schema-validated answers.

Do not use them just to look sophisticated.

### 8.6 Best integration pattern

Wrap Firecrawl inside backend tools with strict input schemas and strict output shapes.
The agent should never directly improvise URL fetching logic from the browser when secure server-side grounding is possible.

---

## 9. Mandatory MCP Research Workflow

Before any implementation that touches libraries or APIs, do this:

### For ElevenLabs

1. Resolve either `ElevenLabs JS SDK` or `ElevenLabs` docs.
2. Query the exact task:
   - agent creation
   - signed URL auth
   - React conversation hooks
   - tools
   - widget
   - testing
3. Build from the returned examples.

### For Firecrawl

1. Resolve `Firecrawl`.
2. Query the exact task:
   - search
   - scrape
   - crawl
   - extract
   - async jobs
3. Build from the returned examples.

Never guess SDK signatures when Context7 can answer them.

---

## 10. Default Build Order

When the user says "build it" or gives a product idea, use this order by default:

1. `Idea framing`
   - rewrite the idea into a one-line hook
   - define target user
   - define the single wow moment

2. `User flow`
   - landing state
   - first interaction
   - tool call
   - visible result
   - follow-up loop

3. `Agent design`
   - system prompt
   - Firecrawl webhook tools
   - client tools for UI state
   - failure handling

4. `End-to-end slice`
   - signed URL endpoint
   - conversation UI
   - one working Firecrawl tool
   - evidence panel / source cards

5. `Polish`
   - landing page
   - visual identity
   - demo script
   - cover image
   - video generation/editing workflow

6. `Submission prep`
   - concise description
   - social post variants
   - live demo URL
   - repo clarity

---

## 11. Required Deliverables For A Strong Submission

Any serious build in this repo should aim to produce these assets:

- `Working product MVP`
- `Landing page or launch page`
- `Conversation experience with live grounding`
- `Visible citations or source evidence`
- `Hackathon demo script`
- `Short-form video plan`
- `Submission copy`
- `Social post copy for X, LinkedIn, Instagram, TikTok`

If time is short, cut secondary features before cutting demo quality.

---

## 12. Landing Page Guidance

When asked to create the landing page, optimize for conversion and virality.

The page must communicate:

1. What the product does.
2. Why live search + voice changes the workflow.
3. Why this specific product is surprising.
4. A demo CTA immediately.

Recommended sections:

- Hero with one-line promise and visible demo CTA
- Live or simulated conversation screenshot / motion demo
- "How it works" in 3 steps
- Trust/evidence section showing source grounding
- Use-case section for the niche
- Social-proof-ready visual block or stat strip
- Final CTA

Use the Remotion skill for:

- motion language
- reveal timing
- captions and teaser assets
- voiceover-driven narrative structure

---

## 13. Agent Tool Design Rules

When building tools for ElevenAgents in this repo:

### 13.1 Firecrawl tools to consider first

- `search_web`
- `scrape_url`
- `extract_from_url`
- `crawl_site` only if a multi-page workflow is core
- `map_site` only if source discovery matters

### 13.2 Tool design rules

- Keep tool names action-oriented.
- Keep descriptions explicit enough for the model to choose correctly.
- Use Zod or JSON Schema for strict parameter contracts.
- Return concise but structured results.
- Include source URLs whenever possible.
- Avoid giant payloads if the agent only needs summaries and citations.

### 13.3 UI-side client tools to consider

- `show_sources`
- `open_result_card`
- `set_ui_state`
- `highlight_quote`
- `save_session_note`

### 13.4 System tools to consider

- `end_call`
- `language_detection`
- transfer tools only if the product genuinely needs escalation

---

## 14. Quality Bar

Do not call the project ready unless the answer to all of these is "yes":

- Can a stranger understand the product in one sentence?
- Does the demo clearly use both Firecrawl Search and ElevenAgents?
- Is the voice experience central, not decorative?
- Is at least one part of the result visibly grounded in live web data?
- Does the UI feel intentional rather than hacky?
- Can the product be demoed in under 90 seconds?
- Is there a strong first 5-second hook for social?

---

## 15. Suggested Prompt Templates For This Repo

These are the prompts future users should be able to paste directly.

### 15.1 Idea generation

```text
Use the hackathon constraints in AGENTS.MD and generate 10 product ideas that combine Firecrawl Search and ElevenAgents. Rank them by originality, demo strength, speed to MVP, and viral potential. Then pick the best 3 and define their one-line hook, target user, wow moment, and MVP scope.
```

### 15.2 Product selection

```text
Take idea #<N> from AGENTS.MD exploration and turn it into a build spec. Define user journey, feature scope, system architecture, ElevenAgent tools, Firecrawl tool wrappers, landing page sections, and a 60-90 second demo plan.
```

### 15.3 MVP implementation

```text
Build the smallest end-to-end MVP for this repo using the default architecture in AGENTS.MD. Use signed URL auth for ElevenAgents, add one production-grade Firecrawl search tool and one scrape/extract tool, and create a simple but polished UI that shows sources and conversation state.
```

### 15.4 Landing page

```text
Create a high-conviction landing page for this product. Follow AGENTS.MD, make the value prop clear in the hero, include a visible voice demo CTA, and design the page so it looks strong in screenshots and short-form videos.
```

### 15.5 Video plan

```text
Using AGENTS.MD and the Remotion skill, create a 75-second hackathon submission video plan with hook, shot list, captions, on-screen copy, voiceover beats, music direction, and export checklist.
```

### 15.6 Submission copy

```text
Write the hackathon submission package for this product: title, one-sentence hook, 120-word description, technical breakdown of how ElevenLabs and Firecrawl are used, X post, LinkedIn post, Instagram caption, TikTok caption, and thumbnail text.
```

---

## 16. Recommended Environment Variables

If scaffolding starts, expect to use at least:

```bash
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=
FIRECRAWL_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Possible later additions depending on the product:

```bash
OPENAI_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 17. Documentation References To Reuse

These are the main references that future agents should cite or revisit.

### ElevenAgents / ElevenLabs

- Context7 library ID: `/websites/elevenlabs_io`
- Context7 library ID: `/elevenlabs/elevenlabs-js`
- Hackathon-linked docs: `https://elevenlabs.io/docs/conversational-ai/docs/introduction`
- Quickstart pattern for React sessions: `https://elevenlabs.io/docs/eleven-agents/guides/quickstarts/next-js`
- System tools docs: `https://elevenlabs.io/docs/eleven-agents/customization/tools/system-tools`
- Tests reference: `https://elevenlabs.io/docs/api-reference/tests/run-tests`

Key documented patterns already validated in this environment:

- `useConversation()` for frontend sessions
- `conversation.startSession({ signedUrl, dynamicVariables, clientTools })`
- `client.conversationalAi.conversations.getSignedUrl(...)`
- `webhook`, `client`, and `system` tool strategies

### Firecrawl

- Context7 library ID: `/websites/firecrawl_dev`
- Hackathon-linked docs: `https://docs.firecrawl.dev/features/search`
- Intro/docs root: `https://docs.firecrawl.dev/`
- Search examples: `https://docs.firecrawl.dev/introduction`
- Agent integration cookbook: `https://docs.firecrawl.dev/developer-guides/cookbooks/ai-research-assistant-cookbook`

Key documented patterns already validated in this environment:

- `new Firecrawl({ apiKey })`
- `firecrawl.search(query, { limit, scrapeOptions })`
- `firecrawl.scrape(url, { formats: ['markdown'], onlyMainContent: true })`
- async crawl/watch patterns when needed

---

## 18. Final Rule

If there is any tension between building more features and making the demo clearer, choose the clearer demo.

For this hackathon, code is table stakes.
Product clarity, memorable interaction, and a viral-ready presentation are the leverage points.

Build accordingly.
