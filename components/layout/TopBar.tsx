'use client'

import { Menu, Bell, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

const titleMap: Record<
  string,
  { title: string; subtitle: string; pill: string }
> = {
  '/mentor': {
    title: 'Mentor AI',
    subtitle: 'Conversational RAG copilot for UPSC prelims & mains',
    pill: 'Real-time RAG',
  },
  '/current': {
    title: 'Current Affairs',
    subtitle: 'Daily briefs powered by live web + trusted journals',
    pill: 'Web Search Beta',
  },
  '/mains': {
    title: 'Mains Evaluation',
    subtitle: 'Upload answers, get instant scoring and feedback rubrics',
    pill: 'Evaluator v1.0',
  },
  '/mcqs': {
    title: 'MCQ Testing Lab',
    subtitle: 'Adaptive prelims simulator with analytics',
    pill: 'New',
  },
}

type Props = {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: Props) {
  const pathname = usePathname()
  const meta = titleMap[pathname] ?? {
    title: 'Ignize AI',
    subtitle: 'Intelligent UPSC assistant',
    pill: 'Alpha',
  }

  const today = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date())
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 xl:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 xl:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                {meta.title}
              </h1>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {meta.pill}
              </span>
            </div>
            <p className="text-sm text-slate-500">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Prelims 2025 Sprint
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Today
            </span>
            <span className="font-semibold text-slate-800">{today}</span>
          </div>
          <button className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-primary">
            <Bell className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-1 xl:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white font-semibold">
              SS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Shushruth</p>
              <p className="text-xs text-slate-500">Ignite+ beta</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

