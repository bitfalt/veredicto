const actions = [
  {
    title: 'Ready-made env setup',
    body: 'Fill `.env.local` from `.env.example` with your ElevenLabs and Firecrawl keys.',
  },
  {
    title: 'API routes included',
    body: 'You already have a health route, Firecrawl search route, and ElevenLabs signed URL route.',
  },
  {
    title: 'Prompt-first folders',
    body: 'The repo includes `docs`, `prompts`, `remotion`, `scripts`, and SDK wrapper folders so future prompts stay organized.',
  },
];

const promptIdeas = [
  'Use AGENTS.MD and give me 10 winning product ideas for this hackathon.',
  'Turn the best idea into a complete build spec with user flow, architecture, tools, and a 75-second demo plan.',
  'Build the smallest MVP slice with ElevenAgents signed URLs, one Firecrawl search tool, and a sources panel.',
];

export function QuickActions() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          Included now
        </p>
        <div className="mt-4 grid gap-4">
          {actions.map((action) => (
            <article key={action.title} className="rounded-2xl border border-white/8 bg-white/6 p-4">
              <h2 className="text-lg font-semibold text-white">{action.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{action.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          Good prompts to use next
        </p>
        <div className="mt-4 grid gap-4">
          {promptIdeas.map((prompt) => (
            <article key={prompt} className="rounded-2xl border border-white/8 bg-white/6 p-4">
              <p className="text-sm leading-6 text-slate-100">{prompt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
