import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
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
  const location = useLocation()
  const { profile, opportunities, trackedApplications, theme, setTheme } = useCareerku()

  const [showNotifPopover, setShowNotifPopover] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const indicatorRef = useRef<HTMLSpanElement | null>(null)
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const hasPositionedIndicatorRef = useRef(false)
  const prevActiveNavRef = useRef<string | null>(null)
  const notifPopoverRef = useRef<HTMLDivElement | null>(null)
  const themeIconRef = useRef<HTMLSpanElement | null>(null)
  const prevThemeRef = useRef(theme)

  const activeNavTo =
    NAV_ITEMS.find(
      (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
    )?.to ?? null

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('[data-nav="group"]', {
          y: -10,
          opacity: 0,
          duration: 0.42,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform',
        })
      },
      headerRef,
    )
    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    const indicator = indicatorRef.current
    if (!indicator) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const activeEl = activeNavTo ? tabRefs.current[activeNavTo] : null

    if (!activeEl || activeEl.offsetWidth === 0) {
      gsap.set(indicator, { opacity: 0 })
    } else {
      const { offsetLeft, offsetWidth } = activeEl
      if (!hasPositionedIndicatorRef.current || prefersReducedMotion) {
        gsap.set(indicator, { x: offsetLeft, width: offsetWidth, opacity: 1 })
        hasPositionedIndicatorRef.current = true
      } else {
        gsap.to(indicator, {
          x: offsetLeft,
          width: offsetWidth,
          opacity: 1,
          duration: 0.36,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
    }

    if (
      activeNavTo &&
      prevActiveNavRef.current !== null &&
      prevActiveNavRef.current !== activeNavTo &&
      !prefersReducedMotion
    ) {
      const targets = [
        navRef.current?.querySelector(`[data-nav-icon="${activeNavTo}"]`),
        document.querySelector(`[data-mobile-nav-icon="${activeNavTo}"]`),
      ].filter((el): el is Element => el !== null && el !== undefined)

      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { scale: 0.78 },
          {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(2)',
            clearProps: 'transform',
            overwrite: 'auto',
          },
        )
      }
    }

    prevActiveNavRef.current = activeNavTo
  }, [activeNavTo])

  useEffect(() => {
    let mounted = true
    const syncIndicator = () => {
      if (!mounted) return
      const indicator = indicatorRef.current
      const activeEl = activeNavTo ? tabRefs.current[activeNavTo] : null
      if (!indicator) return
      if (!activeEl || activeEl.offsetWidth === 0) {
        gsap.set(indicator, { opacity: 0 })
        return
      }
      gsap.set(indicator, { x: activeEl.offsetLeft, width: activeEl.offsetWidth, opacity: 1 })
      hasPositionedIndicatorRef.current = true
    }

    window.addEventListener('resize', syncIndicator)
    document.fonts?.ready?.then(syncIndicator)

    return () => {
      mounted = false
      window.removeEventListener('resize', syncIndicator)
    }
  }, [activeNavTo])

  useLayoutEffect(() => {
    if (!showNotifPopover || !notifPopoverRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const popover = notifPopoverRef.current
    gsap.fromTo(
      popover,
      { y: -8, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out', clearProps: 'transform' },
    )

    const items = popover.querySelectorAll('li')
    if (items.length > 0) {
      gsap.from(items, {
        y: 6,
        opacity: 0,
        duration: 0.22,
        stagger: 0.035,
        ease: 'power2.out',
        clearProps: 'transform',
      })
    }
  }, [showNotifPopover])

  useLayoutEffect(() => {
    if (prevThemeRef.current === theme) return
    prevThemeRef.current = theme

    if (!themeIconRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      themeIconRef.current,
      { rotate: -45, scale: 0.72, opacity: 0.4 },
      {
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: 0.34,
        ease: 'back.out(1.8)',
        clearProps: 'transform',
      },
    )
  }, [theme])

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
      <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--bg-shell)]">
        {/* Main Column */}
        <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          {/* Top Bar: Brand Pill + Centered Navigation Pill Tabs + Right Actions */}
          <header ref={headerRef} className="px-4 pb-2 pt-4 sm:px-6 sm:pt-5 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3">
              {/* Left Brand Pill */}
              <div data-nav="group" className="flex min-w-0 items-center">
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
                ref={navRef}
                data-nav="group"
                aria-label="Primary workspace tabs"
                className="relative hidden items-center gap-1 rounded-full border border-[var(--border-subtle)]/80 bg-[var(--bg-card)] p-1 shadow-2xs lg:flex"
              >
                <span
                  ref={indicatorRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-[#191b1e] opacity-0 shadow-xs dark:bg-[#f1f2ea]"
                />
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      ref={(el) => {
                        tabRefs.current[item.to] = el
                      }}
                      className={({ isActive }) =>
                        `relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200 ${
                          isActive
                            ? 'text-white dark:text-[#181a18]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]/70 hover:text-[var(--text-primary)]'
                        }`
                      }
                    >
                      <span data-nav-icon={item.to} className="inline-flex">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                      </span>
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </nav>

              {/* Right Controls */}
              <div data-nav="group" className="flex shrink-0 items-center gap-2">
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
                      <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--cat-scholarship)] ring-2 ring-[var(--bg-card)]" />
                    )}
                  </button>

                  {showNotifPopover && (
                    <div
                      ref={notifPopoverRef}
                      className="careerku-toast absolute right-0 top-12 z-40 w-80 rounded-2xl p-4"
                    >
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
                                      ? 'bg-[var(--status-danger-soft)] text-[var(--status-danger-text)]'
                                      : 'bg-[var(--status-success-soft)] text-[var(--status-success-text)]'
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
                  <span ref={themeIconRef} className="inline-flex">
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </span>
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
          <main className="flex-1 px-4 pb-6 pt-1 sm:px-6 sm:pb-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1380px]">{children}</div>
          </main>
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
                <span data-mobile-nav-icon={item.to} className="inline-flex">
                  <Icon className="h-4.5 w-4.5" />
                </span>
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
