'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sparkles,
  Newspaper,
  PenSquare,
  CheckSquare,
  Activity,
  HelpCircle,
  X,
  PenTool,
} from 'lucide-react'
import { useMemo } from 'react'

type SidebarProps = {
  isMobileOpen: boolean
  onClose: () => void
}

const navItems = [
  {
    label: 'Mentor AI',
    description: 'Chat-based personalised guidance',
    href: '/mentor',
    icon: Sparkles,
  },
  {
    label: 'Current Affairs',
    description: 'Daily briefs with web search',
    href: '/current',
    icon: Newspaper,
  },
  {
    label: 'Mains Evaluation',
    description: 'Upload answers for instant scoring',
    href: '/mains',
    icon: PenSquare,
  },
  {
    label: 'MCQ Lab',
    description: 'Timed prelims simulator',
    href: '/mcqs',
    icon: CheckSquare,
  },
  {
    label: 'Handwriting OCR',
    description: 'Upload handwritten answers',
    href: '/handwriting',
    icon: PenTool,
  },
]

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const year = useMemo(() => new Date().getFullYear(), [])

  const content = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white font-semibold">
            IA
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Ignize AI
            </p>
            <p className="text-lg font-bold text-slate-900">Mentor Suite</p>
          </div>
        </div>
        <button
          className="xl:hidden rounded-full border border-slate-200 p-1.5 text-slate-500 hover:text-slate-900"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group block rounded-2xl border px-4 py-3 transition-all ${
                  active
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-transparent bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'bg-white text-slate-500 group-hover:text-primary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 space-y-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            Prelims 2025
          </p>
          <p className="text-lg font-bold leading-6">
            Fast-track your revision with curated tests and mentoring.
          </p>
          <button className="w-full rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25">
            Upgrade to Ignite+
          </button>
        </div>
      </nav>

      <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          System status: <span className="font-semibold text-emerald-600">All green</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <HelpCircle className="h-4 w-4" />
          Need help? <a href="mailto:support@ignize.ai" className="text-primary font-semibold">support@ignize.ai</a>
        </div>
        <p className="mt-3 text-xs text-slate-400">© {year} Ignize AI Labs.</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden h-full w-72 border-r border-slate-100 xl:flex">
        {content}
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-100 bg-white shadow-2xl transition-transform duration-300 xl:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  )
}

