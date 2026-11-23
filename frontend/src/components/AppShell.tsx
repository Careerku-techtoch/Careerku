import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  Home,
  Moon,
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

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()
  const { profile, opportunities, trackedApplications, theme, setTheme } = useCareerku()

  const [showNotifPopover, setShowNotifPopover] = useState(false)

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
    <>
      <div className="flex min-h-screen w-full flex-col bg-[var(--bg-shell)]">
        {/* Main Column */}
        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          {/* Top Bar: Brand Pill + Centered Navigation Pill Tabs + Right Actions */}
          <header className="px-4 pb-2 pt-4 sm:px-6 sm:pt-5 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              {/* Left Brand Pill */}
              <div className="flex min-w-0 items-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2 shadow-2xs transition-colors hover:border-[var(--border-strong)]"
                >
                  <CareerkuLogo size="sm" showWordmark />
                </button>
              </div>

              {/* Center Horizontal Pill Tabs (Ref 1 & Ref 2 Signature) */}
              <nav
                aria-label="Primary workspace tabs"
                className="hidden items-center gap-1 rounded-full border border-[var(--border-subtle)]/80 bg-[var(--bg-card)] p-1 shadow-2xs md:flex"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-[#191b1e] text-white shadow-xs dark:bg-[#f1f2ea] dark:text-[#181a18]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                        }`
                      }
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </nav>

              {/* Right Controls */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifPopover((v) => !v)}
                    aria-label="Deadline notifications"
                    title="Deadline Reminders"
                    className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-2xs hover:text-[var(--text-primary)]"
                  >
                    <Bell className="h-4 w-4" />
                    {upcomingDeadlines.length > 0 && (
                      <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[var(--bg-card)]" />
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

                {/* Theme Toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  aria-label="Toggle theme"
                  title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-2xs hover:text-[var(--text-primary)]"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>

                {/* Profile Pill */}
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  title={`GPA ${profile.gpa.toFixed(2)} • Semester ${profile.semester}`}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pl-1.5 pr-3 shadow-2xs hover:border-[var(--border-strong)]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#191b1e] text-[11px] font-bold text-white dark:bg-[#f1f2ea] dark:text-[#181a18]">
                    {initials}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-xs font-semibold text-[var(--text-primary)] sm:inline">
                    {profile.name}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-[var(--text-muted)] sm:block" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 px-4 pb-6 pt-1 sm:px-6 sm:pb-6 lg:px-8">{children}</main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/95 px-2 py-2 backdrop-blur md:hidden"
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

      <ToastBanner />
    </>
  )
}
