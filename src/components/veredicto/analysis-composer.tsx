'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useConversation } from '@elevenlabs/react';

import { buildAgentResearchBrief, buildInitialCaseContext, type CaseResearchResult } from '@/lib/agents/case-context';
import { type CaseHistoryItem } from '@/lib/case-history';
import { cn } from '@/lib/utils';

import { Icon } from './icon';

type Message = {
  id: string;
  source: 'ai' | 'user' | 'system';
  text: string;
};

type AttachedFile = {
  id: string;
  name: string;
  file: File;
};

type Phase = 'intake' | 'investigating' | 'conversing';
type VoiceMode = 'idle' | 'listening' | 'speaking' | 'user_turn';
type DictationTarget = 'prompt' | 'conversation' | null;
type InvestigationPhase = 0 | 1 | 2 | 3;

type ResearchResponse = CaseResearchResult & {
  caseId: string | null;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition;

const investigationSteps = [
  'Analizando entrada',
  'Buscando fuentes relevantes',
  'Detectando senales importantes',
  'Preparando contexto y veredicto',
];

const demoReplies = [
  'Ya revise el caso. Lo primero que veo es una senal de precio anormalmente bajo frente al mercado.',
  'Tambien encontre referencias cruzadas inconsistentes en el anuncio y falta de trazabilidad del vendedor.',
  'Mi recomendacion inicial es revisar con calma antes de tomar una decision. Si quieres, te explico punto por punto.',
];

const waveformBars = [
  0.18, 0.22, 0.28, 0.34, 0.42, 0.56, 0.7, 0.84, 0.96, 1,
  0.94, 0.82, 0.68, 0.52, 0.4, 0.3, 0.24, 0.2, 0.18,
];

const USE_LOCAL_AGENT_SIMULATION =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_USE_LOCAL_AGENT_SIMULATION === 'true';

function deriveRecommendation(text: string) {
  const value = text.toLowerCase();

  if (/(estafa|fraude|demasiado barato|riesgo alto|promesas sin respaldo|urgente)/.test(value)) {
    return {
      label: 'Frenar',
      tone: 'text-brand-accent border-brand-accent/20 bg-brand-accent/10',
      summary: 'Se detectan banderas rojas que merecen una pausa antes de avanzar.',
    };
  }

  if (/(contrato|clausula|licencia|ambigua|documento|revision)/.test(value)) {
    return {
      label: 'Revisar',
      tone: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
      summary: 'Hay puntos que conviene revisar con detalle antes de decidir.',
    };
  }

  return {
    label: 'Seguir',
    tone: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    summary: 'Por ahora no aparecen alertas severas y el caso luce estable.',
  };
}

function extractIncomingMessage(raw: unknown): { source: 'ai' | 'user'; text: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;

  if (typeof candidate.message === 'string' && (candidate.source === 'ai' || candidate.source === 'user')) {
    return { source: candidate.source, text: candidate.message };
  }

  if (typeof candidate.text === 'string' && (candidate.source === 'ai' || candidate.source === 'user')) {
    return { source: candidate.source, text: candidate.text };
  }

  if (typeof candidate.content === 'string' && (candidate.role === 'assistant' || candidate.role === 'user')) {
    return { source: candidate.role === 'assistant' ? 'ai' : 'user', text: candidate.content };
  }

  return null;
}

function buildLocalAgentReply({
  userInput,
  recommendation,
  researchResult,
}: {
  userInput?: string;
  recommendation: { label: string; summary: string };
  researchResult: CaseResearchResult | null;
}) {
  const summary = researchResult?.summary ?? 'Ya revise el caso y tengo una lectura preliminar.';
  const sourceHint = researchResult?.sources[0]?.title ? ` La fuente mas fuerte apunta a ${researchResult.sources[0].title}.` : '';

  if (!userInput) {
    return `Mi recomendacion inicial es ${recommendation.label.toLowerCase()}. ${recommendation.summary} ${summary}${sourceHint}`.trim();
  }

  return `Sobre lo que acabas de decir: ${userInput}. Mi lectura sigue siendo ${recommendation.label.toLowerCase()}. ${recommendation.summary} ${sourceHint}`.trim();
}

function AgentWaveform({ active, pulse }: { active: boolean; pulse: number }) {
  return (
    <div className="relative flex h-24 w-full max-w-[26rem] items-center justify-center overflow-visible">
      <div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FFF2DC] to-transparent" />
      <div className="absolute inset-x-[16%] top-1/2 h-10 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(255,243,220,0.5)_0%,_rgba(255,190,102,0.24)_35%,_rgba(11,12,16,0)_72%)] blur-lg" />
      <div className="absolute inset-x-[10%] top-1/2 h-16 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(255,126,69,0.2)_0%,_rgba(255,126,69,0.1)_45%,_rgba(11,12,16,0)_78%)] blur-xl" />

      <div className="relative flex h-full w-full items-center justify-center gap-[3px] px-4">
        {waveformBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={cn(
              'relative w-[4px] rounded-full transition-all duration-500 ease-out',
              active ? 'opacity-100' : 'opacity-35',
            )}
            style={{
              height: `${Math.max(12, height * 74)}px`,
              background:
                'linear-gradient(180deg, rgba(255,120,58,0.04) 0%, rgba(255,132,72,0.72) 34%, rgba(255,245,227,1) 50%, rgba(255,174,82,0.74) 66%, rgba(255,120,58,0.04) 100%)',
              boxShadow:
                index > 5 && index < 13
                  ? '0 0 18px rgba(255,241,216,0.34), 0 0 28px rgba(255,124,64,0.24)'
                  : '0 0 10px rgba(255,124,64,0.14)',
              transform: active ? `scaleY(${0.82 + ((index % 5) * 0.05) + pulse * (0.22 + (index % 4) * 0.02)})` : 'scaleY(0.72)',
              animationName: active ? `voice-wave-${(index % 4) + 1}` : 'none',
              animationDuration: active ? `${1.2 + (index % 5) * 0.14}s` : undefined,
              animationTimingFunction: active ? 'ease-in-out' : undefined,
              animationIterationCount: active ? 'infinite' : undefined,
              animationDelay: active ? `${index * 0.04}s` : undefined,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes voice-wave-1 {
          0%, 100% { transform: scaleY(0.82); }
          50% { transform: scaleY(1.08); }
        }
        @keyframes voice-wave-2 {
          0%, 100% { transform: scaleY(0.74); }
          50% { transform: scaleY(1.18); }
        }
        @keyframes voice-wave-3 {
          0%, 100% { transform: scaleY(0.88); }
          50% { transform: scaleY(1.02); }
        }
        @keyframes voice-wave-4 {
          0%, 100% { transform: scaleY(0.7); }
          50% { transform: scaleY(1.14); }
        }
      `}</style>
    </div>
  );
}

type AnalysisComposerProps = {
  initialCase?: CaseHistoryItem | null;
  mode?: 'new' | 'view' | 'resume';
};

export function AnalysisComposer({ initialCase = null, mode = 'new' }: AnalysisComposerProps) {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(initialCase?.id ?? null);
  const canActivelyContinue = mode !== 'view';

  const [prompt, setPrompt] = useState('');
  const [phase, setPhase] = useState<Phase>('intake');
  const [messages, setMessages] = useState<Message[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('idle');
  const [micMuted, setMicMuted] = useState(true);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [submittedContext, setSubmittedContext] = useState('');
  const [researchResult, setResearchResult] = useState<CaseResearchResult | null>(null);
  const [dictationTarget, setDictationTarget] = useState<DictationTarget>(null);
  const [dictationSupported, setDictationSupported] = useState(false);
  const [dictationHint, setDictationHint] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [agentAudioPulse, setAgentAudioPulse] = useState(0);
  const [investigationPhase, setInvestigationPhase] = useState<InvestigationPhase>(0);
  const [teleprompterWordIndex, setTeleprompterWordIndex] = useState(0);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [localAgentMode] = useState(USE_LOCAL_AGENT_SIMULATION);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dictationRef = useRef<BrowserSpeechRecognition | null>(null);
  const dictationBaseRef = useRef('');
  const demoReplyTimerRef = useRef<number | null>(null);
  const investigationStartTimerRef = useRef<number | null>(null);
  const investigationStartedRef = useRef(false);
  const agentAudioDecayRef = useRef<number | null>(null);
  const userTurnOpenRef = useRef(false);
  const teleprompterTimerRef = useRef<number | null>(null);
  const spokenUserDraftRef = useRef('');
  const localSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const localWaveTimerRef = useRef<number | null>(null);

  const recommendation = useMemo(() => {
    if (researchResult) {
      const label = researchResult.recommendation.label;
      return {
        label,
        summary: researchResult.recommendation.summary,
        tone:
          label === 'Frenar'
            ? 'text-brand-accent border-brand-accent/20 bg-brand-accent/10'
            : label === 'Revisar'
              ? 'text-amber-400 border-amber-400/20 bg-amber-400/10'
              : 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
      };
    }

    return deriveRecommendation(submittedContext || prompt);
  }, [researchResult, submittedContext, prompt]);

  const appendMessage = (source: Message['source'], text: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, source, text }]);
  };

  const latestAiMessage = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].source === 'ai') return messages[index];
    }
    return null;
  }, [messages]);

  const latestAiWords = useMemo(() => {
    return latestAiMessage?.text.split(/\s+/).filter(Boolean) ?? [];
  }, [latestAiMessage]);

  const fullAgentTranscript = useMemo(() => {
    return messages
      .filter((message) => message.source === 'ai')
      .map((message) => message.text.trim())
      .filter(Boolean)
      .join('\n\n');
  }, [messages]);

  const speakLocally = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceMode('speaking');
      return;
    }

    if (localSpeechRef.current) {
      window.speechSynthesis.cancel();
      localSpeechRef.current = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.lang = spanishVoice?.lang ?? 'es-ES';
    utterance.rate = 0.96;
    utterance.pitch = 1;
    const words = text.split(/\s+/).filter(Boolean);
    const wordPositions: number[] = [];
    let charCursor = 0;
    words.forEach((word) => {
      wordPositions.push(charCursor);
      charCursor += word.length + 1;
    });

    utterance.onstart = () => {
      setVoiceMode('speaking');
      setMicMuted(true);
      userTurnOpenRef.current = false;
      setTeleprompterWordIndex(0);
      if (localWaveTimerRef.current) window.clearInterval(localWaveTimerRef.current);
      localWaveTimerRef.current = window.setInterval(() => {
        setAgentAudioPulse(0.35 + Math.random() * 0.6);
      }, 120);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      const charIndex = event.charIndex ?? 0;
      const nextWordIndex = wordPositions.findIndex((position, index) => {
        const next = wordPositions[index + 1] ?? Number.POSITIVE_INFINITY;
        return charIndex >= position && charIndex < next;
      });

      if (nextWordIndex >= 0) {
        setTeleprompterWordIndex(nextWordIndex + 1);
      }
    };

    utterance.onend = () => {
      if (localWaveTimerRef.current) window.clearInterval(localWaveTimerRef.current);
      localWaveTimerRef.current = null;
      setAgentAudioPulse(0);
      setVoiceMode('listening');
      setMicMuted(true);
      setTeleprompterWordIndex(words.length);
    };

    utterance.onerror = () => {
      if (localWaveTimerRef.current) window.clearInterval(localWaveTimerRef.current);
      localWaveTimerRef.current = null;
      setAgentAudioPulse(0);
      setVoiceMode('listening');
      setMicMuted(true);
      setTeleprompterWordIndex(words.length);
    };

    localSpeechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const clearInvestigationTimers = () => {
    if (investigationStartTimerRef.current) {
      window.clearTimeout(investigationStartTimerRef.current);
      investigationStartTimerRef.current = null;
    }
  };

  const stopDictation = () => {
    dictationRef.current?.stop();
    setDictationTarget(null);
  };

  const applyDictatedText = (text: string) => {
    if (dictationTarget === 'conversation') {
      spokenUserDraftRef.current = text;
      return;
    }

    setPrompt(text);
  };

  useEffect(() => {
    const scopedWindow = window as Window & {
      SpeechRecognition?: BrowserSpeechRecognitionCtor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
    };

    const RecognitionCtor = scopedWindow.SpeechRecognition || scopedWindow.webkitSpeechRecognition;
    setDictationSupported(Boolean(RecognitionCtor));

    if (!RecognitionCtor) return;

    const recognition = new RecognitionCtor();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();

      applyDictatedText(`${dictationBaseRef.current}${transcript}`.trim());
    };

    recognition.onerror = () => {
      setDictationHint('No pude escuchar bien. Prueba de nuevo.');
      setDictationTarget(null);
    };

    recognition.onend = () => {
      if (dictationTarget === 'conversation' && spokenUserDraftRef.current.trim()) {
        const transcript = spokenUserDraftRef.current.trim();
        appendMessage('user', transcript);
        spokenUserDraftRef.current = '';
        setDictationHint('Recibi tu respuesta. Estoy retomando la consulta...');

        if (localAgentMode) {
          window.setTimeout(() => {
            const reply = buildLocalAgentReply({
              userInput: transcript,
              recommendation,
              researchResult,
            });
            appendMessage('ai', reply);
            speakLocally(reply);
          }, 420);
        }
      }

      setDictationTarget(null);
    };

    dictationRef.current = recognition;

    return () => {
      recognition.stop();
      dictationRef.current = null;
    };
  }, [dictationTarget]);

  useEffect(() => {
    if (!latestAiMessage) {
      setTeleprompterWordIndex(0);
      return;
    }

    if (teleprompterTimerRef.current) {
      window.clearInterval(teleprompterTimerRef.current);
      teleprompterTimerRef.current = null;
    }

    const target = latestAiMessage.text;
    const words = target.split(/\s+/).filter(Boolean);
    setTeleprompterWordIndex(0);

    if (localAgentMode) {
      return;
    }

    teleprompterTimerRef.current = window.setInterval(() => {
      setTeleprompterWordIndex((current) => {
        const nextWordCount = Math.min(words.length, current + 1);

        if (nextWordCount >= words.length && teleprompterTimerRef.current) {
          window.clearInterval(teleprompterTimerRef.current);
          teleprompterTimerRef.current = null;
        }

        return nextWordCount;
      });
    }, 120);

    return () => {
      if (teleprompterTimerRef.current) {
        window.clearInterval(teleprompterTimerRef.current);
        teleprompterTimerRef.current = null;
      }
    };
  }, [latestAiMessage]);

  useEffect(() => {
    if (!dictationHint) return;

    const timer = window.setTimeout(() => setDictationHint(null), 2400);
    return () => window.clearTimeout(timer);
  }, [dictationHint]);

  useEffect(() => {
    if (!copiedTranscript) return;
    const timer = window.setTimeout(() => setCopiedTranscript(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedTranscript]);

  useEffect(() => {
    if (!initialCase || mode === 'new') return;

    setActiveCaseId(initialCase.id);
    setPrompt(initialCase.prompt);
    setSubmittedContext(initialCase.prompt);
    setResearchResult(initialCase.research);
    setAttachments([]);
    setPhase('conversing');
    setMicMuted(true);
    setVoiceMode('listening');
    setConversationId(initialCase.elevenlabsConversationId);

    if (initialCase.conversationMessages.length > 0) {
      setMessages(initialCase.conversationMessages);
      return;
    }

    setMessages([
      {
        id: `${initialCase.id}-system`,
        source: 'system',
        text: mode === 'resume'
          ? 'Retomaste esta consulta. Ya tengo el contexto del caso y podemos seguir desde aqui.'
          : 'Estas viendo una consulta anterior. Puedes revisar el caso y, si tu plan lo permite, retomarlo.',
      },
      {
        id: `${initialCase.id}-ai`,
        source: 'ai',
        text: `Mi recomendacion para este caso sigue siendo ${initialCase.verdict.toLowerCase()}. ${initialCase.summary}`,
      },
    ]);
  }, [initialCase, mode]);

  useEffect(() => {
    if (!activeCaseId || messages.length === 0 || !canActivelyContinue) return;

    const timer = window.setTimeout(() => {
      void fetch(`/api/case/history/${activeCaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationMessages: messages, elevenlabsConversationId: conversationId }),
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [activeCaseId, canActivelyContinue, conversationId, messages]);

  useEffect(() => {
    if (voiceMode !== 'speaking' || agentAudioPulse <= 0) return;

    if (agentAudioDecayRef.current) {
      window.clearTimeout(agentAudioDecayRef.current);
    }

    agentAudioDecayRef.current = window.setTimeout(() => {
      setAgentAudioPulse((current) => Math.max(0, current - 0.08));
    }, 110);

    return () => {
      if (agentAudioDecayRef.current) {
        window.clearTimeout(agentAudioDecayRef.current);
      }
    };
  }, [agentAudioPulse, voiceMode]);

  const conversation = useConversation({
    micMuted,
    onConnect: () => {
      setPhase('conversing');
      setVoiceMode('listening');
      setMicMuted(true);
      appendMessage('system', 'Caso estudiado. Escucha primero la explicacion y luego toma la palabra con el microfono inferior.');
    },
    onDisconnect: () => {
      setPhase('intake');
      setMessages([]);
      setVoiceMode('idle');
      setMicMuted(true);
      setConversationId(null);
      setActiveCaseId(null);
      setResearchResult(null);
      setAgentAudioPulse(0);
      userTurnOpenRef.current = false;
    },
    onModeChange: ({ mode }: { mode?: string }) => {
      if (mode === 'speaking') {
        setVoiceMode('speaking');
        setMicMuted(true);
        userTurnOpenRef.current = false;
      } else if (mode === 'listening') {
        setVoiceMode(userTurnOpenRef.current ? 'user_turn' : 'listening');
        setMicMuted(!userTurnOpenRef.current);
      }
    },
    onInterruption: () => {
      setVoiceMode('user_turn');
      setMicMuted(false);
      userTurnOpenRef.current = true;
    },
    onVadScore: ({ vadScore }: { vadScore: number }) => {
      void vadScore;
    },
    onAudio: () => {
      setAgentAudioPulse((current) => Math.min(1, current + 0.22));
    },
    onMessage: (raw) => {
      const parsed = extractIncomingMessage(raw);
      if (!parsed) return;

      if (!parsed.text.trim() || (parsed.source === 'user' && /^\.{1,}$/.test(parsed.text.trim()))) {
        return;
      }

      if (parsed.source === 'user' && micMuted) {
        return;
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.source === parsed.source && last.text === parsed.text) {
          return prev;
        }
        return [...prev, { id: `${Date.now()}-${Math.random()}`, source: parsed.source, text: parsed.text }];
      });
    },
    onError: () => {
      setDemoMode(true);
      setPhase('conversing');
      setVoiceMode('listening');
      setResearchResult((current: CaseResearchResult | null) =>
        current ?? {
          researched: false,
          query: prompt,
          summary: 'Puedo continuar en modo local con una lectura preliminar del caso, aunque falte la investigacion web en vivo.',
          recommendation: {
            label: deriveRecommendation(prompt).label as 'Seguir' | 'Revisar' | 'Frenar',
            summary: deriveRecommendation(prompt).summary,
          },
          sources: [],
          attachmentsProcessed: attachments.map((item) => item.name),
          contextFragments: [],
        },
      );
      setMessages([
        {
          id: 'demo-system',
          source: 'system',
          text: 'Modo demo activo. La experiencia de consulta sigue disponible aunque falten las llaves de ElevenLabs.',
        },
        {
          id: 'demo-ai',
          source: 'ai',
          text: 'Ya estudie tu caso. Lo primero que veo es que hay una senal que merece mas atencion antes de decidir.',
        },
      ]);
    },
  });

  const buildResumeConversationContext = () => {
    const transcript = messages
      .slice(-8)
      .map((message) => `${message.source.toUpperCase()}: ${message.text}`)
      .join('\n');

    return [
      buildAgentResearchBrief({
        initialContext: initialCase?.prompt ?? prompt,
        research: initialCase?.research ?? researchResult ?? {
          researched: false,
          query: prompt,
          summary: 'No habia investigacion previa sincronizada.',
          recommendation: {
            label: recommendation.label as 'Seguir' | 'Revisar' | 'Frenar',
            summary: recommendation.summary,
          },
          sources: [],
          attachmentsProcessed: [],
          contextFragments: [],
        },
      }),
      '',
      'TRANSCRIPCION RECIENTE',
      transcript || 'No hay mensajes previos. Continúa desde el caso ya investigado.',
      '',
      'INSTRUCCION',
      'Retoma la conversacion desde este punto sin repetir toda la introduccion.',
    ].join('\n');
  };

  const startRemoteConversation = async (seedContext: string, caseId = activeCaseId) => {
    const response = await fetch(caseId ? `/api/elevenlabs/signed-url?caseId=${caseId}` : '/api/elevenlabs/signed-url');

    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { code?: string; error?: string } | null;
      if (payload?.code === 'PAYWALL_REQUIRED') {
        setDictationHint('Ya usaste tus 2 evaluaciones gratis. Activa Pro para seguir conversando.');
      }
      throw new Error(payload?.error ?? 'Missing signed url');
    }

    const data = await response.json() as { signedUrl: string };
    const id = await conversation.startSession({ signedUrl: data.signedUrl });
    setConversationId(id);
    conversation.sendUserMessage(seedContext);
    return id;
  };

  const beginConversationFromInvestigation = async () => {
    if (investigationStartedRef.current) return;

    investigationStartedRef.current = true;
    clearInvestigationTimers();

    const fallbackContext = buildInitialCaseContext({ prompt, attachments: attachments.map((item) => item.name) });
    setSubmittedContext(fallbackContext);

    try {
      setInvestigationPhase(1);

      const formData = new FormData();
      formData.set('prompt', prompt);
      attachments.forEach((attachment) => {
        formData.append('files', attachment.file, attachment.name);
      });

      const researchResponse = await fetch('/api/case/research', {
        method: 'POST',
        body: formData,
      });

      let enrichedContext = fallbackContext;
      let fetchedResearch: CaseResearchResult | null = null;
      if (!researchResponse.ok) {
        const payload = await researchResponse.json().catch(() => null) as { code?: string; error?: string } | null;
        if (payload?.code === 'PAYWALL_REQUIRED') {
          setPhase('intake');
          setDictationHint('Ya usaste tus 2 evaluaciones gratis. Activa Pro para seguir usando el analisis conversacional.');
          return;
        }

        throw new Error(payload?.error ?? 'Case research failed');
      }

      const research = (await researchResponse.json()) as ResearchResponse;
      fetchedResearch = research;
      setResearchResult(research);
      if (research.caseId) {
        setActiveCaseId(research.caseId);
      }
      enrichedContext = buildAgentResearchBrief({
        initialContext: fallbackContext,
        research,
      });
      setSubmittedContext(enrichedContext);

      setInvestigationPhase(2);

      if (localAgentMode) {
        setInvestigationPhase(3);
        setPhase('conversing');
        const localReply = buildLocalAgentReply({
          recommendation: fetchedResearch?.recommendation ?? recommendation,
          researchResult: fetchedResearch,
        });
        appendMessage('system', 'Caso estudiado. Ya tengo una explicacion inicial preparada para ti.');
        appendMessage('ai', localReply);
        speakLocally(localReply);
        return;
      }

      setInvestigationPhase(3);

      await startRemoteConversation(enrichedContext, research.caseId);
    } catch {
      setDemoMode(true);
      setPhase('conversing');
      setVoiceMode('listening');
      setResearchResult((current: CaseResearchResult | null) =>
        current ?? {
          researched: false,
          query: prompt,
          summary: 'Use una lectura local del caso para preparar esta consulta inicial.',
          recommendation: {
            label: deriveRecommendation(fallbackContext).label as 'Seguir' | 'Revisar' | 'Frenar',
            summary: deriveRecommendation(fallbackContext).summary,
          },
          sources: [],
          attachmentsProcessed: attachments.map((item) => item.name),
          contextFragments: [],
        },
      );
      setMessages([
        {
          id: 'demo-system',
          source: 'system',
          text: 'Caso revisado. Enseguida te explico lo principal y podemos seguir conversando.',
        },
        {
          id: 'demo-ai-initial',
          source: 'ai',
          text: demoReplies[0],
        },
      ]);
    }
  };

  useEffect(() => {
    if (phase !== 'investigating') return;

    investigationStartedRef.current = false;
    setInvestigationPhase(0);

    investigationStartTimerRef.current = window.setTimeout(() => {
      void beginConversationFromInvestigation();
    }, 120);

    return () => {
      clearInvestigationTimers();
    };
  }, [phase]);

  const startPromptDictation = () => {
    if (!dictationSupported || !dictationRef.current) {
      setDictationHint('El dictado no esta disponible en este navegador.');
      return;
    }

    if (dictationTarget === 'prompt') {
      stopDictation();
      return;
    }

    dictationBaseRef.current = prompt.trim() ? `${prompt.trim()} ` : '';
    setDictationTarget('prompt');
    setDictationHint('Escuchando para escribir tu caso...');
    dictationRef.current.start();
  };

  const handleAttachFiles = (files: FileList | null) => {
    if (!files) return;

    const nextFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random()}`,
      name: file.name,
      file,
    }));
    setAttachments((prev) => [...prev, ...nextFiles].slice(0, 4));
    setShowAttachMenu(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const submitIntake = () => {
    if (!prompt.trim() && attachments.length === 0) return;
    stopDictation();
    clearInvestigationTimers();
    investigationStartedRef.current = false;
    setActiveCaseId(null);
    setConversationId(null);
    setMessages([]);
    setResearchResult(null);
    setPhase('investigating');
    setVoiceMode('idle');
  };

  const requestVoiceTurn = async () => {
    if (!canActivelyContinue) {
      setDictationHint('Puedes revisar esta consulta, pero para continuarla necesitas Pro.');
      return;
    }

    setDictationHint('Microfono abierto. Habla ahora con naturalidad.');

    if (localAgentMode && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (localWaveTimerRef.current) {
        window.clearInterval(localWaveTimerRef.current);
        localWaveTimerRef.current = null;
      }
    }

    setVoiceMode('user_turn');
    setMicMuted(false);
    userTurnOpenRef.current = true;

    if (localAgentMode) {
      if (!dictationSupported || !dictationRef.current) {
        setDictationHint('El dictado no esta disponible en este navegador.');
        return;
      }

      spokenUserDraftRef.current = '';
      setDictationTarget('conversation');
      dictationBaseRef.current = '';
      dictationRef.current.start();
      return;
    }

    if (!conversationId) {
      try {
        await startRemoteConversation(buildResumeConversationContext(), activeCaseId);
        setDictationHint('Estoy retomando el caso con su contexto anterior.');
        return;
      } catch {
        return;
      }
    }

    if (typeof conversation.sendUserActivity === 'function') {
      conversation.sendUserActivity();
    }
  };

  const copyAgentTranscript = async () => {
    if (!fullAgentTranscript.trim()) return;

    try {
      await navigator.clipboard.writeText(fullAgentTranscript);
      setCopiedTranscript(true);
    } catch {
      setDictationHint('No pude copiar el texto. Prueba otra vez.');
    }
  };

  const endConsultation = async () => {
    stopDictation();
    clearInvestigationTimers();

    if (demoMode) {
      if (demoReplyTimerRef.current) window.clearTimeout(demoReplyTimerRef.current);
      setPhase('intake');
      setMessages([]);
      setDemoMode(false);
      setPrompt('');
      setSubmittedContext('');
      return;
    }

    try {
      await conversation.endSession();
    } catch {
      setPhase('intake');
      setMessages([]);
      setVoiceMode('idle');
      setMicMuted(true);
      setConversationId(null);
    }
  };

  const visibleTeleprompterWords = useMemo(() => {
    if (!latestAiWords.length) return [] as string[];
    const spokenCount = Math.max(1, teleprompterWordIndex || (voiceMode === 'speaking' ? 1 : latestAiWords.length));
    const start = Math.max(0, spokenCount - 12);
    return latestAiWords.slice(start, spokenCount);
  }, [latestAiWords, teleprompterWordIndex, voiceMode]);

  if (phase === 'investigating') {
    return (
      <div className="surface-tint-soft flex min-h-[640px] w-full flex-col items-center justify-center rounded-[2.5rem] border border-brand-gray/10 px-8 py-16 shadow-2xl backdrop-blur-2xl">
        <div className="relative mb-14 flex h-36 w-36 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-brand-accent/20" />
          <div className="absolute inset-4 rounded-full border border-brand-accent/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-b-2 border-r-2 border-brand-accent/70" />
          <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle,_rgba(255,75,42,0.22)_0%,_rgba(255,75,42,0)_70%)] blur-xl" />
          <Icon name="visibility" className="relative z-10 text-4xl text-brand-accent" />
        </div>

        <div className="max-w-2xl text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gray">Investigacion en curso</p>
          <h3 className="font-headline text-3xl font-extrabold tracking-tight text-brand-light md:text-4xl">
            Estoy estudiando tu caso antes de responder
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-brand-muted">
            Primero reviso la informacion que me compartiste, busco referencias utiles y preparo una recomendacion clara.
          </p>
        </div>

        <div className="mt-12 w-full max-w-2xl space-y-3 rounded-[2rem] border border-brand-gray/10 bg-brand-base/40 p-6">
          {investigationSteps.map((step, index) => {
            const completed = index < investigationPhase;
            const current = index === investigationPhase;

            return (
              <div
                key={step}
                className={cn(
                  'flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300',
                  current ? 'bg-white/[0.04] ring-1 ring-brand-gray/10' : completed ? 'opacity-100' : 'opacity-40',
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border',
                      completed
                        ? 'border-brand-accent/20 bg-brand-accent text-white'
                        : current
                          ? 'border-brand-accent/30 text-brand-accent'
                          : 'border-brand-gray/20 text-brand-gray',
                    )}
                  >
                    {completed ? '✓' : current ? <span className="h-2 w-2 animate-pulse rounded-full bg-brand-accent" /> : null}
                  </div>
                  <span className="text-base font-medium text-brand-light">{step}</span>
                </div>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]',
                    completed
                      ? 'bg-brand-accent/10 text-brand-accent'
                      : current
                        ? 'bg-white/[0.05] text-brand-light'
                        : 'text-brand-gray',
                  )}
                >
                  {completed ? 'Listo' : current ? 'Ahora' : 'Siguiente'}
                </span>
              </div>
            );
          })}

          <div className="mt-8 flex flex-col items-center gap-3 pt-2 text-center">
            <p className="text-sm text-brand-muted">
              Si ya quieres ver la siguiente etapa, puedes continuar ahora.
            </p>
            <button
              type="button"
              onClick={() => void beginConversationFromInvestigation()}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gray/20 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-brand-light transition-all hover:bg-white/[0.07] hover:border-brand-gray/30"
            >
              Pasar a conversacion
              <Icon name="arrow_forward" className="text-base" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'conversing') {
    return (
      <div className="surface-tint-soft grid w-full grid-rows-[auto_auto_auto_1fr_auto] overflow-hidden rounded-[2.5rem] border border-brand-gray/10 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-brand-gray/10 bg-brand-base/50 px-8 py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">Caso ya estudiado</p>
              <h3 className="mt-2 font-headline text-2xl font-bold tracking-tight text-brand-light md:text-3xl">
                Ahora conversemos sobre lo encontrado
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-muted">
                Ya revise tu caso y prepare una recomendacion inicial. Escucha la explicacion y, cuando quieras intervenir, usa el microfono de abajo.
              </p>
            </div>

            <div className={cn('rounded-[1.25rem] border px-5 py-4 md:max-w-[18rem]', recommendation.tone)}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Recomendacion inicial</p>
              <p className="mt-2 font-headline text-xl font-bold tracking-tight">{recommendation.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-light/80">{recommendation.summary}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-brand-light/55">
                {researchResult?.sources.length ? `${researchResult.sources.length} fuentes revisadas` : 'Lectura inicial lista'}
              </p>
              <button
                onClick={endConsultation}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-gray/20 bg-black/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light transition-all hover:border-transparent hover:bg-[#E53D1E] hover:shadow-[0_10px_30px_rgba(229,61,30,0.18)]"
              >
                <Icon name="cancel" className="text-base" />
                Terminar
              </button>
            </div>
          </div>
        </div>

        {researchResult ? (
          <div className="border-b border-brand-gray/10 px-8 py-5">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-[1.25rem] border border-brand-gray/10 bg-brand-base/35 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">Lo que ya revise</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{researchResult.summary}</p>
              </div>

              {researchResult.sources.length ? (
                <div className="flex flex-wrap gap-2">
                  {researchResult.sources.slice(0, 3).map((source: CaseResearchResult['sources'][number]) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-gray/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-brand-light transition-colors hover:bg-white/[0.06]"
                    >
                      <Icon name="link" className="text-brand-accent" />
                      <span className="truncate max-w-[220px]">{source.title}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="border-b border-brand-gray/10 px-8 py-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gray">
              {voiceMode === 'speaking' ? 'Agente hablando' : voiceMode === 'user_turn' ? 'Tu turno' : 'Consulta activa'}
            </div>

            <div className="w-full overflow-hidden rounded-[2rem] border border-brand-gray/10 bg-brand-base/45 px-8 py-8 md:px-12 md:py-10">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.02)_0%,_rgba(255,255,255,0.008)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,126,69,0.12)_0%,_rgba(255,126,69,0.025)_28%,_rgba(11,12,16,0)_62%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,210,150,0.08)_0%,_rgba(255,210,150,0.015)_24%,_rgba(11,12,16,0)_58%)]" />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_80px_rgba(255,126,69,0.05)]" />

              <div className="relative z-10 mb-6 flex items-center justify-end">
                <button
                  type="button"
                  onClick={copyAgentTranscript}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-gray/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-light transition-colors hover:bg-white/[0.07]"
                >
                  <Icon name={copiedTranscript ? 'check_circle' : 'content_copy'} className="text-sm" />
                  {copiedTranscript ? 'Copiado' : 'Copiar'}
                </button>
              </div>

              <div className="relative flex min-h-[12rem] flex-col items-center justify-center gap-10">
                <div className="max-w-[36rem] text-center font-headline text-[1.55rem] font-semibold leading-[1.24] tracking-[-0.03em] text-brand-light md:text-[2rem] md:leading-[1.18]">
                  {visibleTeleprompterWords.length > 0 ? (
                    visibleTeleprompterWords.map((word, index) => {
                      const isCurrent = index === visibleTeleprompterWords.length - 1 && voiceMode === 'speaking';
                      return (
                        <span
                          key={`${word}-${index}`}
                          className={cn(
                            'relative inline-block px-[0.16em] transition-all duration-200',
                            isCurrent
                              ? 'text-[#FFF8EE] after:absolute after:inset-x-[-0.03em] after:inset-y-[-0.06em] after:-z-10 after:rounded-[0.45em] after:bg-[linear-gradient(180deg,_rgba(255,248,236,0.28)_0%,_rgba(255,198,112,0.42)_34%,_rgba(255,128,62,0.34)_100%)] after:shadow-[0_0_30px_rgba(255,126,69,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] after:content-[""]'
                              : 'text-brand-light/86',
                          )}
                        >
                          {word}&nbsp;
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-brand-light/80">Estoy preparando la explicacion para ti...</span>
                  )}
                </div>

                <div className="flex h-24 items-center justify-center">
                  {voiceMode === 'speaking' ? (
                    <AgentWaveform active={true} pulse={agentAudioPulse} />
                  ) : (
                    <div className="flex items-center justify-center gap-[4px] opacity-50">
                      {waveformBars.slice(4, 15).map((height, index) => (
                        <span
                          key={`resting-${height}-${index}`}
                          className="w-[4px] rounded-full bg-brand-gray/35"
                          style={{ height: `${Math.max(12, height * 22)}px` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <button
                type="button"
                onClick={requestVoiceTurn}
                className={cn(
                  'group relative flex h-24 w-24 items-center justify-center rounded-full border transition-all duration-300',
                  voiceMode === 'speaking'
                    ? 'border-brand-accent/30 bg-brand-accent/10 text-brand-accent shadow-[0_0_40px_rgba(255,75,42,0.18)] hover:scale-105'
                    : voiceMode === 'user_turn'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400 shadow-[0_0_36px_rgba(52,211,153,0.16)]'
                      : 'border-brand-gray/20 bg-brand-base text-brand-light hover:border-brand-accent/20 hover:text-brand-accent hover:scale-105',
                )}
                title={voiceMode === 'speaking' ? 'Interrumpir al agente' : 'Hablar'}
              >
                <div className={cn('absolute inset-0 rounded-full transition-opacity duration-300', voiceMode === 'speaking' ? 'opacity-100' : 'opacity-0')}>
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,126,69,0.18)_0%,_rgba(255,126,69,0)_68%)]" />
                </div>
                <Icon name="mic" className="relative z-10 text-3xl" />
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-brand-muted">
              {voiceMode === 'speaking'
                ? 'Toca el microfono para interrumpir y tomar la palabra.'
                : voiceMode === 'user_turn'
                  ? 'Habla ahora. Cuando termines, el agente retomara la consulta.'
                  : 'El microfono esta listo para ti.'}
            </p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <header className="mb-10">
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-brand-light">Nueva Consulta</h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-brand-muted">
          Cuentame que pasa. Puedes escribir con libertad, pegar un enlace, adjuntar un documento o dictar tu caso con el microfono.
        </p>
      </header>

      <section className="surface-tint-soft relative overflow-hidden rounded-[2rem] border border-brand-gray/10 p-8 shadow-sm backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,75,42,0.08)_0%,_rgba(11,12,16,0)_70%)] blur-2xl" />

        <div className="relative z-10 flex flex-col gap-5 rounded-[2rem] border border-brand-gray/10 bg-brand-base/55 p-4 shadow-inner md:p-5">
          {attachments.length > 0 ? (
            <div className="flex flex-wrap gap-2 px-2 pt-2">
              {attachments.map((attachment) => (
                <button
                  key={attachment.id}
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="surface-tint-soft flex items-center gap-2 rounded-full border border-brand-gray/10 px-3 py-1.5 text-xs font-medium text-brand-light"
                >
                  <Icon name="description" className="text-sm text-brand-gray" />
                  <span className="max-w-[180px] truncate">{attachment.name}</span>
                  <Icon name="cancel" className="text-sm text-brand-gray" />
                </button>
              ))}
            </div>
          ) : null}

          {dictationHint ? (
            <div className="flex flex-wrap items-center gap-3 px-2 text-sm text-brand-muted">
              <p>{dictationHint}</p>
              {/Pro|evaluaciones gratis/i.test(dictationHint) ? (
                <a
                  href="/api/billing/checkout"
                  className="rounded-full border border-brand-accent/20 bg-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                >
                  Activar Pro
                </a>
              ) : null}
            </div>
          ) : null}

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Cuenta lo que te preocupa, pega un enlace o resume tu caso con tus propias palabras..."
            className="min-h-[220px] w-full resize-none bg-transparent px-4 py-4 text-lg leading-relaxed text-brand-light outline-none placeholder:text-brand-gray/45"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitIntake();
              }
            }}
          />

          <div className="flex items-center justify-between border-t border-brand-gray/5 pt-4">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.mp3,.wav"
              multiple
              onChange={(event) => handleAttachFiles(event.target.files)}
            />

            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachMenu((current) => !current)}
                className="flex h-12 w-12 items-center justify-center rounded-full text-brand-gray transition-colors hover:bg-white/[0.04] hover:text-brand-light"
                title="Adjuntar"
              >
                <Icon name="add" className="text-xl" />
              </button>

              {showAttachMenu ? (
                <div className="absolute bottom-14 left-0 w-52 rounded-2xl border border-brand-gray/10 bg-brand-base p-2 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachMenu(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-brand-light transition-colors hover:bg-white/[0.04]"
                  >
                    <Icon name="attach_file" className="text-brand-gray" />
                    Adjuntar archivo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrompt((current) => `${current}${current ? ' ' : ''}Pega aqui un enlace: `);
                      setShowAttachMenu(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-brand-light transition-colors hover:bg-white/[0.04]"
                  >
                    <Icon name="link" className="text-brand-gray" />
                    Agregar enlace
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={startPromptDictation}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full transition-all',
                  dictationTarget === 'prompt'
                    ? 'bg-brand-accent text-white shadow-[0_0_24px_rgba(255,75,42,0.25)]'
                    : 'text-brand-gray hover:bg-white/[0.04] hover:text-brand-light',
                )}
                title="Dictar al campo"
              >
                <Icon name="mic" className="text-xl" />
              </button>
            </div>

            <button
              type="button"
              onClick={submitIntake}
              disabled={!prompt.trim() && attachments.length === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-[#0B0C10] shadow-[0_0_24px_rgba(236,240,235,0.14)] transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
              title="Enviar"
            >
              <Icon name="arrow_forward" className="text-2xl" />
            </button>
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray/50">
        <div className="flex items-center gap-2">
          <Icon name="check_circle" className="text-emerald-500/60" />
          <span>Texto, voz y archivos</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="check_circle" className="text-emerald-500/60" />
          <span>Analisis previo del caso</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="bolt" className="text-brand-accent/60" />
          <span>Consulta guiada y natural</span>
        </div>
      </div>
    </div>
  );
}
