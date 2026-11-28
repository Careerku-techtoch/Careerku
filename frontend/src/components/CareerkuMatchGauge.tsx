import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

interface CareerkuMatchGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-11 w-11',
  md: 'h-13 w-13',
  lg: 'h-16 w-16',
} as const

const C_ARC_PATH = 'M 31.24 12.81 A 18 18 0 1 0 42.46 30.76'

export function CareerkuMatchGauge({
  score,
  size = 'md',
  className = '',
}: CareerkuMatchGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)))
  const arcRef = useRef<SVGPathElement | null>(null)
  const sparkleGroupRef = useRef<SVGGElement | null>(null)

  useLayoutEffect(() => {
    const arc = arcRef.current
    const sparkles = sparkleGroupRef.current
    if (!arc) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        arc,
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 100 - clampedScore,
          duration: 0.85,
          ease: 'power2.out',
        },
      )

      if (sparkles) {
        gsap.fromTo(
          sparkles,
          { scale: 0.6, opacity: 0, transformOrigin: 'center center' },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            delay: 0.35,
            ease: 'back.out(1.7)',
            clearProps: 'transform,opacity',
          },
        )
      }
    })

    return () => mm.revert()
  }, [clampedScore])

  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${clampedScore}% Match`}
      className={`${SIZE_CLASSES[size]} ${className}`}
    >
      <title>{`${clampedScore}% Match`}</title>

      {/* Background Track */}
      <path
        d={C_ARC_PATH}
        stroke="var(--border-strong)"
        strokeOpacity="0.45"
        strokeWidth="4.6"
        strokeLinecap="butt"
      />

      {/* Proportional Progress Fill along the C Arc */}
      <path
        ref={arcRef}
        d={C_ARC_PATH}
        pathLength={100}
        stroke="var(--text-primary)"
        strokeWidth="4.6"
        strokeLinecap="butt"
        strokeDasharray={100}
        strokeDashoffset={100 - clampedScore}
      />

      {/* Careerku Forest Green Compass Needle */}
      <g ref={sparkleGroupRef}>
        <polygon
          points="48,7 40.5,22 33,14.5"
          className="fill-[#059669] dark:fill-[#10b981]"
        />
        <polygon
          points="29,26 33,14.5 40.5,22"
          className="fill-[#059669]/45 dark:fill-[#10b981]/45"
        />
      </g>

      {/* Centered Percentage Label */}
      <text
        x="24.5"
        y="30.2"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-primary)"
        fontSize="12.5"
        fontWeight="700"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {clampedScore}%
      </text>
    </svg>
  )
}
