import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const fromVars: gsap.TweenVars = {
        opacity: 0,
        y: distancePx,
        scale: scaleFrom,
      }
      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        delay: delayMs / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }

      if (blur) {
        fromVars.filter = 'blur(6px)'
        toVars.filter = 'blur(0px)'
      }

      gsap.fromTo(node, fromVars, toVars)
    })

    return () => mm.revert()
  }, [delayMs, distancePx, scaleFrom, blur])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
