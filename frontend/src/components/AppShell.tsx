import { useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  HelpCircle,
  Home,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react'
import { useCareerku } from '@/hooks'
import { formatDateID, getDaysUntilDeadline } from '@/utils'
import { CareerkuLogo } from './CareerkuLogo'
import { ToastBanner } from './ToastBanner'

interface NavItem {
  to: string
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/discover', label: 'Opportunities', icon: Briefcase },
  { to: '/analyze', label: 'AI Analysis', icon: Sparkles },
  { to: '/tracker', label: 'Tracker', icon: ClipboardCheck },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/discover': {
    title: 'Opportunities',
    subtitle: 'Discover internships, competitions, and scholarships matched to your profile',
  },
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Overview of top matches, active document prep, and upcoming deadlines',
  },
  '/analyze': {
    title: 'AI Analysis',
    subtitle: 'Internship skill gap evaluation and personalized portfolio project ideas',
  },
  '/tracker': {
    title: 'Tracker & Docs',
    subtitle: 'Manage CV, motivation letter checklists, application statuses, and deadlines',
  },
  '/profile': {
    title: 'Student Profile',
    subtitle: 'Update academic info and skills to keep match scores accurate',
  },
}

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, opportunities, trackedApplications, theme, setTheme, resetDemoData } =
    useCareerku()

  const [showNotifPopover, setShowNotifPopover] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const currentMeta = PAGE_META[location.pathname] ?? PAGE_META['/discover']

  const upcomingDeadlines = opportunities
    .filter((opp) => trackedApplications.some((t) => t.opportunityId === opp.id))
    .map((opp) => ({
      ...opp,
      daysLeft: getDaysUntilDeadline(opp.deadline),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4)

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] p-0 sm:p-3 lg:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col overflow-hidden bg-[var(--bg-shell)] sm:min-h-[calc(100vh-1.5rem)] sm:rounded-[28px] sm:border sm:border-[var(--border-subtle)] lg:min-h-[calc(100vh-2rem)] lg:flex-row">
        {/* Desktop Slim Left Icon Sidebar */}
        <aside className="hidden w-[76px] shrink-0 flex-col items-center justify-between py-5 pl-3 pr-1 lg:flex">
          <div className="flex h-full w-14 flex-col items-center justify-between rounded-[26px] bg-[var(--bg-sheet)] py-3 shadow-[0_1px_2px_rgba(24,28,22,0.03)]">
            {/* Brand Logo */}
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Back to Careerku Welcome Page"
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <CareerkuLogo size="md" badge inverted />
            </button>

            {/* Center Nav Icons */}
            <nav aria-label="Main navigation" className="flex flex-col items-center gap-2.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={item.label}
                    className={({ isActive }) =>
                      `group relative flex h-10 w-10 items-center justify-center rounded-full ${
                        isActive
                          ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </NavLink>
                )
              })}
            </nav>

            {/* Bottom Controls (Theme Switcher + Reset Demo) */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-1 rounded-full bg-[var(--bg-card)] p-1 shadow-[0_1px_2px_rgba(24,28,22,0.03)]">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  aria-label="Dark mode"
                  title="Dark mode"
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                    theme === 'dark'
                      ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  aria-label="Light mode"
                  title="Light mode"
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                    theme === 'light'
                      ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={resetDemoData}
                aria-label="Reset demo data"
                title="Reset demo data"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Column */}
        <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          {/* Unified Floating Pill Top Header Bar */}
          <header className="px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
            <div className="relative flex items-center justify-between gap-4 rounded-full bg-[var(--bg-sheet)] py-2 pl-4 pr-2.5 shadow-[0_1px_2px_rgba(24,28,22,0.03)] sm:py-2.5 sm:pl-6 sm:pr-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* Mobile Brand Mark */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  aria-label="Careerku Welcome Page"
                  className="shrink-0 cursor-pointer lg:hidden"
                >
                  <CareerkuLogo size="sm" badge inverted />
                </button>
                <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-[22px]">
                  {currentMeta.title}
                </h1>
              </div>

              {/* Right Controls Nested Inside the Unified Header Pill */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHelpModal((v) => !v)}
                  aria-label="Careerku 7-Stage Guide"
                  title="Careerku 7-Stage Guide"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-[0_1px_2px_rgba(24,28,22,0.04)] hover:text-[var(--text-primary)]"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifPopover((v) => !v)}
                    aria-label="Deadline notifications"
                    title="Deadline Reminders"
                    className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-[0_1px_2px_rgba(24,28,22,0.04)] hover:text-[var(--text-primary)]"
                  >
                    <Bell className="h-4 w-4" />
                    {upcomingDeadlines.length > 0 && (
                      <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>

                  {showNotifPopover && (
                    <div className="careerku-toast absolute right-0 top-12 z-40 w-80 rounded-2xl p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          Deadline Reminders
                        </span>
                        <span className="rounded-full bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                          {upcomingDeadlines.length} tracked
                        </span>
                      </div>
                      {upcomingDeadlines.length === 0 ? (
                        <p className="text-xs text-[var(--text-secondary)]">
                          No opportunities saved to Tracker yet.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {upcomingDeadlines.map((item) => (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowNotifPopover(false)
                                  navigate('/tracker')
                                }}
                                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-[var(--bg-subtle)] px-3 py-2 text-left hover:bg-[var(--bg-subtle-hover)]"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-[var(--text-secondary)]">
                                    {item.organization} • {formatDateID(item.deadline)}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    item.daysLeft <= 14
                                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                  }`}
                                >
                                  D-{Math.max(0, item.daysLeft)}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Theme Toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  aria-label="Toggle theme"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-[0_1px_2px_rgba(24,28,22,0.04)] lg:hidden"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>

                {/* Profile Pill */}
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  title={`GPA ${profile.gpa.toFixed(2)} • Semester ${profile.semester}`}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-[var(--bg-card)] py-1 pl-1.5 pr-3 shadow-[0_1px_2px_rgba(24,28,22,0.04)] hover:bg-[var(--bg-card)]/90"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--btn-primary-bg)] text-[11px] font-bold text-[var(--btn-primary-text)]">
                    {initials}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-xs font-medium text-[var(--text-primary)] sm:inline">
                    {profile.name}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-[var(--text-muted)] sm:block" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 px-4 pb-6 pt-1 sm:px-6 sm:pb-6">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/95 px-2 py-2 backdrop-blur lg:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium ${
                    isActive
                      ? 'bg-[var(--bg-subtle)] font-semibold text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)]'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Quick 7-Stage Guide Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="careerku-card w-full max-w-lg rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Careerku 7-Stage Core Flow
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  How Careerku guides undergraduate students from discovery to application
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="careerku-btn-secondary cursor-pointer rounded-full px-3 py-1 text-xs font-medium"
              >
                Close
              </button>
            </div>
            <ol className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li className="rounded-xl bg-[var(--bg-subtle)] p-3">
                <strong className="text-[var(--text-primary)]">1. Register & Profile:</strong> Fill
                in your GPA, semester, major, and skills in <em>Profile</em>.
              </li>
              <li className="rounded-xl bg-[var(--bg-subtle)] p-3">
                <strong className="text-[var(--text-primary)]">2–3. Discover & Match:</strong>{' '}
                Browse verified internships, competitions, and scholarships with automatic
                rule-based matching.
              </li>
              <li className="rounded-xl bg-[var(--bg-subtle)] p-3">
                <strong className="text-[var(--text-primary)]">4–5. Analyze & Improve (AI):</strong>{' '}
                Identify internship skill gaps alongside personalized learning steps and portfolio
                project ideas.
              </li>
              <li className="rounded-xl bg-[var(--bg-subtle)] p-3">
                <strong className="text-[var(--text-primary)]">6–7. Apply & Track:</strong> Prepare
                CVs, motivation letters, and document checklists while tracking statuses and
                deadlines in <em>Tracker</em>.
              </li>
            </ol>
          </div>
        </div>
      )}

      <ToastBanner />
    </div>
  )
}
