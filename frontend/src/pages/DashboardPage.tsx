import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Award,
  Briefcase,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react'
import type { OpportunityCategory } from '@/types'
import { useCareerku } from '@/hooks'
import { formatDateID, getDaysUntilDeadline } from '@/utils'

const PASTEL_CARD_THEMES = [
  {
    cardBg: 'bg-[#f8eac4] text-[#1c1e21] dark:bg-amber-400/15 dark:text-[#f3f4ee]',
    pillBg: 'border-[#1c1e21]/15 bg-white/60 text-[#1c1e21] dark:border-white/15 dark:bg-white/10 dark:text-white',
    barTrack: 'bg-[#1c1e21]/12 dark:bg-white/15',
    barFill: 'bg-[#e5a91a] dark:bg-amber-400',
    badgeBg: 'bg-white/75 text-[#1c1e21] dark:bg-white/10 dark:text-amber-200',
  },
  {
    cardBg: 'bg-[#dceeff] text-[#1c1e21] dark:bg-sky-400/15 dark:text-[#f3f4ee]',
    pillBg: 'border-[#1c1e21]/15 bg-white/60 text-[#1c1e21] dark:border-white/15 dark:bg-white/10 dark:text-white',
    barTrack: 'bg-[#1c1e21]/12 dark:bg-white/15',
    barFill: 'bg-[#2b7de9] dark:bg-sky-400',
    badgeBg: 'bg-white/75 text-[#1c1e21] dark:bg-white/10 dark:text-sky-200',
  },
  {
    cardBg: 'bg-[#fbdde0] text-[#1c1e21] dark:bg-rose-400/15 dark:text-[#f3f4ee]',
    pillBg: 'border-[#1c1e21]/15 bg-white/60 text-[#1c1e21] dark:border-white/15 dark:bg-white/10 dark:text-white',
    barTrack: 'bg-[#1c1e21]/12 dark:bg-white/15',
    barFill: 'bg-[#e05368] dark:bg-rose-400',
    badgeBg: 'bg-white/75 text-[#1c1e21] dark:bg-white/10 dark:text-rose-200',
  },
] as const

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
  const [expandedDetail, setExpandedDetail] = useState<'skills' | 'academic' | 'experience'>(
    'skills',
  )

  // Determine initial calendar month from the nearest upcoming deadline
  const initialCalendarDate = useMemo(() => {
    const firstDeadline = opportunities
      .map((o) => new Date(o.deadline))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())[0]
    return firstDeadline ?? new Date(2026, 4, 1)
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
        .filter((o) => getDaysUntilDeadline(o.deadline) <= 14)
        .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline)),
    [opportunities],
  )

  // All tracked document checklist items (both completed & pending) for the Dark Checklist Card
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

  const completedDocsCount = allTrackedDocs.filter((d) => d.completed).length
  const totalDocsCount = Math.max(1, allTrackedDocs.length)
  const docReadyPct = Math.round((completedDocsCount / totalDocsCount) * 100)
  const highMatchPct = Math.round(
    (highMatches.length / Math.max(1, opportunities.length)) * 100,
  )
  const appliedCount = trackedApplications.filter(
    (app) => app.status === 'applied' || app.status === 'interview',
  ).length
  const appliedPct = Math.round(
    (appliedCount / Math.max(1, trackedApplications.length)) * 100,
  )

  // Enriched tracked opportunities for the Ref 2 Pastel Ongoing Cards
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

    if (categoryFilter === 'all') return list.slice(0, 3)
    return list.filter((item) => item.opp.category === categoryFilter).slice(0, 3)
  }, [trackedApplications, opportunities, categoryFilter])

  // Category & Readiness vertical bars for Ref 1 "Progress" card
  const matchBars = useMemo(() => {
    const calcCatAvg = (cat: OpportunityCategory) => {
      const items = opportunities.filter((o) => o.category === cat)
      if (items.length === 0) return 0
      return Math.round(items.reduce((acc, i) => acc + i.match.score, 0) / items.length)
    }
    const internAvg = calcCatAvg('internship')
    const compAvg = calcCatAvg('competition')
    const scholarAvg = calcCatAvg('scholarship')
    const gpaScore = Math.min(100, Math.round((profile.gpa / 4) * 100))
    const skillScore = Math.min(100, profile.skills.length * 14)

    return [
      { label: 'Intern', value: internAvg, highlight: false },
      { label: 'Comp', value: compAvg, highlight: false },
      { label: 'Scholar', value: scholarAvg, highlight: false },
      { label: 'GPA', value: gpaScore, highlight: true },
      { label: 'Skills', value: skillScore, highlight: false },
      { label: 'Docs', value: docReadyPct, highlight: false },
    ]
  }, [opportunities, profile.gpa, profile.skills.length, docReadyPct])

  // Monthly calendar days & deadline map (Ref 2 Calendar + Ref 1 Schedule pills)
  const calendarData = useMemo(() => {
    const { year, month } = calendarMonth
    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // Monday-based index (0 = Mon ... 6 = Sun)
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7

    const deadlineByDay = new Map<
      number,
      {
        opp: (typeof opportunities)[number]
        isTracked: boolean
        colorClass: string
      }[]
    >()

    opportunities.forEach((opp) => {
      const d = new Date(opp.deadline)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate()
        const isTracked = trackedApplications.some((t) => t.opportunityId === opp.id)
        const colorClass =
          opp.category === 'internship'
            ? 'bg-[#7ab8ff] text-[#142238] dark:bg-sky-400 dark:text-[#111315]'
            : opp.category === 'scholarship'
              ? 'bg-[#f6d365] text-[#1c1e21] dark:bg-amber-400 dark:text-[#111315]'
              : 'bg-[#f48b94] text-white dark:bg-rose-400 dark:text-[#111315]'

        const existing = deadlineByDay.get(dayNum) ?? []
        existing.push({ opp, isTracked, colorClass })
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

  // AI Skill Gap & Alerts items for Ref 2 "Inbox" card
  const aiInboxItems = useMemo(() => {
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
        title: topIntern ? `${topIntern.title} • ${topIntern.organization}` : 'AI Internship Match',
        message:
          topIntern && topIntern.match.missingSkills.length > 0
            ? `Priority gap detected: add ${topIntern.match.missingSkills.slice(0, 2).join(' & ')} to boost your ${topIntern.match.score}% match score.`
            : 'All core technical skills matched! Review recommended portfolio project ideas.',
        featuredDark: false,
        onClick: () => navigate('/analyze'),
      },
      {
        id: 'ai-sprint-featured',
        badge: 'Recommended Sprint',
        title: secondIntern
          ? `${secondIntern.organization} — Portfolio Sprint`
          : 'AI Portfolio Project Idea',
        message:
          secondIntern?.aiImprovementMeta?.portfolioIdeas[0]?.title ??
          'Build a verifiable case-study repository before submitting your next internship CV.',
        featuredDark: true,
        onClick: () => navigate('/analyze'),
      },
      {
        id: 'scholarship-alert',
        badge: 'Document Prep',
        title: topScholarship
          ? `${topScholarship.title} (${topScholarship.match.score}% Match)`
          : 'Upcoming Deadline Check',
        message: topScholarship
          ? `Due ${formatDateID(topScholarship.deadline)} — verify your transcript and motivation letter checklist.`
          : 'Keep your CV and academic transcript ready in Tracker.',
        featuredDark: false,
        onClick: () =>
          topScholarship ? openOpportunityDetail(topScholarship.id) : navigate('/tracker'),
      },
    ]
  }, [opportunities, navigate, openOpportunityDetail])

  // SVG Ring calculation for Ref 1 Radial Gauge
  const ringRadius = 54
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference - (avgScore / 100) * ringCircumference

  const stepCalendarMonth = (delta: number) => {
    setCalendarMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  return (
    <section className="space-y-5 pb-4">
      {/* =================================================================== */}
      {/* TOP HEADER: Welcome + Segmented Readiness Bar + 3 Large KPIs (Ref 1) */}
      {/* =================================================================== */}
      <div className="px-1 pb-2 pt-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold text-[var(--text-secondary)] shadow-2xs">
            <GraduationCap className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
            <span>
              {profile.university} • {profile.major} (Sem {profile.semester})
            </span>
          </span>
          <h2 className="mt-2.5 text-3xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
            Welcome in, {firstName}
          </h2>
        </div>

        {/* Segmented Progress Pill Bar (Left) + Big Unboxed KPI Numbers (Right) */}
        <div className="mt-6 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          {/* Segmented Bar (Cols 1-7) */}
          <div className="lg:col-span-7">
            <div className="mb-2 grid grid-cols-4 text-[11px] font-medium text-[var(--text-secondary)]">
              <span>High Match</span>
              <span>Docs Ready</span>
              <span>Profile Fit</span>
              <span className="text-right sm:text-left">Submitted</span>
            </div>

            <div className="flex h-11 w-full items-center gap-1.5">
              {/* Segment 1: Solid Dark Pill */}
              <button
                type="button"
                onClick={() => navigate('/discover')}
                title="High-match opportunities"
                className="flex h-full w-[22%] min-w-[64px] cursor-pointer items-center justify-center rounded-full bg-[#191b1e] px-3 text-xs font-semibold text-white transition-transform hover:scale-[1.02] dark:bg-[#f1f2ea] dark:text-[#181a18]"
              >
                {highMatchPct}%
              </button>

              {/* Segment 2: Warm Gold/Amber Pill */}
              <button
                type="button"
                onClick={() => navigate('/tracker')}
                title="Completed checklist documents"
                className="flex h-full w-[22%] min-w-[64px] cursor-pointer items-center justify-center rounded-full bg-[#f5d061] px-3 text-xs font-semibold text-[#191b1e] transition-transform hover:scale-[1.02]"
              >
                {docReadyPct}%
              </button>

              {/* Segment 3: Diagonal Hatch Striped Pill (Crextio Signature) */}
              <button
                type="button"
                onClick={() => navigate('/analyze')}
                title="Average rule-based match score"
                className="relative flex h-full flex-1 cursor-pointer items-center overflow-hidden rounded-full border border-[var(--border-strong)]/80 bg-[var(--bg-card)]/75 px-4 text-xs font-semibold text-[var(--text-primary)]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(130, 136, 128, 0.16) 6px, rgba(130, 136, 128, 0.16) 12px)',
                }}
              >
                <span className="rounded-full bg-[var(--bg-card)]/90 px-2.5 py-0.5 text-[11px] font-semibold shadow-2xs">
                  {avgScore}% Fit
                </span>
              </button>

              {/* Segment 4: Outlined Output Pill */}
              <button
                type="button"
                onClick={() => navigate('/tracker')}
                title="Applications marked Applied or Interview"
                className="flex h-full w-[18%] min-w-[58px] cursor-pointer items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)]/60 px-3 text-xs font-semibold text-[var(--text-primary)]"
              >
                {appliedPct}%
              </button>
            </div>
          </div>

          {/* 3 Big Clean KPI Counters (Cols 8-12) */}
          <div className="grid grid-cols-3 gap-3 lg:col-span-5 lg:justify-items-end">
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="cursor-pointer text-left transition-opacity hover:opacity-80"
            >
              <div className="flex items-baseline gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span className="text-3xl font-light tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
                  {highMatches.length}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                High Matches
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tracker')}
              className="cursor-pointer text-left transition-opacity hover:opacity-80"
            >
              <div className="flex items-baseline gap-1.5">
                <ClipboardCheck className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span className="text-3xl font-light tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
                  {trackedApplications.length}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                Tracked Apps
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="cursor-pointer text-left transition-opacity hover:opacity-80"
            >
              <div className="flex items-baseline gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-rose-500" />
                <span className="text-3xl font-light tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
                  {urgentDeadlines.length}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                Due &le; 14 Days
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MAIN HYBRID BENTO GRID (12 Columns)                                 */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* ----------------------------------------------------------------- */}
        {/* LEFT COLUMN (Cols 1-3): Portrait Card (Ref 1) + Details (Ref 2)   */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Student Visual Snapshot Card (Ref 1 "Lora Piterson" Portrait Card) */}
          <div className="group relative min-h-[255px] overflow-hidden rounded-[26px] bg-[#1c1e21] shadow-sm">
            <img
              src="/images/hero-campus.jpg"
              alt={profile.name}
              className="absolute inset-0 h-full w-full -scale-x-100 object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Top-Right Edit Profile Pill */}
            <div className="relative z-10 flex justify-end p-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-[#181a1d] shadow-xs backdrop-blur-md transition-transform hover:scale-105"
              >
                <UserRound className="h-3 w-3" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Bottom Overlay: Name, Major & Glass GPA Pill */}
            <div className=" absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-5">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold tracking-tight text-white">
                  {profile.name}
                </h3>
                <p className="truncate text-xs text-white/80">
                  {profile.major} • Sem {profile.semester}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                GPA {profile.gpa.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Academic & Skills Accordion Card (Ref 1 Bottom-Left + Ref 2 Detailed Info) */}
          <div className="careerku-card flex flex-1 flex-col justify-between rounded-[26px] p-5">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Detailed Information
                </h3>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Active
                </span>
              </div>

              <div className="space-y-2">
                {/* Accordion Item 1: Verified Skills */}
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDetail(expandedDetail === 'skills' ? 'academic' : 'skills')
                    }
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                  >
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Verified Skills ({profile.skills.length})
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--accent-indigo)]">
                      {expandedDetail === 'skills' ? 'Hide' : 'Show'}
                    </span>
                  </button>
                  {expandedDetail === 'skills' && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {profile.skills.slice(0, 7).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-primary)] shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion Item 2: Academic Standing */}
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDetail(expandedDetail === 'academic' ? 'experience' : 'academic')
                    }
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                  >
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Academic & University
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Sem {profile.semester}
                    </span>
                  </button>
                  {expandedDetail === 'academic' && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      {profile.university} • {profile.major} • GPA {profile.gpa.toFixed(2)} / 4.00
                    </p>
                  )}
                </div>

                {/* Accordion Item 3: Experience */}
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDetail(expandedDetail === 'experience' ? 'skills' : 'experience')
                    }
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                  >
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Portfolio & Experience
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {profile.experiences.length} listed
                    </span>
                  </button>
                  {expandedDetail === 'experience' && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      {profile.experiences[0]
                        ? `${profile.experiences[0].role} at ${profile.experiences[0].organization}`
                        : 'Add campus or project experience to improve match scores.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              <span>Update Skills & GPA</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* CENTER COLUMN (Cols 4-9): 2 Ref-1 Metric Cards + Ref-2 Pastel Row */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          {/* Top Sub-Row: Category Progress Stems (Ref 1) + Radial Readiness Ring (Ref 1) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Card 1: Match Breakdown Vertical Stems (Crextio "Progress" Card) */}
            <div className="careerku-card flex flex-col justify-between rounded-[26px] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-[var(--text-primary)]">
                    Match Breakdown
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-light tracking-tight text-[var(--text-primary)]">
                      {avgScore}%
                    </span>
                    <span className="text-[11px] leading-tight text-[var(--text-secondary)]">
                      Average fit
                      <br />
                      across listings
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  aria-label="Explore opportunities"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)] hover:scale-105"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              {/* Vertical Pill Stems with Floating Highlight Pill */}
              <div className="mt-6 grid grid-cols-6 items-end gap-2 pt-4">
                {matchBars.map((bar) => (
                  <div key={bar.label} className="flex flex-col items-center gap-2">
                    <div className="relative flex h-24 w-full items-end justify-center">
                      {bar.highlight && (
                        <span className="absolute -top-5 rounded-full bg-[#f5d061] px-2 py-0.5 text-[10px] font-bold text-[#191b1e] shadow-2xs">
                          {bar.value}%
                        </span>
                      )}
                      <div
                        className={`w-2 rounded-full transition-all duration-500 ${
                          bar.highlight
                            ? 'bg-[#f5d061]'
                            : 'bg-[#191b1e] dark:bg-[#f1f2ea]'
                        }`}
                        style={{ height: `${Math.max(20, Math.round(bar.value * 0.78))}px` }}
                      />
                    </div>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        bar.highlight ? 'bg-[#f5d061]' : 'bg-[var(--text-muted)]'
                      }`}
                    />
                    <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: AI & Document Readiness Ring (Crextio "Time tracker" Card) */}
            <div className="careerku-card flex flex-col justify-between rounded-[26px] p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-medium text-[var(--text-primary)]">
                  Readiness Score
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/analyze')}
                  aria-label="Open AI Skill Gap Analysis"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)] hover:scale-105"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              {/* Center Radial Ring */}
              <div className="my-2 flex items-center justify-center">
                <div className="relative flex h-34 w-34 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
                    <circle
                      cx="64"
                      cy="64"
                      r={ringRadius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray="2 5"
                      className="text-[var(--border-strong)]"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r={ringRadius}
                      fill="none"
                      stroke="#f5d061"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                      {avgScore}%
                    </span>
                    <span className="text-[10px] font-medium text-[var(--text-muted)]">
                      Match Index
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigate('/analyze')}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[var(--bg-sheet)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                  >
                    <Sparkles className="h-3 w-3 text-[var(--accent-indigo)]" />
                    <span>Analyze AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/tracker')}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[var(--bg-sheet)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <span>Docs</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/tracker')}
                  aria-label="Open Document Tracker"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#191b1e] text-white dark:bg-[#f1f2ea] dark:text-[#181a18]"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Sub-Row: Ongoing Applications with 3 Pastel Cards (Ref 2 Signature!) */}
          <div className="careerku-card flex flex-1 flex-col justify-between rounded-[26px] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-[#191b1e] px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-[#f1f2ea] dark:text-[#181a18]">
                  Ongoing Applications
                </span>
                {(['all', 'internship', 'scholarship', 'competition'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate('/discover')}
                title="Add more opportunities to Tracker"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {trackedCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-sheet)] p-8 text-center">
                <Layers className="mb-2 h-6 w-6 text-[var(--text-muted)]" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  No applications tracked in this category yet
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="mt-3 cursor-pointer rounded-full bg-[#191b1e] px-4 py-1.5 text-xs font-semibold text-white dark:bg-[#f1f2ea] dark:text-[#181a18]"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {trackedCards.map((item, idx) => {
                  const theme = PASTEL_CARD_THEMES[idx % PASTEL_CARD_THEMES.length]
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
                      className={`group flex cursor-pointer flex-col justify-between rounded-[22px] p-4 transition-transform duration-200 hover:-translate-y-1 ${theme.cardBg}`}
                    >
                      <div>
                        {/* Top Date Pill + Org Initials */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${theme.pillBg}`}
                          >
                            {formatDateID(item.opp.deadline)}
                          </span>
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: item.opp.orgAccent }}
                          >
                            {item.opp.orgInitials}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <h4 className="mt-3 line-clamp-1 text-sm font-bold">
                          {item.opp.title}
                        </h4>
                        <p className="mt-0.5 truncate text-[11px] opacity-75">
                          {item.opp.organization}
                        </p>
                      </div>

                      {/* Progress Bar & Bottom Meta */}
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold">
                          <span className="capitalize">{item.app.status}</span>
                          <span>{item.progressPct}% Docs</span>
                        </div>
                        <div className={`h-1.5 w-full overflow-hidden rounded-full ${theme.barTrack}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${theme.barFill}`}
                            style={{ width: `${Math.max(12, item.progressPct)}%` }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${theme.badgeBg}`}>
                            {item.opp.match.score}% Match
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${theme.badgeBg}`}>
                            {item.daysLeft}d left
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* RIGHT COLUMN (Cols 10-12): Prep Summary + Dark Checklist (Ref 1!) */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col justify-between rounded-[26px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 lg:col-span-3">
          {/* Top Onboarding / Prep Header */}
          <div className="px-1 pb-4 pt-1">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-medium text-[var(--text-primary)]">
                Checklist Prep
              </h3>
              <span className="text-2xl font-light tracking-tight text-[var(--text-primary)]">
                {docReadyPct}%
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 text-[10px] font-medium text-[var(--text-secondary)]">
              <span>Docs</span>
              <span>AI Gaps</span>
              <span>Submitted</span>
            </div>
            <div className="mt-1 flex h-6 w-full gap-1">
              <div className="flex flex-1 items-center justify-center rounded-lg bg-[#f5d061] text-[10px] font-bold text-[#191b1e]">
                Task
              </div>
              <div className="w-[28%] rounded-lg bg-[#191b1e] dark:bg-[#f1f2ea]" />
              <div className="w-[18%] rounded-lg bg-[var(--border-strong)]" />
            </div>
          </div>

          {/* Stacked Dark Charcoal Checklist Card (Crextio "Onboarding Task 2/8" Card) */}
          <div className="flex flex-1 flex-col justify-between rounded-[24px] bg-[#191b1e] p-5 text-white shadow-lg dark:bg-[#141614] dark:ring-1 dark:ring-white/10">
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Document Tasks</h4>
                  <p className="text-[11px] text-white/55">Click any item to toggle done</p>
                </div>
                <span className="text-2xl font-light tracking-tight text-white">
                  {completedDocsCount}/{allTrackedDocs.length}
                </span>
              </div>

              <ul className="space-y-2.5">
                {allTrackedDocs.slice(0, 5).map((doc) => (
                  <li key={`${doc.opportunityId}-${doc.docId}`}>
                    <button
                      type="button"
                      onClick={() => toggleDocumentItem(doc.opportunityId, doc.docId)}
                      className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-white/[0.05] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.1]"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                            doc.completed
                              ? 'bg-white/12 text-white/70'
                              : 'bg-white text-[#191b1e]'
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`truncate text-xs font-medium ${
                              doc.completed ? 'text-white/45 line-through' : 'text-white'
                            }`}
                          >
                            {doc.docLabel}
                          </p>
                          <p className="truncate text-[10px] text-white/50">
                            {doc.organization} • {formatDateID(doc.deadline)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                          doc.completed
                            ? 'bg-[#f5d061] text-[#191b1e]'
                            : 'border border-white/25 bg-white/5 text-transparent group-hover:border-white/50'
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate('/tracker')}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white/10 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/18"
            >
              <span>Open Full Document Tracker</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BOTTOM BENTO ROW: Monthly Deadline Calendar + AI Alerts Inbox       */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left/Center (Cols 1-7): Monthly Deadline Calendar Grid (Ref 2) + Event Pills (Ref 1) */}
        <div className="careerku-card rounded-[26px] p-5 sm:p-6 lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Deadline Calendar
              </h3>
              <span className="rounded-full bg-[var(--bg-sheet)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                {calendarData.monthEvents.length} deadlines this month
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
              <span className="min-w-[125px] text-center text-xs font-bold text-[var(--text-primary)]">
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Calendar Tile Grid (Cols 1-7) */}
            <div className="md:col-span-7">
              <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-[var(--text-muted)]">
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
                        primaryDeadline
                          ? openOpportunityDetail(primaryDeadline.opp.id)
                          : undefined
                      }
                      title={
                        primaryDeadline
                          ? `${primaryDeadline.opp.title} (${primaryDeadline.opp.organization})`
                          : undefined
                      }
                      className={`relative flex h-10 items-center justify-center rounded-xl text-xs font-semibold transition-transform ${
                        primaryDeadline
                          ? `cursor-pointer shadow-xs hover:scale-105 ${primaryDeadline.colorClass}`
                          : 'bg-[var(--bg-sheet)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{cell.day}</span>
                      {cell.deadlines.length > 1 && (
                        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-medium text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#7ab8ff]" /> Internship
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#f6d365]" /> Scholarship
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#f48b94]" /> Competition
                </span>
              </div>
            </div>

            {/* Monthly Schedule Timeline Pills (Cols 8-12, Ref 1 Timeline Style) */}
            <div className="flex flex-col justify-between rounded-2xl bg-[var(--bg-sheet)] p-4 md:col-span-5">
              <div>
                <p className="mb-3 text-xs font-bold text-[var(--text-primary)]">
                  Month Schedule
                </p>
                {calendarData.monthEvents.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                    No deadlines in {MONTH_NAMES[calendarMonth.month]}. Use the arrows to check
                    adjacent months.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {calendarData.monthEvents.slice(0, 3).map((ev, idx) => (
                      <button
                        key={`${ev.opp.id}-${ev.day}`}
                        type="button"
                        onClick={() => openOpportunityDetail(ev.opp.id)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-2xl p-3 text-left transition-transform hover:scale-[1.01] ${
                          idx === 0
                            ? 'bg-[#191b1e] text-white shadow-sm dark:bg-[#f1f2ea] dark:text-[#181a18]'
                            : 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold">{ev.opp.title}</p>
                          <p
                            className={`truncate text-[10px] ${
                              idx === 0 ? 'opacity-75' : 'text-[var(--text-secondary)]'
                            }`}
                          >
                            {ev.opp.organization} • {MONTH_NAMES[calendarMonth.month].slice(0, 3)}{' '}
                            {ev.day}
                          </p>
                        </div>
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: ev.opp.orgAccent }}
                        >
                          {ev.opp.orgInitials}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="mt-3 inline-flex items-center justify-between rounded-xl bg-[var(--bg-card)] px-3 py-2 text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <span>View All Verified Deadlines</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right (Cols 8-12): AI Recommendations & Career Inbox (Ref 2 "Inbox" Style) */}
        <div className="careerku-card flex flex-col justify-between rounded-[26px] p-5 sm:p-6 lg:col-span-5">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  AI Career Inbox
                </h3>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-sheet)] text-[var(--accent-indigo)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/analyze')}
                className="cursor-pointer text-xs font-semibold text-[var(--accent-indigo)] hover:underline"
              >
                Open AI Lab
              </button>
            </div>

            <div className="space-y-2.5">
              {aiInboxItems.map((item, idx) => {
                const Icon = idx === 0 ? Sparkles : idx === 1 ? Trophy : Award
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className={`flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                      item.featuredDark
                        ? 'bg-[#191b1e] text-white shadow-md dark:bg-[#141614] dark:ring-1 dark:ring-white/10'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          item.featuredDark
                            ? 'bg-[#f5d061] text-[#191b1e]'
                            : 'bg-[var(--bg-card)] text-[var(--accent-indigo)] shadow-2xs'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-bold">{item.title}</p>
                        </div>
                        <p
                          className={`mt-1 line-clamp-2 text-[11px] leading-relaxed ${
                            item.featuredDark ? 'text-white/75' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        item.featuredDark
                          ? 'bg-white/15 text-white'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
