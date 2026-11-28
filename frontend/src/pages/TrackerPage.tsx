import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import {
  ArrowUpRight,
  Calendar,
  Check,
  ClipboardList,
  ExternalLink,
  FileText,
  Layers,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  CareerkuMatchGauge,
  DeadlinePulseGlyph,
  DocumentReadyGlyph,
  HighMatchGlyph,
  MatchIndexGlyph,
} from '@/components'
import { useCareerku } from '@/hooks'
import type { ApplicationStatus, OpportunityCategory } from '@/types'
import { formatDateID, getDaysUntilDeadline, getStatusLabel } from '@/utils'

type TrackerTab = 'all' | 'saved' | 'preparing' | 'applied'

const STATUS_OPTIONS: ApplicationStatus[] = ['saved', 'preparing', 'applied', 'interview']

const CATEGORY_TOP_BARS: Record<OpportunityCategory, string> = {
  internship: 'bg-[var(--cat-internship)]',
  scholarship: 'bg-[var(--cat-scholarship)]',
  competition: 'bg-[var(--cat-competition)]',
}

export function TrackerPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    opportunities,
    trackedApplications,
    updateApplicationStatus,
    toggleDocumentItem,
    updateApplicationDrafts,
    untrackOpportunity,
    openOpportunityDetail,
  } = useCareerku()

  const [activeTab, setActiveTab] = useState<TrackerTab>('all')
  const [prepView, setPrepView] = useState<'checklist' | 'documents'>('checklist')

  const enrichedTracked = useMemo(() => {
    return trackedApplications
      .map((app) => {
        const opp = opportunities.find((item) => item.id === app.opportunityId)
        if (!opp) return null
        const completedCount = app.documents.filter((d) => d.completed).length
        const totalDocs = app.documents.length
        const progressPercent = totalDocs > 0 ? Math.round((completedCount / totalDocs) * 100) : 0
        return {
          application: app,
          opportunity: opp,
          completedCount,
          totalDocs,
          progressPercent,
          daysLeft: getDaysUntilDeadline(opp.deadline),
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  }, [opportunities, trackedApplications])

  const counts = useMemo(() => {
    const saved = enrichedTracked.filter((e) => e.application.status === 'saved').length
    const preparing = enrichedTracked.filter((e) => e.application.status === 'preparing').length
    const applied = enrichedTracked.filter(
      (e) => e.application.status === 'applied' || e.application.status === 'interview',
    ).length
    const urgent = enrichedTracked.filter((e) => e.daysLeft >= 0 && e.daysLeft <= 14).length
    const totalDocs = enrichedTracked.reduce((sum, e) => sum + e.totalDocs, 0)
    const completedDocs = enrichedTracked.reduce((sum, e) => sum + e.completedCount, 0)
    const overallDocPct = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0
    const submittedPct =
      enrichedTracked.length > 0 ? Math.round((applied / enrichedTracked.length) * 100) : 0

    return {
      saved,
      preparing,
      applied,
      urgent,
      totalDocs,
      completedDocs,
      overallDocPct,
      submittedPct,
    }
  }, [enrichedTracked])

  const statusTabs = useMemo(
    () => [
      { id: 'all' as const, label: 'All', count: enrichedTracked.length },
      { id: 'saved' as const, label: 'Saved', count: counts.saved },
      { id: 'preparing' as const, label: 'Preparing Docs', count: counts.preparing },
      { id: 'applied' as const, label: 'Applied', count: counts.applied },
    ],
    [enrichedTracked.length, counts.saved, counts.preparing, counts.applied],
  )

  const filteredList = useMemo(() => {
    return enrichedTracked.filter((entry) => {
      if (activeTab === 'all') return true
      if (activeTab === 'applied') {
        return (
          entry.application.status === 'applied' || entry.application.status === 'interview'
        )
      }
      return entry.application.status === activeTab
    })
  }, [enrichedTracked, activeTab])

  const requestedId = searchParams.get('opportunity')
  const selectedEntry =
    filteredList.find((e) => e.opportunity.id === requestedId) ??
    filteredList[0] ??
    enrichedTracked[0] ??
    null
  const selectedId = selectedEntry?.opportunity.id ?? null

  const sectionRef = useRef<HTMLElement | null>(null)
  const prevTabRef = useRef(activeTab)
  const prevSelectedIdRef = useRef<string | null>(selectedId)
  const prevPrepViewRef = useRef(prepView)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-anim="header"]', {
          y: 16,
          opacity: 0,
          duration: 0.45,
          clearProps: 'transform',
        })
          .from(
            '[data-anim="kpi-card"]',
            {
              y: 20,
              opacity: 0,
              scale: 0.98,
              duration: 0.48,
              stagger: 0.06,
              clearProps: 'transform',
            },
            '-=0.28',
          )
          .from(
            '[data-anim="kpi-doc-bar"]',
            {
              scaleX: 0,
              duration: 0.65,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.25',
          )
          .from(
            '[data-anim="tracker-panel"]',
            {
              y: 22,
              opacity: 0,
              duration: 0.52,
              stagger: 0.09,
              clearProps: 'transform',
            },
            '-=0.3',
          )
          .from(
            '[data-anim="tracked-item"]',
            {
              y: 14,
              opacity: 0,
              duration: 0.4,
              stagger: 0.05,
              clearProps: 'transform',
            },
            '-=0.35',
          )
          .from(
            '[data-anim="checklist-bar"]',
            {
              scaleX: 0,
              duration: 0.65,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.25',
          )
      },
      sectionRef,
    )
    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    if (prevTabRef.current === activeTab) return
    prevTabRef.current = activeTab

    if (!sectionRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = sectionRef.current.querySelectorAll('[data-anim="tracked-item"]')
    if (items.length === 0) return

    gsap.fromTo(
      items,
      { y: 12, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.32,
        stagger: 0.045,
        ease: 'power2.out',
        clearProps: 'transform',
        overwrite: 'auto',
      },
    )
  }, [activeTab])

  useLayoutEffect(() => {
    if (prevSelectedIdRef.current === selectedId) return
    prevSelectedIdRef.current = selectedId

    if (!selectedId || !sectionRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const detail = sectionRef.current.querySelector('[data-anim="workspace-detail"]')
    if (detail) {
      gsap.fromTo(
        detail,
        { opacity: 0.45, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          clearProps: 'transform',
          overwrite: 'auto',
        },
      )
    }

    const bar = sectionRef.current.querySelector('[data-anim="checklist-bar"]')
    if (bar) {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.48,
          ease: 'power2.out',
          clearProps: 'transform',
          overwrite: 'auto',
        },
      )
    }
  }, [selectedId])

  useLayoutEffect(() => {
    if (prevPrepViewRef.current === prepView) return
    prevPrepViewRef.current = prepView

    if (!sectionRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const content = sectionRef.current.querySelector('[data-anim="prep-content"]')
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: 'power2.out',
          clearProps: 'transform',
          overwrite: 'auto',
        },
      )
    }

    const bar = sectionRef.current.querySelector('[data-anim="checklist-bar"]')
    if (bar) {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform',
          overwrite: 'auto',
        },
      )
    }
  }, [prepView])

  return (
    <section ref={sectionRef} className="space-y-6 pb-6 pt-2">
      {/* =================================================================== */}
      {/* 1. CLEAN PAGE HEADER + PRIMARY CTA                                  */}
      {/* =================================================================== */}
      <div
        data-anim="header"
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Application Tracker
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Organize statuses, complete document checklists, and prepare CV & motivation letter
            drafts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. 4 SCANNABLE KPI SUMMARY CARDS                                    */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Total Tracked
              </span>
              <HighMatchGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {enrichedTracked.length}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {counts.saved} saved • {counts.preparing} preparing
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => setPrepView('checklist')}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
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
                  {counts.completedDocs}/{counts.totalDocs}
                </p>
                <span className="rounded-full bg-[var(--accent-indigo-soft)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent-indigo)]">
                  {counts.overallDocPct}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                <div
                  data-anim="kpi-doc-bar"
                  className="h-full origin-left rounded-full bg-[var(--accent-indigo)] transition-all duration-500"
                  style={{ width: `${counts.overallDocPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Across all tracked applications
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => setActiveTab('applied')}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Applied / In Review
              </span>
              <MatchIndexGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {counts.applied}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {counts.submittedPct}% of tracked pipeline
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Due Within 14 Days
              </span>
              <DeadlinePulseGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {counts.urgent}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Upcoming tracked deadlines
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. TRACKED LIST + APPLICATION WORKSPACE                             */}
      {/* =================================================================== */}
      {enrichedTracked.length === 0 ? (
        <div
          data-anim="tracker-panel"
          className="careerku-card flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center"
        >
          <Layers className="mb-2.5 h-7 w-7 text-[var(--text-muted)]" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            No opportunities tracked yet
          </h2>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-[var(--text-secondary)]">
            Save internships, competitions, or scholarships from Discover to organize your document
            checklist and monitor upcoming deadlines.
          </p>
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="careerku-btn-primary mt-5 cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold"
          >
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* Left Column: Tracked List Card (5 cols) */}
          <div
            data-anim="tracker-panel"
            className="careerku-card h-fit rounded-3xl p-5 sm:p-6 xl:col-span-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  Tracked Applications
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Sorted by closest deadline
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--bg-sheet)] px-3 py-1 text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
                {filteredList.length} shown
              </span>
            </div>

            {/* Unified Status Filter Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {statusTabs.map((tab) => {
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#191b1e] text-white dark:bg-[#f1f2ea] dark:text-[#181a18]'
                        : 'border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums leading-none ${
                        active
                          ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#181a18]'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 space-y-3">
              {filteredList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-sheet)] p-6 text-center text-xs text-[var(--text-secondary)]">
                  No opportunities in this status tab.
                </div>
              ) : (
                filteredList.map((entry) => {
                  const isSelected = selectedEntry?.opportunity.id === entry.opportunity.id
                  const topBarClass = CATEGORY_TOP_BARS[entry.opportunity.category]
                  const isUrgent = entry.daysLeft <= 14

                  return (
                    <div key={entry.opportunity.id} data-anim="tracked-item">
                      <button
                        type="button"
                        onClick={() => setSearchParams({ opportunity: entry.opportunity.id })}
                        className={`w-full cursor-pointer overflow-hidden rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#191b1e] bg-[var(--bg-card)] shadow-sm dark:border-[#f1f2ea]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className={`h-[3px] w-full ${topBarClass}`} />
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                                style={{ backgroundColor: entry.opportunity.orgAccent }}
                              >
                                {entry.opportunity.orgInitials}
                              </span>
                              <span className="truncate text-xs font-semibold text-[var(--text-secondary)]">
                                {entry.opportunity.organization}
                              </span>
                            </div>
                            <CareerkuMatchGauge
                              score={entry.opportunity.match.score}
                              size="sm"
                              className="shrink-0"
                            />
                          </div>

                          <p className="mt-2.5 line-clamp-2 text-sm font-bold leading-snug text-[var(--text-primary)]">
                            {entry.opportunity.title}
                          </p>

                          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="rounded-full bg-[var(--bg-card)] px-2.5 py-0.5 font-semibold text-[var(--text-primary)] shadow-2xs">
                              {getStatusLabel(entry.application.status)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                                isUrgent
                                  ? 'text-[var(--status-danger-text)]'
                                  : 'text-[var(--text-secondary)]'
                              }`}
                            >
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span>
                                {formatDateID(entry.opportunity.deadline)} (D-
                                {Math.max(0, entry.daysLeft)})
                              </span>
                            </span>
                          </div>

                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-[var(--text-secondary)]">Document readiness</span>
                              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                                {entry.completedCount}/{entry.totalDocs} ({entry.progressPercent}%)
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${topBarClass}`}
                                style={{ width: `${Math.max(8, entry.progressPercent)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Application Workspace (7 cols) */}
          {selectedEntry && (
            <div
              data-anim="tracker-panel"
              className="careerku-card flex flex-col gap-5 rounded-3xl p-5 sm:p-6 xl:col-span-7"
            >
              <div data-anim="workspace-detail" className="flex flex-col gap-5">
              <div className="border-b border-[var(--border-subtle)] pb-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                      style={{ backgroundColor: selectedEntry.opportunity.orgAccent }}
                    >
                      {selectedEntry.opportunity.orgInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-secondary)]">
                        {selectedEntry.opportunity.organization} •{' '}
                        {selectedEntry.opportunity.typeLabel}
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold leading-snug text-[var(--text-primary)]">
                        {selectedEntry.opportunity.title}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        Deadline {formatDateID(selectedEntry.opportunity.deadline)} (D-
                        {Math.max(0, selectedEntry.daysLeft)})
                      </p>
                    </div>
                  </div>

                  <CareerkuMatchGauge
                    score={selectedEntry.opportunity.match.score}
                    size="lg"
                    className="shrink-0"
                  />
                </div>

                {/* Aligned Quick Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={selectedEntry.opportunity.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="careerku-btn-secondary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => openOpportunityDetail(selectedEntry.opportunity.id)}
                    className="careerku-btn-secondary inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => untrackOpportunity(selectedEntry.opportunity.id)}
                    aria-label="Remove from tracker"
                    title="Remove from tracker"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--status-danger-border)] hover:bg-[var(--status-danger-soft)] hover:text-[var(--status-danger-text)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Status Switcher */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  Application Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => {
                    const active = selectedEntry.application.status === status
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(selectedEntry.opportunity.id, status)
                        }
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-[#191b1e] text-white dark:bg-[#f1f2ea] dark:text-[#181a18]'
                            : 'border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Workspace Sub-tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-3.5">
                <button
                  type="button"
                  onClick={() => setPrepView('checklist')}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    prepView === 'checklist'
                      ? 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>
                    Document Checklist ({selectedEntry.completedCount}/{selectedEntry.totalDocs})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrepView('documents')}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    prepView === 'documents'
                      ? 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>CV & Motivation Letter Guide</span>
                </button>
              </div>

              {prepView === 'checklist' ? (
                <div data-anim="prep-content" className="space-y-4">
                  {/* Selected Application Document Progress */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text-secondary)]">
                        Checklist completion
                      </span>
                      <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                        {selectedEntry.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                      <div
                        data-anim="checklist-bar"
                        className="h-full origin-left rounded-full bg-[var(--status-success)] transition-all duration-500"
                        style={{ width: `${selectedEntry.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {selectedEntry.application.documents.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => toggleDocumentItem(selectedEntry.opportunity.id, doc.id)}
                        className="group flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-4 py-3.5 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                            doc.completed
                              ? 'bg-[var(--status-success)] text-white dark:text-[#111311]'
                              : 'border-2 border-[var(--border-strong)] bg-[var(--bg-card)] text-transparent group-hover:border-[var(--accent-indigo)]'
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p
                              className={`text-sm font-semibold leading-snug ${
                                doc.completed
                                  ? 'text-[var(--text-muted)] line-through'
                                  : 'text-[var(--text-primary)]'
                              }`}
                            >
                              {doc.label}
                            </p>
                            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                              {doc.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                            {doc.tip}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1">
                    <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                      Personal Notes / Reminders
                    </label>
                    <textarea
                      rows={3}
                      value={selectedEntry.application.notes}
                      onChange={(e) =>
                        updateApplicationDrafts(selectedEntry.opportunity.id, {
                          notes: e.target.value,
                        })
                      }
                      placeholder="Example: Request advisor recommendation letter on Thursday..."
                      className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div data-anim="prep-content" className="space-y-4">
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4 sm:p-5">
                    <h4 className="mb-2 text-sm font-bold text-[var(--text-primary)]">
                      Recommended CV Highlights for This Opportunity
                    </h4>
                    <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {selectedEntry.opportunity.cvHighlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <textarea
                      rows={3}
                      value={selectedEntry.application.cvDraftNote}
                      onChange={(e) =>
                        updateApplicationDrafts(selectedEntry.opportunity.id, {
                          cvDraftNote: e.target.value,
                        })
                      }
                      placeholder="Jot down CV tweaks specific to this role..."
                      className="mt-3 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4 sm:p-5">
                    <h4 className="mb-2 text-sm font-bold text-[var(--text-primary)]">
                      Motivation Letter / Essay Prompts
                    </h4>
                    <ul className="mb-3 space-y-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {selectedEntry.opportunity.motivationLetterPrompts.map((prompt) => (
                        <li
                          key={prompt}
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5"
                        >
                          • {prompt}
                        </li>
                      ))}
                    </ul>
                    <textarea
                      rows={4}
                      value={selectedEntry.application.motivationLetterDraft}
                      onChange={(e) =>
                        updateApplicationDrafts(selectedEntry.opportunity.id, {
                          motivationLetterDraft: e.target.value,
                        })
                      }
                      placeholder="Draft your motivation letter outline here..."
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedEntry.opportunity.category === 'internship' && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-4 py-3.5 text-xs">
                  <span className="text-[var(--text-secondary)]">
                    Want to check <em>skill gaps</em> & portfolio ideas before applying?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/analyze?opportunity=${selectedEntry.opportunity.id}`)
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-[var(--accent-indigo)] hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Open AI Analysis</span>
                  </button>
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
