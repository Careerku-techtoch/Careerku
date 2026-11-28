import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import {
  ArrowUpRight,
  GraduationCap,
  Layers,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import {
  DeadlinePulseGlyph,
  DocumentReadyGlyph,
  HighMatchGlyph,
  MatchIndexGlyph,
  OpportunityCard,
} from '@/components'
import { useCareerku } from '@/hooks'
import type { OpportunityCategory } from '@/types'
import { getDaysUntilDeadline } from '@/utils'

type DiscoverTab = 'all' | OpportunityCategory
type SortMode = 'match' | 'deadline'

export function DiscoverPage() {
  const navigate = useNavigate()
  const {
    profile,
    opportunities,
    trackedApplications,
    getTrackedByOpportunityId,
    trackOpportunity,
    untrackOpportunity,
    openOpportunityDetail,
  } = useCareerku()

  const [activeTab, setActiveTab] = useState<DiscoverTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyHighMatch, setOnlyHighMatch] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('match')

  const sectionRef = useRef<HTMLElement | null>(null)
  const filterKey = `${activeTab}|${onlyHighMatch}|${sortMode}`
  const prevFilterKeyRef = useRef(filterKey)

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
            '[data-anim="catalog-panel"]',
            {
              y: 22,
              opacity: 0,
              duration: 0.52,
              clearProps: 'transform',
            },
            '-=0.28',
          )
          .from(
            '[data-anim="opp-card"]',
            {
              y: 16,
              opacity: 0,
              scale: 0.985,
              duration: 0.42,
              stagger: 0.045,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.3',
          )
      },
      sectionRef,
    )
    return () => mm.revert()
  }, [])

  useLayoutEffect(() => {
    if (prevFilterKeyRef.current === filterKey) return
    prevFilterKeyRef.current = filterKey

    if (!sectionRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = sectionRef.current.querySelectorAll('[data-anim="opp-card"]')
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { y: 12, opacity: 0, scale: 0.985 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.34,
        stagger: 0.04,
        ease: 'power2.out',
        clearProps: 'transform',
        overwrite: 'auto',
      },
    )
  }, [filterKey])

  const categoryCounts = useMemo(() => {
    const internship = opportunities.filter((o) => o.category === 'internship').length
    const competition = opportunities.filter((o) => o.category === 'competition').length
    const scholarship = opportunities.filter((o) => o.category === 'scholarship').length

    return [
      { id: 'all' as const, label: 'All', count: opportunities.length },
      { id: 'internship' as const, label: 'Internships', count: internship },
      { id: 'competition' as const, label: 'Competitions', count: competition },
      { id: 'scholarship' as const, label: 'Scholarships', count: scholarship },
    ]
  }, [opportunities])

  const highMatchCount = useMemo(
    () => opportunities.filter((o) => o.match.tier === 'high').length,
    [opportunities],
  )
  const highMatchPct = Math.round(
    (highMatchCount / Math.max(1, opportunities.length)) * 100,
  )
  const urgentCount = useMemo(
    () =>
      opportunities.filter((o) => {
        const days = getDaysUntilDeadline(o.deadline)
        return days >= 0 && days <= 14
      }).length,
    [opportunities],
  )

  const filteredOpportunities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return opportunities
      .filter((opp) => (activeTab === 'all' ? true : opp.category === activeTab))
      .filter((opp) => (onlyHighMatch ? opp.match.tier === 'high' : true))
      .filter((opp) => {
        if (!query) return true
        return (
          opp.title.toLowerCase().includes(query) ||
          opp.organization.toLowerCase().includes(query) ||
          opp.summary.toLowerCase().includes(query) ||
          opp.requirements.technicalSkills.some((s) => s.toLowerCase().includes(query))
        )
      })
      .sort((a, b) => {
        if (sortMode === 'deadline') {
          return getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline)
        }
        return b.match.score - a.match.score
      })
  }, [opportunities, activeTab, onlyHighMatch, searchQuery, sortMode])

  const sectionHeading = useMemo(() => {
    switch (activeTab) {
      case 'internship':
        return 'Recommended Internships (With AI Analysis)'
      case 'competition':
        return 'Student Competitions & Hackathons'
      case 'scholarship':
        return 'Undergraduate Scholarships & Grants'
      default:
        return 'Recommended Opportunities for You'
    }
  }, [activeTab])

  const handleToggleTrack = (id: string) => {
    if (getTrackedByOpportunityId(id)) {
      untrackOpportunity(id)
    } else {
      trackOpportunity(id, 'saved')
    }
  }

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
            Discover Opportunities
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-secondary)]">
            <GraduationCap className="h-4 w-4 shrink-0 text-[var(--accent-indigo)]" />
            <span>
              Matched to {profile.major} • Semester {profile.semester} • GPA{' '}
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {profile.gpa.toFixed(2)}
              </span>
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/analyze')}
            className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
          >
            <span>AI Skill Gap</span>
            <ArrowUpRight className="h-4 w-4" />
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
            onClick={() => {
              setActiveTab('all')
              setOnlyHighMatch(false)
            }}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Verified Listings
              </span>
              <HighMatchGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {opportunities.length}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Internships, competitions & scholarships
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => setOnlyHighMatch((v) => !v)}
            className={`careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)] ${
              onlyHighMatch ? 'ring-2 ring-[var(--accent-indigo)]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                High Matches
              </span>
              <MatchIndexGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {highMatchCount}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {highMatchPct}% match your current profile
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => navigate('/tracker')}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Saved to Tracker
              </span>
              <DocumentReadyGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {trackedApplications.length}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                In your active application list
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => setSortMode('deadline')}
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
                {urgentCount}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Click to sort by closest deadline
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. MAIN OPPORTUNITIES CATALOG                                       */}
      {/* =================================================================== */}
      <div data-anim="catalog-panel" className="careerku-card rounded-3xl p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{sectionHeading}</h2>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Showing {filteredOpportunities.length} verified opportunities matched to your profile
          </p>
        </div>

        {/* Controls Bar: Unified Category Pills + Search/Filter/Sort */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categoryCounts.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search role, organization, skill..."
                className="w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyHighMatch((v) => !v)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                onlyHighMatch
                  ? 'border-transparent bg-[var(--accent-indigo)] text-white'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>High Match</span>
            </button>

            <select
              aria-label="Sort opportunities"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="cursor-pointer rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
            >
              <option value="match">Sort: Highest Match</option>
              <option value="deadline">Sort: Closest Deadline</option>
            </select>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-sheet)] px-6 py-14 text-center">
            <Layers className="mb-2 h-6 w-6 text-[var(--text-muted)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              No opportunities match your current filters
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Try adjusting your search query or disabling the High Match filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setOnlyHighMatch(false)
                setActiveTab('all')
              }}
              className="careerku-btn-primary mt-4 cursor-pointer rounded-full px-4 py-2 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} data-anim="opp-card" className="h-full">
                <OpportunityCard
                  opportunity={opportunity}
                  isTracked={Boolean(getTrackedByOpportunityId(opportunity.id))}
                  onViewDetails={openOpportunityDetail}
                  onToggleTrack={handleToggleTrack}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
