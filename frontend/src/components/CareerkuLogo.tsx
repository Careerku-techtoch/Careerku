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
        <linearGradient id={gradId} x1="24" y1="24" x2="41" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={inverted ? '#10B981' : '#059669'} />
          <stop offset="100%" stopColor={inverted ? '#34D399' : '#10B981'} />
        </linearGradient>
      </defs>

      {/* Open Geometric "C" Arc */}
      <path
        d="M 26.8 12 A 14.5 14.5 0 1 0 35.8 26.4"
        stroke={arcColor}
        strokeWidth="5.8"
        strokeLinecap="butt"
      />

      {/* Forest Green Compass Needle (Primary Tip) */}
      <polygon points="41,7 34.5,20 28,13.5" fill={`url(#${gradId})`} />

      {/* Forest Green Compass Needle (Tail Accent) */}
      <polygon
        points="24,24 28,13.5 34.5,20"
        fill={inverted ? '#10B981' : '#059669'}
        fillOpacity="0.45"
      />
    </svg>
  )

  return (
    <span
      className={`inline-flex items-center gap-2 ${
        inverted ? 'text-white' : 'text-[var(--text-primary)]'
      } ${className}`}
    >
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
        <span className={`font-bold tracking-tight ${dims.text}`}>Careerku</span>
      )}
    </span>
  )
}
