import { useMemo, useState } from 'react'
import {
  Award,
  Briefcase,
  Layers,
  Search,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react'
import { FolderTabs, OpportunityCard, type FolderTabItem } from '@/components'
import { useCareerku } from '@/hooks'
import type { OpportunityCategory } from '@/types'
import { getDaysUntilDeadline } from '@/utils'

type DiscoverTab = 'all' | OpportunityCategory
type SortMode = 'match' | 'deadline'

export function DiscoverPage() {
  const {
    opportunities,
    getTrackedByOpportunityId,
    trackOpportunity,
    untrackOpportunity,
    openOpportunityDetail,
  } = useCareerku()

  const [activeTab, setActiveTab] = useState<DiscoverTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyHighMatch, setOnlyHighMatch] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('match')

  const tabs = useMemo<FolderTabItem<DiscoverTab>[]>(() => {
    const internshipCount = opportunities.filter((o) => o.category === 'internship').length
    const competitionCount = opportunities.filter((o) => o.category === 'competition').length
    const scholarshipCount = opportunities.filter((o) => o.category === 'scholarship').length

    return [
      { id: 'all', label: 'All Opportunities', count: opportunities.length, icon: Layers },
      { id: 'internship', label: 'Internships', count: internshipCount, icon: Briefcase },
      { id: 'competition', label: 'Competitions', count: competitionCount, icon: Trophy },
      { id: 'scholarship', label: 'Scholarships', count: scholarshipCount, icon: Award },
    ]
  }, [opportunities])

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
    <section className="flex flex-col gap-3.5">
      <FolderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="careerku-sheet relative z-10 rounded-[28px] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
              {sectionHeading}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Showing {filteredOpportunities.length} verified opportunities matched to your
              academic profile and skills
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search role, organization, skill..."
                className="w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyHighMatch((v) => !v)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold ${
                onlyHighMatch
                  ? 'border-emerald-500/30 bg-emerald-600 text-white'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>High Match</span>
            </button>

            <select
              aria-label="Sort opportunities"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="cursor-pointer rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
            >
              <option value="match">Sort: Highest Match</option>
              <option value="deadline">Sort: Closest Deadline</option>
            </select>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="careerku-card flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center">
            <p className="mb-1 text-sm font-semibold text-[var(--text-primary)]">
              No opportunities match your current filters
            </p>
            <p className="mb-4 text-xs text-[var(--text-secondary)]">
              Try adjusting your search query or disabling the High Match filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setOnlyHighMatch(false)
                setActiveTab('all')
              }}
              className="careerku-btn-primary cursor-pointer rounded-full px-4 py-2 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                isTracked={Boolean(getTrackedByOpportunityId(opportunity.id))}
                onViewDetails={openOpportunityDetail}
                onToggleTrack={handleToggleTrack}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
