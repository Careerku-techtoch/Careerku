import { Flag } from 'lucide-react'
import type { MatchEvaluation } from '@/types'

interface MatchBadgeProps {
  match: MatchEvaluation
  showPercentage?: boolean
}

const TIER_STYLES = {
  high: 'bg-[var(--status-success-soft)] text-[var(--status-success-text)] border-[var(--status-success-border)]',
  medium:
    'bg-[var(--status-warning-soft)] text-[var(--status-warning-text)] border-[var(--status-warning-border)]',
  low: 'bg-[var(--status-danger-soft)] text-[var(--status-danger-text)] border-[var(--status-danger-border)]',
} as const

export function MatchBadge({ match, showPercentage = false }: MatchBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold tracking-tight ${TIER_STYLES[match.tier]}`}
      title={`Match score ${match.score}%`}
    >
      <Flag className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
      <span>
        {match.tierLabel}{' '}
        {showPercentage ? `${match.score}%` : `${match.scoreOutOfTen}/10`}
      </span>
    </span>
  )
}
