import { Check, MapPin, Sparkles } from 'lucide-react'
import type { EnrichedOpportunity, OpportunityCategory } from '@/types'
import { formatDateID, getCategoryLabel, getDaysUntilDeadline } from '@/utils'
import { CareerkuMatchGauge } from './CareerkuMatchGauge'

const CATEGORY_TOP_BARS: Record<OpportunityCategory, string> = {
  internship: 'bg-[var(--cat-internship)]',
  scholarship: 'bg-[var(--cat-scholarship)]',
  competition: 'bg-[var(--cat-competition)]',
}

interface OpportunityCardProps {
  opportunity: EnrichedOpportunity
  isTracked: boolean
  onViewDetails: (id: string) => void
  onToggleTrack: (id: string) => void
}

export function OpportunityCard({
  opportunity,
  isTracked,
  onViewDetails,
  onToggleTrack,
}: OpportunityCardProps) {
  const daysLeft = Math.max(0, getDaysUntilDeadline(opportunity.deadline))
  const isUrgent = daysLeft <= 14
  const totalTechSkills = opportunity.requirements.technicalSkills.length
  const matchedTechSkills = opportunity.match.matchedSkills.length

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-sm">
      {/* Top 3px Category Accent Bar */}
      <div className={`h-[3px] w-full ${CATEGORY_TOP_BARS[opportunity.category]}`} />

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Header Row: Org Avatar + Meta | Careerku C-Logo Match Gauge */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: opportunity.orgAccent }}
              >
                {opportunity.orgInitials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                  {opportunity.organization}
                </p>
                <p className="truncate text-xs text-[var(--text-secondary)]">
                  {getCategoryLabel(opportunity.category)} • {opportunity.workMode}
                </p>
              </div>
            </div>

            <CareerkuMatchGauge
              score={opportunity.match.score}
              size="md"
              className="shrink-0"
            />
          </div>

          {/* Clickable Title & Summary */}
          <button
            type="button"
            onClick={() => onViewDetails(opportunity.id)}
            className="mt-3 block w-full cursor-pointer text-left"
          >
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-[var(--text-primary)] group-hover:underline">
              {opportunity.title}
            </h3>
          </button>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {opportunity.summary}
          </p>

          {/* Metadata Chips & Skill Coverage Hint */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[140px]">{opportunity.location}</span>
            </span>

            {opportunity.category === 'internship' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-indigo-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-indigo)]">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span>AI Analysis Ready</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                Checklist Ready
              </span>
            )}
          </div>

          {totalTechSkills > 0 && (
            <p className="mt-2.5 text-xs text-[var(--text-secondary)]">
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                {matchedTechSkills}/{totalTechSkills}
              </span>{' '}
              core skills matched
            </p>
          )}
        </div>

        {/* Footer: Deadline & Dual Action Buttons */}
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-3.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[var(--text-secondary)]">
              Due {formatDateID(opportunity.deadline)}
            </span>
            <span
              className={`font-semibold tabular-nums ${
                isUrgent ? 'text-[var(--status-danger-text)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              D-{daysLeft}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onViewDetails(opportunity.id)}
              className="careerku-btn-secondary cursor-pointer rounded-full py-2 text-xs font-semibold"
            >
              View Details
            </button>

            <button
              type="button"
              onClick={() => onToggleTrack(opportunity.id)}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-all ${
                isTracked
                  ? 'border border-[var(--accent-indigo)]/30 bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] hover:opacity-90'
                  : 'careerku-btn-primary'
              }`}
            >
              {isTracked && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
              <span>{isTracked ? 'Saved' : 'Save & Track'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
