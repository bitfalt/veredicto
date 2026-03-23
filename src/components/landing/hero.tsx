const stack = [
  'ElevenAgents signed URLs',
  'Firecrawl Search API',
  'Next.js App Router',
  'Tailwind CSS v4',
];

export function Hero() {
  return (
    <section className="overflow-hidden rounded-[32px] border border-white/12 bg-white/6 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200/80">
            <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1">
              ElevenHacks starter
            </span>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-200/80">
              Prompt-first repo
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <p className="font-[family-name:var(--font-serif)] text-4xl leading-tight md:text-6xl">
              Build a voice product with live web grounding, fast.
            </p>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              This starter gives you the basic routes, folders, environment setup, and
              product structure to build an ElevenAgents + Firecrawl demo without
              starting from zero.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <a
              className="rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
              href="/api/health"
            >
              Check starter health
            </a>
            <a
              className="rounded-full border border-white/15 bg-white/8 px-5 py-3 font-semibold transition hover:bg-white/12"
              href="https://hacks.elevenlabs.io/hackathons/0"
              target="_blank"
              rel="noreferrer"
            >
              Open hackathon brief
            </a>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Starter stack
            </p>
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="space-y-3">
            {stack.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4 text-sm leading-6 text-cyan-50">
            Use `AGENTS.MD` as the operating manual, then ask for ideas, a build spec,
            or a first MVP slice.
          </div>
        </div>
      </div>
    </section>
  );
}
