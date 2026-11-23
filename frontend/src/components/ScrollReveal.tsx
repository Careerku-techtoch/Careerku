import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delayMs?: number
  distancePx?: number
  scaleFrom?: number
  blur?: boolean
  className?: string
}

export function ScrollReveal({
  children,
  delayMs = 0,
  distancePx = 32,
  scaleFrom = 0.98,
  blur = true,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
          } else if (entry.boundingClientRect.top > 0) {
            setIsVisible(false)
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate3d(0, 0, 0) scale(1)'
          : `translate3d(0, ${distancePx}px, 0) scale(${scaleFrom})`,
        filter: blur ? (isVisible ? 'blur(0px)' : 'blur(5px)') : undefined,
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: '880ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isVisible ? `${delayMs}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  )
}
