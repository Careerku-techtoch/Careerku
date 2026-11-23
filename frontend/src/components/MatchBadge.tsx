import { Flag } from 'lucide-react'
import type { MatchEvaluation } from '@/types'

interface MatchBadgeProps {
  match: MatchEvaluation
  showPercentage?: boolean
}

const TIER_STYLES = {
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
  medium:
    'bg-indigo-50 text-indigo-600 border-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30',
  low: 'bg-rose-50 text-rose-600 border-rose-200/70 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
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
