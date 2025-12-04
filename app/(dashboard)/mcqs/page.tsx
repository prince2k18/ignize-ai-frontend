'use client'

import { useState } from 'react'
import { Timer, CheckCircle, Circle, CircleDot } from 'lucide-react'

const sampleQuestion = {
  text: 'With reference to the Compensatory Afforestation Fund Management and Planning Authority (CAMPA), consider the following statements:',
  options: [
    'It is housed under the Ministry of Environment, Forest and Climate Change.',
    'Funds collected are part of the Consolidated Fund of India.',
    'Only Central schemes can utilise CAMPA resources.',
    'States cannot access CAMPA for community forests.',
  ],
  correctIndex: 0,
  explanation:
    'CAMPA is overseen by MoEFCC but funds are kept in a Public Account, available for both Centre and State approved afforestation projects.',
}

const upcomingTests = [
  { title: 'CSAT accuracy drill', time: '25 Nov • 07:00', tags: ['CSAT', 'Reasoning'] },
  { title: 'GS Economy sprint', time: '26 Nov • 21:00', tags: ['GS3', 'Economy'] },
  { title: 'Static Polity mix', time: '27 Nov • 06:30', tags: ['GS2', 'Polity'] },
]

export default function McqLabPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
  }

  const isCorrect = submitted && selected === sampleQuestion.correctIndex

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              MCQ testing lab
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Adaptive prelims simulator with analytics, streaks and AI review.
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Build speed modes (30s quick hits) or deep-dive tests. Detailed explanations arrive after submission.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-6 py-4 text-sm text-slate-600">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <Timer className="h-4 w-4 text-primary" />
              30 questions • 30 minutes
            </p>
            <p className="text-xs text-slate-500">UPSC pattern | Negative marking: -0.66</p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Practice question
          </p>
          <p className="mt-3 text-base text-slate-800">{sampleQuestion.text}</p>
          <ul className="mt-5 space-y-3">
            {sampleQuestion.options.map((option, index) => {
              const active = selected === index
              const correct = submitted && index === sampleQuestion.correctIndex
              const incorrect = submitted && selected === index && !correct

              return (
                <li key={option}>
                  <button
                    onClick={() => {
                      if (!submitted) setSelected(index)
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      correct
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : incorrect
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : active
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    {submitted ? (
                      correct ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : incorrect ? (
                        <CircleDot className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )
                    ) : active ? (
                      <CircleDot className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                    <span>{option}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            onClick={handleSubmit}
            disabled={selected === null || submitted}
            className="mt-5 w-full rounded-2xl bg-primary px-4 py-2 font-semibold text-white shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitted ? 'Checked' : 'Submit & reveal'}
          </button>
          {submitted && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              {isCorrect ? 'Correct! ' : 'Not quite. '}
              {sampleQuestion.explanation}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Upcoming live tests
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {upcomingTests.map((test) => (
                <div
                  key={test.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="font-semibold text-slate-900">{test.title}</p>
                  <p className="text-xs text-slate-500">{test.time}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    {test.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-2 py-0.5 font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-sm text-primary shadow">
            <p className="font-semibold text-primary/90">
              Post-test analytics
            </p>
            <p className="mt-2">
              Accuracy heatmaps, weak-topic radar charts and Mentor AI tips drop into your inbox after every test.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

