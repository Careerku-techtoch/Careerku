import { useId } from 'react'

interface GlyphProps {
  className?: string
}

export function HighMatchGlyph({ className = 'h-5 w-5' }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="3"
        y="8.5"
        width="15.5"
        height="11.5"
        rx="2.75"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 8.5V6.5A1.5 1.5 0 0 1 9.5 5H12a1.5 1.5 0 0 1 1.5 1.5v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M3 13.5h15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5 Q18.95 5.55 22 6 Q18.95 6.45 18.5 9.5 Q18.05 6.45 15 6 Q18.05 5.55 18.5 2.5 Z"
        fill="var(--accent-indigo)"
      />
    </svg>
  )
}

export function MatchIndexGlyph({ className = 'h-5 w-5' }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.09" />
      <path
        d="M15.86 4.43A8.5 8.5 0 1 0 20.21 14.2"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <path
        d="M7.5 14.75L11 11.25L13.5 13.5L18.5 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18.5" cy="7.5" r="2.25" fill="var(--accent-indigo)" />
    </svg>
  )
}

export function DocumentReadyGlyph({ className = 'h-5 w-5' }: GlyphProps) {
  const maskId = useId()

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="17.5" cy="17" r="5" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path
          d="M6.5 3.5H13.75L17.5 7.25V18A2 2 0 0 1 15.5 20H6.5A2 2 0 0 1 4.5 18V5.5A2 2 0 0 1 6.5 3.5Z"
          fill="currentColor"
          fillOpacity="0.11"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 3.5V7.5H17.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10.75H13.5M8 14.25H11.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </g>
      <circle cx="17.5" cy="17" r="4" fill="var(--accent-indigo)" />
      <path
        d="M15.8 17L17 18.2L19.35 15.8"
        stroke="var(--bg-card)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DeadlinePulseGlyph({ className = 'h-5 w-5' }: GlyphProps) {
  const maskId = useId()

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="17.5" cy="17" r="5" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path
          d="M3.5 7.5A2 2 0 0 1 5.5 5.5H17.5A2 2 0 0 1 19.5 7.5V10H3.5V7.5Z"
          fill="currentColor"
          fillOpacity="0.14"
        />
        <rect
          x="3.5"
          y="5.5"
          width="16"
          height="14.5"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M7.75 3.5V6.25M15.25 3.5V6.25M3.5 10H19.5"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
        />
        <circle cx="7.75" cy="13.75" r="1" fill="currentColor" fillOpacity="0.5" />
        <circle cx="11.25" cy="13.75" r="1" fill="currentColor" fillOpacity="0.5" />
        <circle cx="7.75" cy="16.75" r="1" fill="currentColor" fillOpacity="0.5" />
      </g>
      <circle cx="17.5" cy="17" r="4" fill="var(--accent-indigo)" />
      <path
        d="M17.5 15.15V17L18.85 17.8"
        stroke="var(--bg-card)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
