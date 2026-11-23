import { Calendar, CheckCircle2, Info, Sparkles, Tag } from 'lucide-react'
import type { EnrichedOpportunity } from '@/types'
import { formatDateID, getDaysUntilDeadline } from '@/utils'
import { MatchBadge } from './MatchBadge'

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
  const daysLeft = getDaysUntilDeadline(opportunity.deadline)

  return (
    <article className="careerku-card flex flex-col justify-between rounded-2xl p-5 hover:border-[var(--border-strong)]">
      <div>
        {/* Card Header: Org Logo + Name | Match Score Badge */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: opportunity.orgAccent }}
            >
              {opportunity.orgInitials}
            </span>
            <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {opportunity.organization}
            </span>
          </div>
          <MatchBadge match={opportunity.match} />
        </div>

        {/* Two Side-by-Side Soft Metadata Boxes */}
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="careerku-subtle rounded-xl px-3 py-2.5">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
              <Tag className="h-3.5 w-3.5 shrink-0" />
              <span>Type</span>
            </div>
            <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
              {opportunity.typeLabel}
            </p>
          </div>

          <div className="careerku-subtle rounded-xl px-3 py-2.5">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Deadline</span>
            </div>
            <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
              {formatDateID(opportunity.deadline)}
            </p>
          </div>
        </div>

        {/* Title & Concise Summary */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
              {opportunity.title}
            </h3>
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {opportunity.summary}
          </p>
        </div>

        {/* Compact Status / AI Indicator Row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <span>
            {daysLeft <= 14 ? (
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {Math.max(0, daysLeft)} days left
              </span>
            ) : (
              <span>{daysLeft} days until deadline</span>
            )}
          </span>
          {opportunity.category === 'internship' ? (
            <span className="inline-flex items-center gap-1 font-medium text-[var(--accent-indigo)]">
              <Sparkles className="h-3 w-3" />
              AI Analysis ready
            </span>
          ) : (
            <span>Checklist ready</span>
          )}
        </div>
      </div>

      {/* Bottom Dual Pill Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onViewDetails(opportunity.id)}
          className="careerku-btn-secondary inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-semibold"
        >
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>View details</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleTrack(opportunity.id)}
          className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-semibold ${
            isTracked
              ? 'border border-emerald-500/30 bg-emerald-600 text-white hover:bg-emerald-700'
              : 'careerku-btn-primary'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{isTracked ? 'Saved' : 'Save / Track'}</span>
        </button>
      </div>
    </article>
  )
}
