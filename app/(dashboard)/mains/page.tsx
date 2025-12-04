'use client'

import { useState } from 'react'
import { FileText, UploadCloud, CheckCircle2, Loader2, Star } from 'lucide-react'

export default function MainsEvaluationPage() {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleEvaluate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!answer.trim()) return
    setLoading(true)
    setScore(null)
    setFeedback(null)

    // Placeholder evaluation until backend endpoint ships
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setScore(71)
    setFeedback(
      'Strong structure with clear intro-body-conclusion. Add counter arguments on cooperative federalism and insert one real case study.'
    )
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">
          Mains evaluator
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">
          Upload answers or type inline; get scoring rubrics, keywords and
          improvement plan.
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Comprehensive evaluation uses Mentor AI + GS specific rubric (content,
          structure, value-add, presentation). Auto integration with document
          ingestion is next.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        <form
          onSubmit={handleEvaluate}
          className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow"
        >
          <label className="text-sm font-semibold text-slate-700">
            Paste your answer (max 500 words)
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-2 h-48 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Analyze the role of cooperative federalism in addressing regional developmental imbalances..."
            />
          </label>

          <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500 transition hover:border-primary/40 hover:bg-primary/5">
            <UploadCloud className="h-8 w-8 text-primary" />
            Upload handwritten answer (PDF / image)
            <input type="file" accept=".pdf,image/*" className="hidden" />
          </label>

          <button
            type="submit"
            disabled={loading || !answer.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Run evaluation
              </>
            )}
          </button>

          {score !== null && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 text-sm text-emerald-800">
              <p className="flex items-center gap-2 text-base font-semibold text-emerald-900">
                <CheckCircle2 className="h-5 w-5" />
                Predicted score: {score}/100
              </p>
              <p className="mt-2">{feedback}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {['Content', 'Structure', 'Value-add'].map((metric, idx) => (
                  <div key={metric} className="rounded-2xl bg-white/70 px-3 py-2 text-center">
                    <p className="text-xs uppercase tracking-wide text-emerald-500">
                      {metric}
                    </p>
                    <p className="text-lg font-bold text-emerald-800">
                      {idx === 0 ? '24/30' : idx === 1 ? '18/20' : '29/40'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Question bank
            </p>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl bg-slate-50 p-3">
                GS2: How far cooperative federalism has worked post GST?
              </li>
              <li className="rounded-2xl bg-slate-50 p-3">
                GS3: Evaluate Atmanirbhar Bharat in boosting manufacturing.
              </li>
              <li className="rounded-2xl bg-slate-50 p-3">
                GS4: Discuss ethical issues in AI-based policing.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-primary shadow">
            <p className="text-xs uppercase tracking-wide">Rubric update</p>
            <p className="mt-2 text-sm text-primary/90">
              UPSC 2023 toppers emphasised diagrams & committees — rubric now awards +5 for value-add sections.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary/70">
              <Star className="h-4 w-4" />
              Rope in mentors for human review (coming soon)
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

