import { Globe, RefreshCcw, ExternalLink } from 'lucide-react'

const briefs = [
  {
    title: 'Arctic Council emergency session on methane thaw',
    summary:
      'India backs a science-first monitoring grid with IMD + ISRO instruments to track methane BELT anomalies through 2025.',
    sources: ['The Hindu • 24 Nov', 'DownToEarth • Explainer'],
  },
  {
    title: 'PIB: Jal Jeevan Mission unlocks final tranche',
    summary:
      'Dashboard shows 76% tap coverage. Northeastern states to receive an additional ₹5,000 crore tied to water quality audits.',
    sources: ['PIB Release', 'PRS Legislative Research'],
  },
  {
    title: 'Supreme Court flags AI audit for deepfakes',
    summary:
      'Court sought draft guidelines within 3 weeks; MeitY to table Digital India Bill note on watermark + rapid takedown cells.',
    sources: ['Indian Express', 'LiveLaw'],
  },
]

const timeline = [
  { label: 'Dawn Brief', time: '05:30 IST', focus: 'GS2 Polity' },
  { label: 'Mid-day Pulse', time: '12:00 IST', focus: 'Economy + Reports' },
  { label: 'Last mile wrap', time: '21:30 IST', focus: 'Ethics + Essay cues' },
]

export default function CurrentAffairsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-primary/20 bg-white p-8 shadow-lg shadow-primary/5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              Live Web + Archive
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Current Affairs intelligence with one-tap web search queue
            </h2>
            <p className="mt-3 text-slate-500">
              Curated briefs blend PIB, PRS, The Hindu, Mint & global sources. Web search integration lands next after Mentor
              AI deployment.
            </p>
          </div>
          <div className="rounded-3xl bg-primary/5 px-6 py-4 text-primary">
            <p className="text-xs uppercase tracking-widest">Web search beta</p>
            <p className="text-2xl font-bold">Dec 05 rollout</p>
            <p className="text-xs text-primary/80">Ignize Atlas + Tavily stack</p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-5">
          {briefs.map((brief) => (
            <article
              key={brief.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow"
            >
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
                <Globe className="h-4 w-4 text-primary" />
                Live brief
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {brief.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {brief.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {brief.sources.map((source) => (
                  <span
                    key={source}
                    className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600"
                  >
                    {source}
                  </span>
                ))}
                <button className="ml-auto inline-flex items-center gap-1 text-primary">
                  Open dossier
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Publishing cadence
            </p>
            <div className="mt-4 space-y-4">
              {timeline.map((slot) => (
                <div
                  key={slot.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {slot.label}
                  </p>
                  <p className="text-xs text-slate-500">{slot.time}</p>
                  <p className="text-xs text-slate-500">{slot.focus}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              <RefreshCcw className="h-4 w-4" />
              Trigger web crawl (coming soon)
            </button>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary text-white p-6 shadow">
            <p className="text-xs uppercase tracking-widest text-white/70">
              Daily PDF
            </p>
            <p className="mt-3 text-lg font-semibold leading-snug">
              Get Ignize Atlas PDF every morning with 2-page infographics.
            </p>
            <button className="mt-4 w-full rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25">
              Subscribe via email
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow">
            <p className="font-semibold text-slate-900">Upcoming integrations</p>
            <ul className="mt-3 list-disc space-y-1 pl-4">
              <li>Tavily news search with region filters</li>
              <li>Auto-clustering by GS papers & tags</li>
              <li>One-tap push to Mains evaluator</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

