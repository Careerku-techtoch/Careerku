import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react'
import {
  CareerkuMatchGauge,
  DeadlinePulseGlyph,
  DocumentReadyGlyph,
  HighMatchGlyph,
  MatchIndexGlyph,
} from '@/components'
import type { OpportunityCategory } from '@/types'
import { useCareerku } from '@/hooks'
import { formatDateID, getCategoryLabel, getDaysUntilDeadline, getStatusLabel } from '@/utils'

const CATEGORY_ACCENTS: Record<
  OpportunityCategory,
  {
    topBar: string
    dot: string
    calendarTile: string
    badge: string
  }
> = {
  internship: {
    topBar: 'bg-sky-500',
    dot: 'bg-sky-500',
    calendarTile:
      'bg-sky-100 text-sky-950 ring-1 ring-sky-300 dark:bg-sky-500/25 dark:text-sky-100 dark:ring-sky-400/40',
    badge: 'bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200',
  },
  scholarship: {
    topBar: 'bg-amber-500',
    dot: 'bg-amber-500',
    calendarTile:
      'bg-amber-100 text-amber-950 ring-1 ring-amber-300 dark:bg-amber-500/25 dark:text-amber-100 dark:ring-amber-400/40',
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
  },
  competition: {
    topBar: 'bg-rose-500',
    dot: 'bg-rose-500',
    calendarTile:
      'bg-rose-100 text-rose-950 ring-1 ring-rose-300 dark:bg-rose-500/25 dark:text-rose-100 dark:ring-rose-400/40',
    badge: 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200',
  },
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

function getBarToneClass(value: number): string {
  if (value >= 75) return 'bg-emerald-500 dark:bg-emerald-400'
  if (value >= 55) return 'bg-amber-500 dark:bg-amber-400'
  return 'bg-rose-500 dark:bg-rose-400'
}

export function DashboardPage() {
  const navigate = useNavigate()
  const {
    profile,
    opportunities,
    trackedApplications,
    openOpportunityDetail,
    toggleDocumentItem,
  } = useCareerku()

  const [categoryFilter, setCategoryFilter] = useState<'all' | OpportunityCategory>('all')

  const initialCalendarDate = useMemo(() => {
    const firstDeadline = opportunities
      .map((o) => new Date(o.deadline))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())[0]
    return firstDeadline ?? new Date(2026, 11, 1)
  }, [opportunities])

  const [calendarMonth, setCalendarMonth] = useState(() => ({
    year: initialCalendarDate.getFullYear(),
    month: initialCalendarDate.getMonth(),
  }))

  const firstName = profile.name.split(' ')[0] || 'Student'

  const highMatches = useMemo(
    () =>
      opportunities
        .filter((o) => o.match.tier === 'high')
        .sort((a, b) => b.match.score - a.match.score),
    [opportunities],
  )

  const avgScore = useMemo(
    () =>
      Math.round(
        opportunities.reduce((sum, item) => sum + item.match.score, 0) /
          Math.max(1, opportunities.length),
      ),
    [opportunities],
  )

  const urgentDeadlines = useMemo(
    () =>
      opportunities
        .filter((o) => {
          const days = getDaysUntilDeadline(o.deadline)
          return days >= 0 && days <= 14
        })
        .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline)),
    [opportunities],
  )

  const allTrackedDocs = useMemo(() => {
    return trackedApplications.flatMap((app) => {
      const opp = opportunities.find((o) => o.id === app.opportunityId)
      if (!opp) return []
      return app.documents.map((doc) => ({
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        organization: opp.organization,
        docId: doc.id,
        docLabel: doc.label,
        category: doc.category,
        completed: doc.completed,
        deadline: opp.deadline,
      }))
    })
  }, [trackedApplications, opportunities])

  // Prioritize incomplete items first so actionable tasks remain visible at the top
  const prioritizedChecklistDocs = useMemo(() => {
    return [...allTrackedDocs]
      .sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
        return getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline)
      })
      .slice(0, 5)
  }, [allTrackedDocs])

  const completedDocsCount = allTrackedDocs.filter((d) => d.completed).length
  const docReadyPct =
    allTrackedDocs.length > 0
      ? Math.round((completedDocsCount / allTrackedDocs.length) * 100)
      : 0
  const highMatchPct = Math.round(
    (highMatches.length / Math.max(1, opportunities.length)) * 100,
  )
  const appliedCount = trackedApplications.filter(
    (app) => app.status === 'applied' || app.status === 'interview',
  ).length

  const trackedCards = useMemo(() => {
    const list = trackedApplications
      .map((app) => {
        const opp = opportunities.find((o) => o.id === app.opportunityId)
        if (!opp) return null
        const doneCount = app.documents.filter((d) => d.completed).length
        const totalCount = Math.max(1, app.documents.length)
        const progressPct = Math.round((doneCount / totalCount) * 100)
        return {
          app,
          opp,
          doneCount,
          totalCount,
          progressPct,
          daysLeft: Math.max(0, getDaysUntilDeadline(opp.deadline)),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.daysLeft - b.daysLeft)

    if (categoryFilter === 'all') return list.slice(0, 3)
    return list.filter((item) => item.opp.category === categoryFilter).slice(0, 3)
  }, [trackedApplications, opportunities, categoryFilter])

  const breakdownRows = useMemo(() => {
    const getCategoryStats = (cat: OpportunityCategory) => {
      const items = opportunities.filter((o) => o.category === cat)
      const avg =
        items.length > 0
          ? Math.round(items.reduce((acc, i) => acc + i.match.score, 0) / items.length)
          : 0
      return { avg, count: items.length }
    }

    const intern = getCategoryStats('internship')
    const comp = getCategoryStats('competition')
    const scholar = getCategoryStats('scholarship')
    const gpaScore = Math.min(100, Math.round((profile.gpa / 4) * 100))
    const skillScore = Math.min(100, profile.skills.length * 10)

    return [
      {
        label: 'Internships Average',
        helper: `${intern.count} verified listings`,
        value: intern.avg,
      },
      {
        label: 'Competitions Average',
        helper: `${comp.count} verified listings`,
        value: comp.avg,
      },
      {
        label: 'Scholarships Average',
        helper: `${scholar.count} verified listings`,
        value: scholar.avg,
      },
      {
        label: 'GPA Standing',
        helper: `GPA ${profile.gpa.toFixed(2)} / 4.00`,
        value: gpaScore,
      },
      {
        label: 'Skills Coverage',
        helper: `${profile.skills.length} verified skills`,
        value: skillScore,
      },
      {
        label: 'Document Readiness',
        helper: `${completedDocsCount} of ${allTrackedDocs.length} documents ready`,
        value: docReadyPct,
      },
    ]
  }, [
    opportunities,
    profile.gpa,
    profile.skills.length,
    completedDocsCount,
    allTrackedDocs.length,
    docReadyPct,
  ])

  const calendarData = useMemo(() => {
    const { year, month } = calendarMonth
    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7

    const deadlineByDay = new Map<
      number,
      {
        opp: (typeof opportunities)[number]
        isTracked: boolean
        tileClass: string
      }[]
    >()

    opportunities.forEach((opp) => {
      const d = new Date(opp.deadline)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate()
        const isTracked = trackedApplications.some((t) => t.opportunityId === opp.id)
        const tileClass = CATEGORY_ACCENTS[opp.category].calendarTile
        const existing = deadlineByDay.get(dayNum) ?? []
        existing.push({ opp, isTracked, tileClass })
        deadlineByDay.set(dayNum, existing)
      }
    })

    const cells: Array<{
      day: number | null
      deadlines: NonNullable<ReturnType<typeof deadlineByDay.get>>
    }> = []

    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ day: null, deadlines: [] })
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, deadlines: deadlineByDay.get(day) ?? [] })
    }

    const monthEvents = Array.from(deadlineByDay.entries())
      .flatMap(([day, items]) => items.map((item) => ({ day, ...item })))
      .sort((a, b) => a.day - b.day)

    return { cells, monthEvents }
  }, [calendarMonth, opportunities, trackedApplications])

  const aiRecommendations = useMemo(() => {
    const topIntern = opportunities
      .filter((o) => o.category === 'internship')
      .sort((a, b) => b.match.score - a.match.score)[0]

    const secondIntern = opportunities
      .filter((o) => o.category === 'internship' && o.id !== topIntern?.id)
      .sort((a, b) => b.match.score - a.match.score)[0]

    const topScholarship = opportunities
      .filter((o) => o.category === 'scholarship')
      .sort((a, b) => b.match.score - a.match.score)[0]

    return [
      {
        id: 'ai-gap-primary',
        badge: 'AI Skill Gap',
        badgeClass: 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]',
        iconBgClass:
          'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--accent-indigo)]',
        title: topIntern
          ? `${topIntern.title} • ${topIntern.organization}`
          : 'AI Internship Match',
        message:
          topIntern && topIntern.match.missingSkills.length > 0
            ? `Priority gap detected: add ${topIntern.match.missingSkills.slice(0, 2).join(' & ')} to boost your ${topIntern.match.score}% match score.`
            : 'All core technical skills matched! Review recommended portfolio project ideas.',
        onClick: () => navigate('/analyze'),
      },
      {
        id: 'ai-sprint-featured',
        badge: 'Portfolio Sprint',
        badgeClass:
          'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]',
        iconBgClass:
          'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]',
        title: secondIntern
          ? `${secondIntern.organization} — Portfolio Sprint`
          : 'AI Portfolio Project Idea',
        message:
          secondIntern?.aiImprovementMeta?.portfolioIdeas[0]?.title ??
          'Build a verifiable case-study repository before submitting your next internship CV.',
        onClick: () => navigate('/analyze'),
      },
      {
        id: 'scholarship-alert',
        badge: 'Document Prep',
        badgeClass:
          'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)]',
        iconBgClass:
          'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]',
        title: topScholarship
          ? `${topScholarship.title} (${topScholarship.match.score}% Match)`
          : 'Upcoming Deadline Check',
        message: topScholarship
          ? `Due ${formatDateID(topScholarship.deadline)} — verify your transcript and motivation letter checklist.`
          : 'Keep your CV and academic transcript ready in Tracker.',
        onClick: () =>
          topScholarship ? openOpportunityDetail(topScholarship.id) : navigate('/tracker'),
      },
    ]
  }, [opportunities, navigate, openOpportunityDetail])

  const stepCalendarMonth = (delta: number) => {
    setCalendarMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const visibleSkills = profile.skills.slice(0, 8)
  const extraSkillCount = Math.max(0, profile.skills.length - visibleSkills.length)
  const latestExperience = profile.experiences[0]

  return (
    <section className="space-y-6 pb-6 pt-2">
      {/* =================================================================== */}
      {/* 1. CLEAN GREETING HEADER + PRIMARY ACTIONS                          */}
      {/* =================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-secondary)]">
            <GraduationCap className="h-4 w-4 shrink-0 text-[var(--accent-indigo)]" />
            <span>
              {profile.university} • {profile.major} • Semester {profile.semester} • GPA{' '}
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {profile.gpa.toFixed(2)}
              </span>
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
          >
            <span>Explore Opportunities</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. 4 SCANNABLE KPI SUMMARY CARDS                                    */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => navigate('/discover')}
          className="careerku-card group flex cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              High Matches
            </span>
            <HighMatchGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
              {highMatches.length}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {highMatchPct}% of {opportunities.length} verified listings
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/analyze')}
          className="careerku-card group flex cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Average Match
            </span>
            <MatchIndexGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
              {avgScore}%
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Across {profile.skills.length} skills & GPA {profile.gpa.toFixed(2)}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/tracker')}
          className="careerku-card group flex cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Documents Ready
            </span>
            <DocumentReadyGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {completedDocsCount}/{allTrackedDocs.length}
              </p>
              <span className="rounded-full bg-[var(--accent-indigo-soft)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent-indigo)]">
                {docReadyPct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div
                className="h-full rounded-full bg-[var(--accent-indigo)] transition-all duration-500"
                style={{ width: `${docReadyPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              {appliedCount} application(s) submitted
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/discover')}
          className="careerku-card group flex cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Upcoming Deadlines
            </span>
            <DeadlinePulseGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
              {urgentDeadlines.length}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Due within 14 days • {trackedApplications.length} tracked
            </p>
          </div>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 3. PRIMARY WORKSPACE ROW: ONGOING APPLICATIONS + DOCUMENT CHECKLIST */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left: Ongoing Applications (8 cols) */}
        <div className="careerku-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 xl:col-span-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Ongoing Applications
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Click any card to inspect requirements and match details
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="careerku-btn-secondary inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Browse</span>
              </button>
            </div>

            {/* Clean Category Filter Tabs */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(['all', 'internship', 'scholarship', 'competition'] as const).map((cat) => {
                const label = cat === 'all' ? 'All' : getCategoryLabel(cat)
                const active = categoryFilter === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#191b1e] text-white dark:bg-[#f1f2ea] dark:text-[#181a18]'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {trackedCards.length === 0 ? (
              <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-sheet)] p-8 text-center">
                <Layers className="mb-2 h-6 w-6 text-[var(--text-muted)]" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No applications tracked in this category yet
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Explore verified opportunities and save them to start tracking deadlines.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="careerku-btn-primary mt-4 cursor-pointer rounded-full px-4 py-2 text-xs font-semibold"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                {trackedCards.map((item) => {
                  const accent = CATEGORY_ACCENTS[item.opp.category]
                  const isUrgent = item.daysLeft <= 14

                  return (
                    <div
                      key={item.opp.id}
                      onClick={() => openOpportunityDetail(item.opp.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openOpportunityDetail(item.opp.id)
                        }
                      }}
                      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-sm"
                    >
                      {/* Subtle Top Category Accent Bar */}
                      <div className={`h-[3px] w-full ${accent.topBar}`} />

                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          {/* Top Row: Org Initials + Careerku C-Logo Match Gauge */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                                style={{ backgroundColor: item.opp.orgAccent }}
                              >
                                {item.opp.orgInitials}
                              </span>
                              <span className="truncate text-xs font-semibold text-[var(--text-secondary)]">
                                {item.opp.organization}
                              </span>
                            </div>
                            <CareerkuMatchGauge score={item.opp.match.score} size="md" className="shrink-0" />
                          </div>

                          {/* Title (2 lines) & Category */}
                          <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-[var(--text-primary)] group-hover:underline">
                            {item.opp.title}
                          </h3>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">
                            {getCategoryLabel(item.opp.category)} • {item.opp.workMode}
                          </p>
                        </div>

                        {/* Document Progress + Footer */}
                        <div className="mt-4 pt-2">
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span className="font-medium text-[var(--text-secondary)]">
                              Documents
                            </span>
                            <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                              {item.doneCount}/{item.totalCount} ({item.progressPct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${accent.topBar}`}
                              style={{ width: `${Math.max(8, item.progressPct)}%` }}
                            />
                          </div>

                          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3">
                            <span className="rounded-full bg-[var(--bg-card)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-primary)] shadow-2xs">
                              {getStatusLabel(item.app.status)}
                            </span>
                            <span
                              className={`text-xs font-semibold tabular-nums ${
                                isUrgent
                                  ? 'text-rose-600 dark:text-rose-300'
                                  : 'text-[var(--text-secondary)]'
                              }`}
                            >
                              Due {formatDateID(item.opp.deadline)} ({item.daysLeft}d)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Document Checklist (4 cols) */}
        <div className="careerku-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 xl:col-span-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  Document Checklist
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Click an item to mark it complete
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--bg-sheet)] px-3 py-1 text-sm font-bold tabular-nums text-[var(--text-primary)]">
                {completedDocsCount}/{allTrackedDocs.length} done
              </span>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Overall completion</span>
                <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                  {docReadyPct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 dark:bg-emerald-400"
                  style={{ width: `${docReadyPct}%` }}
                />
              </div>
            </div>

            {prioritizedChecklistDocs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-sheet)] p-6 text-center">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  No document tasks yet
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Save an opportunity to generate its required application checklist.
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {prioritizedChecklistDocs.map((doc) => (
                  <li key={`${doc.opportunityId}-${doc.docId}`}>
                    <button
                      type="button"
                      onClick={() => toggleDocumentItem(doc.opportunityId, doc.docId)}
                      className="group flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-3 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                          doc.completed
                            ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-[#111311]'
                            : 'border-2 border-[var(--border-strong)] bg-[var(--bg-card)] text-transparent group-hover:border-[var(--accent-indigo)]'
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`line-clamp-2 text-sm font-medium leading-snug ${
                            doc.completed
                              ? 'text-[var(--text-muted)] line-through'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {doc.docLabel}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                          {doc.organization} • Due {formatDateID(doc.deadline)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/tracker')}
            className="careerku-btn-secondary mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold sm:text-sm"
          >
            <span>Open Full Document Tracker</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. ANALYTICS & AI GUIDANCE ROW                                      */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left: Match & Readiness Breakdown (7 cols) */}
        <div className="careerku-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 xl:col-span-7">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                  Match & Readiness Breakdown
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  How your current profile scores across opportunity types and criteria
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/analyze')}
                className="careerku-btn-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
                <span>AI Analysis</span>
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {breakdownRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {row.label}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">{row.helper}</span>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--text-primary)]">
                      {row.value}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarToneClass(row.value)}`}
                      style={{ width: `${Math.max(4, row.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Recommendations (5 cols) */}
        <div className="careerku-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 xl:col-span-5">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                  AI Recommendations
                </h2>
              </div>

              <button
                type="button"
                onClick={() => navigate('/analyze')}
                className="cursor-pointer text-xs font-semibold text-[var(--accent-indigo)] hover:underline"
              >
                Open AI Lab
              </button>
            </div>

            <div className="space-y-3">
              {aiRecommendations.map((item, idx) => {
                const Icon = idx === 0 ? Sparkles : idx === 1 ? Trophy : Award
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className="group flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBgClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]" />
                      </div>
                      <p className="mt-2 text-sm font-bold leading-snug text-[var(--text-primary)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {item.message}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. DEADLINES & PROFILE SNAPSHOT ROW                                 */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left: Deadline Calendar (8 cols) */}
        <div className="careerku-card rounded-3xl p-5 sm:p-6 xl:col-span-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                Deadline Calendar
              </h2>
              <span className="rounded-full bg-[var(--bg-sheet)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                {calendarData.monthEvents.length} deadlines
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepCalendarMonth(-1)}
                aria-label="Previous month"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[130px] text-center text-sm font-bold text-[var(--text-primary)]">
                {MONTH_NAMES[calendarMonth.month]} {calendarMonth.year}
              </span>
              <button
                type="button"
                onClick={() => stepCalendarMonth(1)}
                aria-label="Next month"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Calendar Tile Grid */}
            <div className="md:col-span-7">
              <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-[var(--text-secondary)]">
                {WEEKDAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {calendarData.cells.map((cell, index) => {
                  if (cell.day === null) {
                    return <div key={`empty-${index}`} className="h-10 rounded-xl opacity-0" />
                  }
                  const primaryDeadline = cell.deadlines[0]
                  return (
                    <button
                      key={cell.day}
                      type="button"
                      onClick={() =>
                        primaryDeadline ? openOpportunityDetail(primaryDeadline.opp.id) : undefined
                      }
                      title={
                        primaryDeadline
                          ? `${primaryDeadline.opp.title} (${primaryDeadline.opp.organization})`
                          : undefined
                      }
                      className={`relative flex h-10 items-center justify-center rounded-xl text-xs font-semibold tabular-nums transition-transform ${
                        primaryDeadline
                          ? `cursor-pointer hover:scale-105 ${primaryDeadline.tileClass}`
                          : 'bg-[var(--bg-sheet)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{cell.day}</span>
                      {cell.deadlines.length > 1 && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Internship
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Scholarship
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Competition
                </span>
              </div>
            </div>

            {/* Month Schedule List */}
            <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4 md:col-span-5">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                  Month Schedule
                </p>
                {calendarData.monthEvents.length === 0 ? (
                  <p className="py-8 text-center text-xs leading-relaxed text-[var(--text-secondary)]">
                    No deadlines in {MONTH_NAMES[calendarMonth.month]}. Use the arrows to check
                    adjacent months.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {calendarData.monthEvents.slice(0, 4).map((ev) => {
                      const accent = CATEGORY_ACCENTS[ev.opp.category]
                      return (
                        <button
                          key={`${ev.opp.id}-${ev.day}`}
                          type="button"
                          onClick={() => openOpportunityDetail(ev.opp.id)}
                          className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 text-left transition-colors hover:border-[var(--border-strong)]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 shrink-0 rounded-full ${accent.dot}`} />
                              <span className="text-xs font-bold tabular-nums text-[var(--text-secondary)]">
                                {MONTH_NAMES[calendarMonth.month].slice(0, 3)} {ev.day}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[var(--text-primary)]">
                              {ev.opp.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                              {ev.opp.organization}
                            </p>
                          </div>

                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: ev.opp.orgAccent }}
                          >
                            {ev.opp.orgInitials}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <span>View All Deadlines</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Profile Snapshot (4 cols) */}
        <div className="careerku-card flex flex-col justify-between rounded-3xl p-5 sm:p-6 xl:col-span-4">
          <div className="space-y-4">
            {/* Compact Identity Block */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3.5">
                <img
                  src="/images/hero-campus.jpg"
                  alt={profile.name}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover object-[center_20%] ring-1 ring-[var(--border-subtle)]"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[var(--text-primary)]">
                    {profile.name}
                  </h2>
                  <p className="truncate text-xs text-[var(--text-secondary)]">
                    {profile.university}
                  </p>
                  <p className="truncate text-xs font-medium text-[var(--text-secondary)]">
                    {profile.major}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="careerku-btn-secondary inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
              >
                <UserRound className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* 2-Column Academic Summary Pills */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3">
                <p className="text-xs font-medium text-[var(--text-secondary)]">Semester</p>
                <p className="mt-1 text-base font-bold tabular-nums text-[var(--text-primary)]">
                  Semester {profile.semester}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3">
                <p className="text-xs font-medium text-[var(--text-secondary)]">Current GPA</p>
                <p className="mt-1 text-base font-bold tabular-nums text-[var(--text-primary)]">
                  {profile.gpa.toFixed(2)} / 4.00
                </p>
              </div>
            </div>

            {/* Verified Skills */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Verified Skills ({profile.skills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {visibleSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-2.5 py-1 text-xs font-medium text-[var(--text-primary)]"
                  >
                    {skill}
                  </span>
                ))}
                {extraSkillCount > 0 && (
                  <span className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                    +{extraSkillCount} more
                  </span>
                )}
              </div>
            </div>

            {/* Latest Experience */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Latest Experience
              </p>
              {latestExperience ? (
                <div className="mt-1.5">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {latestExperience.role}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    {latestExperience.organization} • {latestExperience.period}
                  </p>
                </div>
              ) : (
                <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                  Add campus or project experience to strengthen your profile.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="careerku-btn-secondary mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold sm:text-sm"
          >
            <span>Manage Profile & Skills</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
