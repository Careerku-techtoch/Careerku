import { useId } from 'react'

interface CareerkuLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  inverted?: boolean
  badge?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { icon: 'h-6 w-6', badge: 'h-8 w-8 p-1.5', text: 'text-sm' },
  md: { icon: 'h-7 w-7', badge: 'h-10 w-10 p-2', text: 'text-base' },
  lg: { icon: 'h-9 w-9', badge: 'h-12 w-12 p-2.5', text: 'text-xl' },
} as const

export function CareerkuLogo({
  size = 'md',
  showWordmark = false,
  inverted = false,
  badge = false,
  className = '',
}: CareerkuLogoProps) {
  const gradId = useId()
  const dims = SIZE_MAP[size]

  const arcColor = inverted ? '#FFFFFF' : 'currentColor'

  const markSvg = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={badge ? 'h-full w-full' : dims.icon}
    >
      <defs>
        <linearGradient id={gradId} x1="24" y1="7" x2="43" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={inverted ? '#B8BCFF' : '#5860EC'} />
          <stop offset="100%" stopColor={inverted ? '#8D93FA' : '#8E94FA'} />
        </linearGradient>
      </defs>

      {/* Open Geometric "C" Arc */}
      <path
        d="M 26.4 12.6 A 14.5 14.5 0 1 0 35.5 26.5"
        stroke={arcColor}
        strokeWidth="5.8"
        strokeLinecap="butt"
      />

      {/* Primary 4-Point AI Sparkle */}
      <path
        d="M 33.5 7.3 Q 34.4 15.6 42.7 16.5 Q 34.4 17.4 33.5 25.7 Q 32.6 17.4 24.3 16.5 Q 32.6 15.6 33.5 7.3 Z"
        fill={`url(#${gradId})`}
      />

      {/* Companion Small Sparkle */}
      <path
        d="M 41.8 3 Q 42.3 6.7 46 7.2 Q 42.3 7.7 41.8 11.4 Q 41.3 7.7 37.6 7.2 Q 41.3 6.7 41.8 3 Z"
        fill={inverted ? '#C7CBFF' : '#9AA0FA'}
      />
    </svg>
  )

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {badge ? (
        <span
          className={`flex shrink-0 items-center justify-center rounded-full shadow-xs ${dims.badge} ${
            inverted
              ? 'bg-[#1c1e21] text-white'
              : 'bg-[var(--bg-card)] text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]'
          }`}
        >
          {markSvg}
        </span>
      ) : (
        <span className="inline-flex shrink-0 items-center justify-center">{markSvg}</span>
      )}

      {showWordmark && (
        <span
          className={`font-bold tracking-tight ${dims.text} ${
            inverted ? 'text-white' : 'text-[var(--text-primary)]'
          }`}
        >
          Careerku
        </span>
      )}
    </span>
  )
}
