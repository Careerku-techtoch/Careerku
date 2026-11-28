import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Moon,
  Sparkles,
  Sun,
  Trophy,
} from 'lucide-react'
import { CareerkuLogo } from '@/components'
import { useCareerku } from '@/hooks'

gsap.registerPlugin(ScrollTrigger)

interface ProcessStep {
  stepLabel: string
  title: string
  description: string
  to: string
}

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    stepLabel: 'Step 1',
    title: 'Build Profile & Discover',
    description:
      'Enter your GPA, semester, major, and skills to explore verified internships, scholarships, and competitions.',
    to: '/profile',
  },
  {
    stepLabel: 'Step 2',
    title: 'Smart Rule-Based Matching',
    description:
      'The engine checks your profile against official criteria — GPA, semester, major, and skills — for instant fit scores.',
    to: '/discover',
  },
  {
    stepLabel: 'Step 3',
    title: 'AI Skill Gap Analysis',
    description:
      'LLM-powered analysis highlights unfulfilled internship requirements so you see exactly what to strengthen.',
    to: '/analyze',
  },
  {
    stepLabel: 'Step 4',
    title: 'Plan Your Next Skill Sprint',
    description:
      'Follow prioritized skill roadmaps and tailored portfolio project ideas to close gaps with clear direction.',
    to: '/analyze',
  },
  {
    stepLabel: 'Step 5',
    title: 'Track Your Applications',
    description:
      'Careerku stores your CVs, checklists, statuses, and deadlines — helping you see real progress over time.',
    to: '/tracker',
  },
] as const

const PROCESS_PHOTOS = [
  {
    src: '/images/step-01.jpg',
    alt: 'Undergraduate students studying with laptops inside a sunlit university library',
    objectPosition: 'object-center',
  },
  {
    src: '/images/step-02.jpg',
    alt: 'Clean sunlit minimalist desk with a laptop ready for career research',
    objectPosition: 'object-center',
  },
  {
    src: '/images/step-04.jpg',
    alt: 'Minimalist workspace with notebook, pencil, and coffee for application planning',
    objectPosition: 'object-center',
  },
] as const

const STUDENT_VOICES = [
  {
    quote:
      'I used to scroll through dozens of social accounts and campus groups every week. Now I immediately see which internships match my GPA and skills.',
    name: 'Raka Pratama',
    role: 'Computer Science • Semester 5',
    tag: 'Internships & AI Gap',
    actionLabel: 'Explore Internships',
    to: '/discover',
    hoverBgClass: '-translate-y-2 border-transparent bg-[#1e5640] text-white shadow-xl shadow-emerald-950/25',
    hoverBadgeClass: 'bg-white text-[#1e5640]',
  },
  {
    quote:
      'The AI skill gap breakdown and portfolio project ideas showed me exactly what to build before applying for technical roles.',
    name: 'Nadia Kusuma',
    role: 'Information Systems • Semester 6',
    tag: 'Improve Portfolio',
    actionLabel: 'Try AI Skill Gap',
    to: '/analyze',
    hoverBgClass: '-translate-y-2 border-transparent bg-[#26332c] text-white shadow-xl shadow-black/25',
    hoverBadgeClass: 'bg-[#8cd4b5] text-[#18221d]',
  },
  {
    quote:
      'Having CV pointers, motivation letter checklists, and deadline countdowns in one workspace made scholarship prep completely stress-free.',
    name: 'Dimas Arya',
    role: 'Industrial Engineering • Semester 4',
    tag: 'Scholarships & Track',
    actionLabel: 'Open Document Tracker',
    to: '/tracker',
    hoverBgClass: '-translate-y-2 border-transparent bg-[#0d4a3a] text-white shadow-xl shadow-emerald-950/25',
    hoverBadgeClass: 'bg-emerald-300 text-[#0d4a3a]',
  },
]

export function WelcomePage() {
  const navigate = useNavigate()
  const { opportunities, profile, theme, setTheme } = useCareerku()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredVoice, setHoveredVoice] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    const root = pageRef.current
    if (!root) return

    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // 1. Global Scroll Progress Bar
        gsap.to('[data-gsap="scroll-progress"]', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2,
          },
        })

        // 2. Hero Entrance Timeline (Immediate on Mount)
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        heroTl
          .fromTo(
            '[data-gsap="hero-bg"]',
            { scale: 1.08 },
            { scale: 1, duration: 1.3, ease: 'power2.out' },
            0,
          )
          .from(
            '[data-gsap="hero-social-label"]',
            { y: 16, opacity: 0, duration: 0.6 },
            0.15,
          )
          .from(
            '[data-gsap="hero-social-icon"]',
            {
              y: 14,
              opacity: 0,
              scale: 0.9,
              duration: 0.5,
              stagger: 0.06,
              clearProps: 'transform',
            },
            0.22,
          )
          .from(
            '[data-gsap="hero-line"]',
            {
              yPercent: 105,
              opacity: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: 'power4.out',
            },
            0.25,
          )
          .from(
            '[data-gsap="hero-desc"]',
            { y: 22, opacity: 0, duration: 0.75 },
            0.55,
          )

        // 3. Hero Scroll Parallax (scrub: true)
        gsap.to('[data-gsap="hero-bg"]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-gsap="hero-section"]',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        gsap.to('[data-gsap="hero-copy"]', {
          y: -32,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-gsap="hero-section"]',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        // 4. Section 2 — About (#about)
        gsap.from('[data-gsap="about-eyebrow"]', {
          x: -20,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.from('[data-gsap="about-headline"]', {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.fromTo(
          '[data-gsap="about-muted"]',
          { opacity: 0.35 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#about',
              start: 'top 78%',
              end: 'top 35%',
              scrub: 0.6,
            },
          },
        )

        // 5. Section 3 — Feature Bento Cards (#features) + Stat Counters
        gsap.from('[data-gsap="feature-card"]', {
          y: 44,
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#features',
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        })

        gsap.utils.toArray<HTMLElement>('[data-gsap-count]').forEach((el) => {
          const target = Number(el.dataset.target ?? '0')
          const suffix = el.dataset.suffix ?? ''
          const counter = { value: 0 }
          gsap.to(counter, {
            value: target,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#features',
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
              el.textContent = `${Math.round(counter.value)}${suffix}`
            },
          })
        })

        // 6. Section 4 — How It Works (#process) Bento Grid + Photo Parallax
        gsap.from('[data-gsap="process-header"]', {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#process',
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.from('[data-gsap="process-arrow"]', {
          x: -16,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap="process-grid"]',
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.from('[data-gsap="process-row-1"]', {
          x: -48,
          opacity: 0,
          scale: 0.97,
          duration: 0.78,
          stagger: { each: 0.09, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap="process-grid"]',
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.from('[data-gsap="process-row-2"]', {
          x: 48,
          opacity: 0,
          scale: 0.97,
          duration: 0.78,
          stagger: { each: 0.09, from: 'end' },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap="process-row-2"]',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.utils.toArray<HTMLElement>('[data-gsap="process-photo-parallax"]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6, scale: 1.14 },
            {
              yPercent: 6,
              scale: 1.14,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })

        // 7. Section 5 — Student Voices (#voices)
        gsap.from('[data-gsap="voices-header"]', {
          y: 26,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#voices',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.from('[data-gsap="voice-card"]', {
          y: 42,
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap="voices-grid"]',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })

        // 8. Section 6 — Dark Footer
        gsap.from('[data-gsap="footer"]', {
          y: 28,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-gsap="footer"]',
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        })
      },
      root,
    )

    return () => mm.revert()
  }, [])

  const highMatchCount = opportunities.filter((o) => o.match.tier === 'high').length

  const renderProcessStepCard = (
    step: ProcessStep,
    rowTag: 'process-row-1' | 'process-row-2',
  ) => (
    <div data-gsap={rowTag} className="flex">
      <button
        type="button"
        onClick={() => navigate(step.to)}
        className="group relative flex min-h-[285px] w-full cursor-pointer flex-col justify-between rounded-[24px] border border-[var(--border-subtle)]/80 bg-[var(--bg-sheet)] p-6 text-left transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--border-strong)] hover:shadow-lg sm:min-h-[320px]"
      >
        {/* Top-Right Circular Brand Emblem Badge (Spintip Signature) */}
        <div className="flex justify-end">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#191b1e] text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1e5640] dark:bg-[#f1f2ea] dark:text-[#181a18] dark:group-hover:bg-[#54a884] dark:group-hover:text-white">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-4.5 w-4.5"
            >
              <path
                d="M 26.4 12.6 A 14.5 14.5 0 1 0 35.5 26.5"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="butt"
              />
              <path
                d="M 33.5 7.3 Q 34.4 15.6 42.7 16.5 Q 34.4 17.4 33.5 25.7 Q 32.6 17.4 24.3 16.5 Q 32.6 15.6 33.5 7.3 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>

        {/* Bottom-Aligned Step Copy */}
        <div className="mt-auto pt-10">
          <p className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            {step.stepLabel}
          </p>
          <h3 className="mt-2 text-[15px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)]">
            {step.title}
          </h3>
          <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-muted)]">
            {step.description}
          </p>
        </div>
      </button>
    </div>
  )

  const renderProcessPhotoCard = (
    photo: (typeof PROCESS_PHOTOS)[number],
    rowTag: 'process-row-1' | 'process-row-2',
  ) => (
    <div data-gsap={rowTag} className="flex">
      <div className="group relative min-h-[285px] w-full overflow-hidden rounded-[24px] bg-[var(--bg-sheet)] sm:min-h-[320px]">
        <div data-gsap="process-photo-parallax" className="absolute inset-0 h-full w-full">
          <img
            src={photo.src}
            alt={photo.alt}
            className={`h-full w-full object-cover ${photo.objectPosition} transition-transform duration-700 ease-out group-hover:scale-105`}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-clip bg-[var(--bg-card)] text-[var(--text-primary)]"
    >
      {/* ================================================================= */}
      {/* TOP FLOATING NAVBAR (Transparent Over Full-Bleed Hero)            */}
      {/* ================================================================= */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-[var(--border-subtle)]/70 bg-[var(--bg-card)]/90 shadow-xs backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <CareerkuLogo
              size="md"
              showWordmark
              className={!isScrolled ? '!text-[#181a1d]' : ''}
            />
          </button>

          <nav
            aria-label="Main navigation"
            className={`hidden items-center gap-7 text-[13px] font-medium transition-colors duration-300 md:flex ${
              isScrolled ? 'text-[var(--text-primary)]/85' : 'text-[#181a1d]/85'
            }`}
          >
            <a
              href="#about"
              className={isScrolled ? 'hover:text-[var(--text-primary)]' : 'hover:text-[#181a1d]'}
            >
              About
            </a>
            <a
              href="#features"
              className={isScrolled ? 'hover:text-[var(--text-primary)]' : 'hover:text-[#181a1d]'}
            >
              Features
            </a>
            <a
              href="#process"
              className={isScrolled ? 'hover:text-[var(--text-primary)]' : 'hover:text-[#181a1d]'}
            >
              How It Works
            </a>
            <a
              href="#voices"
              className={isScrolled ? 'hover:text-[var(--text-primary)]' : 'hover:text-[#181a1d]'}
            >
              Voices
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
                isScrolled
                  ? 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  : 'border-white/60 bg-white/90 text-[#181a1d] shadow-xs backdrop-blur-md hover:bg-white'
              }`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  : 'border-white/60 bg-white/85 text-[#181a1d] shadow-xs backdrop-blur-md hover:bg-white'
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => navigate('/discover')}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'careerku-btn-primary'
                  : 'bg-[#181a1d] text-white shadow-sm hover:bg-[#111316]'
              }`}
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div aria-hidden="true" className="h-[2px] w-full overflow-hidden">
          <div
            data-gsap="scroll-progress"
            className="h-full w-full origin-left scale-x-0 bg-[#1e5640] dark:bg-[#72c7a2]"
          />
        </div>
      </header>

      {/* ================================================================= */}
      {/* SECTION 1: Full-Bleed Edge-to-Edge Hero (Extends Behind Navbar)   */}
      {/* ================================================================= */}
      <section
        data-gsap="hero-section"
        className="relative flex h-screen min-h-[600px] max-h-[920px] w-full flex-col justify-between overflow-hidden pt-20 sm:pt-24"
      >
        <div data-gsap="hero-bg" className="pointer-events-none absolute inset-0">
          <img
            src="/images/hero-campus.jpg"
            alt="Undergraduate student in a sunlit modern campus courtyard"
            className="h-full w-full -scale-x-100 object-cover object-[center_20%]"
          />
        </div>

        {/* Top-Left: Follow Us & Crisp White Social Icon Circles */}
        <div className="relative z-10 px-6 pt-4 sm:px-10 sm:pt-6 lg:px-12">
          <p
            data-gsap="hero-social-label"
            className="mb-3 text-base font-semibold tracking-tight text-[#181a1d] sm:text-lg"
          >
            Follow us
          </p>
          <div className="flex items-center gap-2">
            <div data-gsap="hero-social-icon">
              <a
                href="#about"
                aria-label="Instagram"
                title="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#181a1d] shadow-sm transition-transform hover:scale-105"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4.5 w-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
            <div data-gsap="hero-social-icon">
              <a
                href="#about"
                aria-label="X"
                title="X"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#181a1d] shadow-sm transition-transform hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <div data-gsap="hero-social-icon">
              <a
                href="#process"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#181a1d] shadow-sm transition-transform hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
            <div data-gsap="hero-social-icon">
              <a
                href="#voices"
                aria-label="GitHub"
                title="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#181a1d] shadow-sm transition-transform hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom-Left: Bold Two-Line Headline + Concise Description */}
        <div
          data-gsap="hero-copy"
          className="relative z-10 max-w-xl px-6 pb-8 sm:px-10 sm:pb-12 lg:px-12 lg:pb-14"
        >
          <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-[#181a1d] sm:text-6xl lg:text-[72px]">
            <span className="block overflow-hidden">
              <span data-gsap="hero-line" className="block">
                Match Smarter.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-gsap="hero-line" className="block">
                Grow Faster.
              </span>
            </span>
          </h1>
          <p
            data-gsap="hero-desc"
            className="mt-4 max-w-md text-xs font-medium leading-relaxed text-[#181a1d]/80 sm:text-sm"
          >
            Careerku is an AI-powered career platform for undergraduate students that brings
            together internships, competitions, and scholarships with skill gap analysis and
            application tracking.
          </p>
        </div>
      </section>

      <main className="w-full px-4 pb-10 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* SECTION 2: Editorial Statement (Lumóra Two-Tone Typography)       */}
        {/* ================================================================= */}
        <section id="about" className="py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div data-gsap="about-eyebrow" className="lg:col-span-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                — About Careerku
              </span>
            </div>
            <div data-gsap="about-headline" className="lg:col-span-9">
              <h2 className="text-2xl font-medium leading-[1.3] tracking-tight text-[var(--text-primary)] sm:text-4xl">
                We believe career readiness isn’t built from scattered listings, but from clear
                direction.{' '}
                <span data-gsap="about-muted" className="text-[var(--text-muted)]">
                  Careerku brings internships, scholarships, and competitions into one place,
                  helping students understand requirements, close skill gaps, and apply with
                  confidence.
                </span>
              </h2>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3: 4-Column Interactive Color-Shifting Bento Cards        */}
        {/* ================================================================= */}
        <section id="features" className="pb-16 sm:pb-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: 3+ Categories -> Transforms to Deep Charcoal on Hover */}
            <div data-gsap="feature-card">
              <button
                type="button"
                onMouseEnter={() => setHoveredCard(0)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/discover')}
                className={`group relative flex min-h-[235px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[26px] border p-6 text-left transition-all duration-300 ease-out ${
                  hoveredCard === 0
                    ? '-translate-y-2 border-transparent bg-[#191b1e] text-white shadow-xl'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-2xs transition-all duration-300 ${
                        hoveredCard === 0
                          ? 'scale-110 bg-white/15 text-[#8cd4b5]'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)]'
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-2xs transition-all delay-75 duration-300 ${
                        hoveredCard === 0
                          ? '-translate-y-0.5 scale-110 bg-white/15 text-amber-300'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)]'
                      }`}
                    >
                      <Trophy className="h-4 w-4" />
                    </span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-2xs transition-all delay-100 duration-300 ${
                        hoveredCard === 0
                          ? 'scale-110 bg-white/15 text-emerald-300'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)]'
                      }`}
                    >
                      <Award className="h-4 w-4" />
                    </span>
                  </div>

                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                      hoveredCard === 0
                        ? 'translate-x-0 bg-white text-[#191b1e] opacity-100'
                        : '-translate-x-1 bg-[var(--bg-card)] text-[var(--text-muted)] opacity-0'
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div>
                  <p
                    className={`text-xs font-medium transition-colors duration-300 ${
                      hoveredCard === 0 ? 'text-white/70' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Opportunity Categories
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight">
                    <span data-gsap-count data-target="3" data-suffix="+">
                      3+
                    </span>
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p
                      className={`text-[11px] transition-colors duration-300 ${
                        hoveredCard === 0 ? 'text-white/75' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {hoveredCard === 0
                        ? 'Explore all listings'
                        : 'Internships, Competitions & Scholarships'}
                    </p>
                    {hoveredCard === 0 && (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#8cd4b5]" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Card 2: 7 Stages -> Same Clean Resting Surface, Shifts to Botanical Forest on Hover */}
            <div data-gsap="feature-card">
              <button
                type="button"
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/analyze')}
                className={`group relative flex min-h-[235px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[26px] border p-6 text-left transition-all duration-300 ease-out ${
                  hoveredCard === 1
                    ? '-translate-y-2 border-transparent bg-[#1e5640] text-white shadow-xl shadow-emerald-950/25'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium transition-colors duration-300 ${
                        hoveredCard === 1 ? 'text-white/75' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      Core User Flow
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight">
                      <span data-gsap-count data-target="7" data-suffix=" Stages">
                        7 Stages
                      </span>
                    </p>
                  </div>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                      hoveredCard === 1
                        ? 'rotate-12 scale-110 border-white/30 bg-white text-[#1e5640]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--accent-indigo)]'
                    }`}
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                  </span>
                </div>

                <div>
                  <p
                    className={`text-xs leading-relaxed transition-colors duration-300 ${
                      hoveredCard === 1 ? 'text-white/80' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Register, Discover, Match, Analyze, Improve, Apply, and Track in one seamless
                    flow.
                  </p>
                  <div
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-300 ${
                      hoveredCard === 1
                        ? 'translate-y-0 bg-white text-[#1e5640] opacity-100'
                        : 'translate-y-2 bg-[var(--bg-card)] text-[var(--text-primary)] opacity-0'
                    }`}
                  >
                    <span>Try AI Flow</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            </div>

            {/* Card 3: AI + OCR -> Transforms to Deep Olive-Charcoal on Hover */}
            <div data-gsap="feature-card">
              <button
                type="button"
                onMouseEnter={() => setHoveredCard(2)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/analyze')}
                className={`group relative flex min-h-[235px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[26px] border p-6 text-left transition-all duration-300 ease-out ${
                  hoveredCard === 2
                    ? '-translate-y-2 border-transparent bg-[#26332c] text-white shadow-xl shadow-black/25'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-xs leading-relaxed transition-colors duration-300 ${
                      hoveredCard === 2 ? 'text-white/80' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Digital poster extraction via OCR & LLM-powered internship skill gap analysis.
                  </p>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      hoveredCard === 2
                        ? 'bg-[#8cd4b5] text-[#18221d] opacity-100'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] opacity-0'
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p
                      className={`text-[11px] font-medium transition-colors duration-300 ${
                        hoveredCard === 2 ? 'text-white/65' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {hoveredCard === 2 ? 'Launch AI Skill Gap' : 'High-Match Demo'}
                    </p>
                    <p className="mt-0.5 text-3xl font-semibold tracking-tight">
                      {highMatchCount}/{opportunities.length}
                    </p>
                  </div>
                  <span
                    className={`rounded-2xl px-3 py-2 text-xs font-bold transition-all duration-300 ${
                      hoveredCard === 2
                        ? 'scale-105 bg-[#8cd4b5] text-[#18221d]'
                        : 'bg-[#dfece5] text-[#1e5640] dark:bg-[#72c7a2]/20 dark:text-[#8cd4b5]'
                    }`}
                  >
                    AI + OCR
                  </span>
                </div>
              </button>
            </div>

            {/* Card 4: Verified & Tracked -> Transforms to Deep Emerald on Hover */}
            <div data-gsap="feature-card">
              <button
                type="button"
                onMouseEnter={() => setHoveredCard(3)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/tracker')}
                className={`group relative flex min-h-[235px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[26px] border p-6 text-left transition-all duration-300 ease-out ${
                  hoveredCard === 3
                    ? '-translate-y-2 border-transparent bg-[#0d4a3a] text-white shadow-xl shadow-emerald-950/25'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium transition-colors duration-300 ${
                        hoveredCard === 3 ? 'text-emerald-200/85' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      Verified & Tracked
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight">
                      <span data-gsap-count data-target="100" data-suffix="%">
                        100%
                      </span>
                    </p>
                  </div>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                      hoveredCard === 3
                        ? 'bg-emerald-300 text-[#0d4a3a] opacity-100'
                        : 'bg-white/70 text-emerald-700 opacity-0'
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between text-xs font-medium transition-colors duration-300 ${
                    hoveredCard === 3 ? 'text-emerald-100' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span>
                    {hoveredCard === 3
                      ? 'Open Document Tracker'
                      : 'Official links & doc checklists'}
                  </span>
                  <ClipboardCheck
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                      hoveredCard === 3
                        ? 'scale-115 text-emerald-300'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 4: How It Works — Spintip Editorial Step-by-Step Bento    */}
        {/* ================================================================= */}
        <section
          id="process"
          className="border-t border-[var(--border-subtle)] py-16 sm:py-24"
        >
          {/* Top Bar: Dot + Pill ("How It Works") on Left, Bold Display Title on Right */}
          <div
            data-gsap="process-header"
            className="mb-10 flex flex-wrap items-center justify-between gap-6 sm:mb-14"
          >
            <div className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-9 w-9 rounded-full bg-[#191b1e] dark:bg-[#f1f2ea]"
              />
              <span className="inline-flex h-9 items-center rounded-full bg-[#191b1e] px-5 text-sm font-medium tracking-tight text-[#dfece5] dark:bg-[#f1f2ea] dark:text-[#181a18]">
                How It Works
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-none tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl lg:text-[56px]">
              What Is Careerku
            </h2>
          </div>

          {/* 5-Column × 2-Row Bento Grid */}
          <div data-gsap="process-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Row 1, Cols 1-2: Intro Copy + "How It Works — Step by Step" & Sleek Arrow */}
            <div
              data-gsap="process-row-1"
              className="flex flex-col justify-between py-2 sm:col-span-2 lg:col-span-2 lg:pr-6"
            >
              <p className="max-w-[390px] text-sm leading-[1.5] text-[var(--text-secondary)] sm:text-[15px]">
                <strong className="font-semibold text-[var(--text-primary)]">Careerku</strong> is
                an AI-powered platform for undergraduate students that combines verified
                opportunities, smart eligibility matching, and skill gap guidance to make career
                preparation clearer and measurable.
              </p>

              <div className="mt-10 flex items-end justify-between gap-4 lg:mt-0">
                <h3 className="text-3xl font-bold leading-[1.06] tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl lg:text-[42px]">
                  How It Works —
                  <br />
                  Step by Step
                </h3>

                <svg
                  data-gsap="process-arrow"
                  viewBox="0 0 64 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="mb-1 h-8 w-14 shrink-0 text-[var(--text-primary)] sm:h-9 sm:w-16"
                >
                  <path
                    d="M2 18H60M60 18L44 4M60 18L44 32"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Row 1, Col 3: Step 1 */}
            {renderProcessStepCard(PROCESS_STEPS[0], 'process-row-1')}

            {/* Row 1, Col 4: Step 2 */}
            {renderProcessStepCard(PROCESS_STEPS[1], 'process-row-1')}

            {/* Row 1, Col 5: Photo 1 */}
            {renderProcessPhotoCard(PROCESS_PHOTOS[0], 'process-row-1')}

            {/* Row 2, Col 1: Photo 2 */}
            {renderProcessPhotoCard(PROCESS_PHOTOS[1], 'process-row-2')}

            {/* Row 2, Col 2: Step 3 */}
            {renderProcessStepCard(PROCESS_STEPS[2], 'process-row-2')}

            {/* Row 2, Col 3: Step 4 */}
            {renderProcessStepCard(PROCESS_STEPS[3], 'process-row-2')}

            {/* Row 2, Col 4: Photo 3 */}
            {renderProcessPhotoCard(PROCESS_PHOTOS[2], 'process-row-2')}

            {/* Row 2, Col 5: Step 5 */}
            {renderProcessStepCard(PROCESS_STEPS[4], 'process-row-2')}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 5: Student Voices                                         */}
        {/* ================================================================= */}
        <section
          id="voices"
          className="border-t border-[var(--border-subtle)] py-16 sm:py-24"
        >
          <div
            data-gsap="voices-header"
            className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                — Student Voices
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Built for Real Undergraduate Workflows
              </h2>
            </div>
            <div>
              <p className="max-w-xs text-xs leading-relaxed text-[var(--text-secondary)]">
                Designed to cut search time, clarify eligibility, and guide pre-application
                readiness.
              </p>
            </div>
          </div>

          <div data-gsap="voices-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Active Demo Profile */}
            <div data-gsap="voice-card" className="flex">
              <div
                onMouseEnter={() => setHoveredVoice(0)}
                onMouseLeave={() => setHoveredVoice(null)}
                onClick={() => navigate('/discover')}
                className={`group flex w-full cursor-pointer flex-col justify-between rounded-[26px] border p-6 transition-all duration-300 ease-out ${
                  hoveredVoice === 0
                    ? '-translate-y-2 border-transparent bg-[#191b1e] text-white shadow-xl'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-medium transition-colors duration-300 ${
                        hoveredVoice === 0 ? 'text-white/70' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      Active Demo Profile
                    </span>
                    <CheckCircle2
                      className={`h-4.5 w-4.5 transition-transform duration-300 ${
                        hoveredVoice === 0 ? 'scale-110 text-emerald-400' : 'text-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">
                    {profile.gpa.toFixed(2)}
                    <span
                      className={`text-base font-normal transition-colors duration-300 ${
                        hoveredVoice === 0 ? 'text-white/50' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {' '}
                      /4.0
                    </span>
                  </p>
                  <p
                    className={`mt-2 text-xs leading-relaxed transition-colors duration-300 ${
                      hoveredVoice === 0 ? 'text-white/75' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Try live matching with{' '}
                    <strong
                      className={hoveredVoice === 0 ? 'text-white' : 'text-[var(--text-primary)]'}
                    >
                      {profile.name}
                    </strong>{' '}
                    ({profile.major}, Semester {profile.semester}) or customize with your own
                    profile.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/discover')
                  }}
                  className={`mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    hoveredVoice === 0 ? 'bg-white text-[#191b1e]' : 'careerku-btn-primary'
                  }`}
                >
                  <span>Open Careerku Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Cards 2–4: Interactive Color-Shifting Student Voice Cards */}
            {STUDENT_VOICES.map((voice, idx) => {
              const voiceIndex = idx + 1
              const isHovered = hoveredVoice === voiceIndex

              return (
                <div key={voice.name} data-gsap="voice-card" className="flex">
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredVoice(voiceIndex)}
                    onMouseLeave={() => setHoveredVoice(null)}
                    onClick={() => navigate(voice.to)}
                    className={`group flex w-full cursor-pointer flex-col justify-between rounded-[26px] border p-6 text-left transition-all duration-300 ease-out ${
                      isHovered
                        ? voice.hoverBgClass
                        : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors duration-300 ${
                            isHovered
                              ? voice.hoverBadgeClass
                              : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {voice.tag}
                        </span>

                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                            isHovered
                              ? 'translate-x-0 bg-white/15 text-white opacity-100'
                              : '-translate-x-1 opacity-0'
                          }`}
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <p
                        className={`mt-4 text-xs leading-relaxed transition-colors duration-300 sm:text-[13px] ${
                          isHovered ? 'text-white/95' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        “{voice.quote}”
                      </p>
                    </div>

                    <div
                      className={`mt-6 flex items-center justify-between border-t pt-3.5 transition-colors duration-300 ${
                        isHovered ? 'border-white/15' : 'border-[var(--border-subtle)]'
                      }`}
                    >
                      <div>
                        <p
                          className={`text-xs font-bold transition-colors duration-300 ${
                            isHovered ? 'text-white' : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {voice.name}
                        </p>
                        <p
                          className={`text-[11px] transition-colors duration-300 ${
                            isHovered ? 'text-white/70' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {voice.role}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-all duration-300 ${
                          isHovered
                            ? 'translate-x-0 text-white opacity-100'
                            : '-translate-x-1 opacity-0'
                        }`}
                      >
                        <span>{voice.actionLabel}</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* SECTION 6: Full-Bleed Dark Footer                                 */}
      {/* ================================================================= */}
      <footer
        data-gsap="footer"
        className="w-full bg-[#16181b] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-12"
      >
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <CareerkuLogo size="lg" inverted />
            <span className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Careerku
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#16181b] hover:bg-neutral-100"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="cursor-pointer rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-8 text-xs sm:grid-cols-12">
          <div className="sm:col-span-5">
            <p className="max-w-xs leading-relaxed text-white/65">
              Undergraduate career discovery & AI skill gap platform — Smarter Campus and
              Learning by Team Techtoch.
            </p>
            <p className="mt-4 font-semibold text-white/90">Careerku • 2026</p>
          </div>

          <div className="space-y-2 sm:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
              Navigation
            </p>
            <ul className="space-y-1.5 text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="cursor-pointer hover:text-white"
                >
                  Opportunities (Discover)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="cursor-pointer hover:text-white"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/analyze')}
                  className="cursor-pointer hover:text-white"
                >
                  AI Internship Analysis
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/tracker')}
                  className="cursor-pointer hover:text-white"
                >
                  Tracker & Docs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer hover:text-white"
                >
                  Student Profile
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 sm:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
              Core Capabilities
            </p>
            <ul className="space-y-1.5 text-white/75">
              <li>Rule-Based GPA, Semester & Major Matching</li>
              <li>AI Skill Gap Evaluation & Portfolio Ideas</li>
              <li>Document Checklists (CV & Motivation Letter)</li>
              <li>Official Source Link & Verification Timestamp</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
