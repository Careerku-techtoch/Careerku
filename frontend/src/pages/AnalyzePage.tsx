import { useLayoutEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FolderGit2,
  Lightbulb,
  Plus,
  Sparkles,
} from 'lucide-react'
import {
  CareerkuMatchGauge,
  HighMatchGlyph,
  MatchIndexGlyph,
  PortfolioSprintGlyph,
  SkillGapGlyph,
} from '@/components'
import { useCareerku } from '@/hooks'
import { formatDateID } from '@/utils'

gsap.registerPlugin(ScrollTrigger)

function getBarToneClass(value: number): string {
  if (value >= 75) return 'bg-[var(--status-success)]'
  if (value >= 55) return 'bg-[var(--status-warning)]'
  return 'bg-[var(--status-danger)]'
}

export function AnalyzePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    opportunities,
    addSkill,
    getTrackedByOpportunityId,
    trackOpportunity,
    openOpportunityDetail,
  } = useCareerku()

  const internships = useMemo(
    () =>
      opportunities
        .filter((opp) => opp.category === 'internship')
        .sort((a, b) => b.match.score - a.match.score),
    [opportunities],
  )

  const requestedId = searchParams.get('opportunity')
  const activeInternship =
    internships.find((item) => item.id === requestedId) ?? internships[0] ?? null

  const sectionRef = useRef<HTMLElement | null>(null)
  const prevRoleIdRef = useRef<string | null>(activeInternship?.id ?? null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return

    const mm = gsap.matchMedia()
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-anim="header"]', {
          y: 16,
          opacity: 0,
          duration: 0.45,
          clearProps: 'transform',
        })
          .from(
            '[data-anim="kpi-card"]',
            {
              y: 20,
              opacity: 0,
              scale: 0.98,
              duration: 0.48,
              stagger: 0.06,
              clearProps: 'transform',
            },
            '-=0.28',
          )
          .from(
            '[data-anim="tech-bar"]',
            {
              scaleX: 0,
              duration: 0.65,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.25',
          )
          .from(
            '[data-anim="selector-panel"]',
            {
              y: 22,
              opacity: 0,
              duration: 0.5,
              clearProps: 'transform',
            },
            '-=0.35',
          )
          .from(
            '[data-anim="selector-item"]',
            {
              y: 14,
              opacity: 0,
              duration: 0.4,
              stagger: 0.06,
              clearProps: 'transform',
            },
            '-=0.3',
          )
          .from(
            '[data-anim="analysis-panel"]',
            {
              y: 22,
              opacity: 0,
              duration: 0.5,
              stagger: 0.08,
              clearProps: 'transform',
            },
            '-=0.4',
          )
          .from(
            '[data-anim="readiness-bar"]',
            {
              scaleX: 0,
              duration: 0.7,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.3',
          )

        gsap.utils.toArray<HTMLElement>('[data-anim="lower-panel"]').forEach((el) => {
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 0.52,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
      },
      sectionRef,
    )
    return () => mm.revert()
  }, [])

  const activeInternshipId = activeInternship?.id ?? null
  useLayoutEffect(() => {
    if (!activeInternshipId || !sectionRef.current) return
    if (prevRoleIdRef.current === activeInternshipId) return
    prevRoleIdRef.current = activeInternshipId

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const panels = sectionRef.current.querySelectorAll(
      '[data-anim="analysis-panel"], [data-anim="lower-panel"]',
    )
    if (panels.length > 0) {
      gsap.fromTo(
        panels,
        { y: 12, opacity: 0.3 },
        {
          y: 0,
          opacity: 1,
          duration: 0.34,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform',
          overwrite: 'auto',
        },
      )
    }

    const bars = sectionRef.current.querySelectorAll(
      '[data-anim="readiness-bar"], [data-anim="tech-bar"]',
    )
    if (bars.length > 0) {
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'transform',
          overwrite: 'auto',
        },
      )
    }
  }, [activeInternshipId])

  if (!activeInternship) return null

  const aiMeta = activeInternship.aiImprovementMeta
  const isTracked = Boolean(getTrackedByOpportunityId(activeInternship.id))
  const matchedCount = activeInternship.match.matchedSkills.length
  const missingCount = activeInternship.match.missingSkills.length
  const totalTech = activeInternship.requirements.technicalSkills.length
  const techPct = totalTech > 0 ? Math.round((matchedCount / totalTech) * 100) : 100
  const ideaCount = aiMeta?.portfolioIdeas.length ?? 0

  const handleStartPrep = () => {
    if (!isTracked) {
      trackOpportunity(activeInternship.id, 'preparing')
    }
    navigate(`/tracker?opportunity=${activeInternship.id}`)
  }

  return (
    <section ref={sectionRef} className="space-y-6 pb-6 pt-2">
      {/* =================================================================== */}
      {/* 1. CLEAN PAGE HEADER + PRIMARY CTA                                  */}
      {/* =================================================================== */}
      <div
        data-anim="header"
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            AI Skill Gap Analysis
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-secondary)]">
            <Sparkles className="h-4 w-4 shrink-0 text-[var(--accent-indigo)]" />
            <span>
              Deep technical gap evaluation and portfolio sprint plans focused on internships.
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartPrep}
            className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>{isTracked ? 'Open in Tracker' : 'Start Prep & Track'}</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. 4 SCANNABLE KPI SUMMARY CARDS (ACTIVE INTERNSHIP)                */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() => openOpportunityDetail(activeInternship.id)}
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Role Match Score
              </span>
              <MatchIndexGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {activeInternship.match.score}%
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {activeInternship.match.tierLabel} readiness • {activeInternship.organization}
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() =>
              document.getElementById('skill-gaps')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Technical Skills
              </span>
              <HighMatchGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                  {matchedCount}/{totalTech}
                </p>
                <span className="rounded-full bg-[var(--accent-indigo-soft)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent-indigo)]">
                  {techPct}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                <div
                  data-anim="tech-bar"
                  className="h-full origin-left rounded-full bg-[var(--accent-indigo)] transition-all duration-500"
                  style={{ width: `${techPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">Core stack alignment</p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() =>
              document.getElementById('skill-gaps')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Detected Skill Gaps
              </span>
              <SkillGapGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {missingCount}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {missingCount === 0
                  ? 'All core skills matched'
                  : 'Click any gap chip to add to profile'}
              </p>
            </div>
          </button>
        </div>

        <div data-anim="kpi-card" className="h-full">
          <button
            type="button"
            onClick={() =>
              document.getElementById('portfolio-sprints')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="careerku-card group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl p-5 text-left transition-all hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Portfolio Sprints
              </span>
              <PortfolioSprintGlyph className="h-6 w-6 shrink-0 text-[var(--text-primary)] transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {ideaCount}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Due {formatDateID(activeInternship.deadline)}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. SPLIT WORKSPACE: SELECTOR (4 COLS) + ANALYSIS PANELS (8 COLS)    */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left Column: Internship Selector */}
        <div
          data-anim="selector-panel"
          className="careerku-card h-fit rounded-3xl p-5 sm:p-6 xl:col-span-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Select Internship
              </h2>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                Pick an internship to inspect gaps and sprint plans
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--bg-sheet)] px-3 py-1 text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
              {internships.length} roles
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {internships.map((item) => {
              const selected = item.id === activeInternship.id
              return (
                <div key={item.id} data-anim="selector-item">
                  <button
                    type="button"
                    onClick={() => setSearchParams({ opportunity: item.id })}
                    className={`w-full cursor-pointer overflow-hidden rounded-2xl border text-left transition-all ${
                      selected
                        ? 'border-[#191b1e] bg-[var(--bg-card)] shadow-sm dark:border-[#f1f2ea]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="h-[3px] w-full bg-[var(--cat-internship)]" />
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: item.orgAccent }}
                          >
                            {item.orgInitials}
                          </span>
                          <span className="truncate text-xs font-semibold text-[var(--text-secondary)]">
                            {item.organization}
                          </span>
                        </div>
                        <CareerkuMatchGauge
                          score={item.match.score}
                          size="sm"
                          className="shrink-0"
                        />
                      </div>

                      <p className="mt-2.5 line-clamp-2 text-sm font-bold leading-snug text-[var(--text-primary)]">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                        {item.match.missingSkills.length === 0
                          ? 'All core technical skills met'
                          : `${item.match.missingSkills.length} skill gap(s) detected`}{' '}
                        • Due {formatDateID(item.deadline)}
                      </p>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Analysis Panels */}
        <div className="space-y-5 xl:col-span-8">
          {/* Active Role & Eligibility Card */}
          <div data-anim="analysis-panel" className="careerku-card rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ backgroundColor: activeInternship.orgAccent }}
                >
                  {activeInternship.orgInitials}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    {activeInternship.organization} • {activeInternship.location} •{' '}
                    {activeInternship.workMode}
                  </p>
                  <h2 className="mt-0.5 text-lg font-bold text-[var(--text-primary)] sm:text-xl">
                    {activeInternship.title}
                  </h2>
                </div>
              </div>

              <CareerkuMatchGauge
                score={activeInternship.match.score}
                size="lg"
                className="shrink-0"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">
                  Readiness & Qualification Score
                </span>
                <span className="font-bold tabular-nums text-[var(--text-primary)]">
                  {activeInternship.match.score}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-card)]">
                <div
                  data-anim="readiness-bar"
                  className={`h-full origin-left rounded-full transition-all duration-500 ${getBarToneClass(activeInternship.match.score)}`}
                  style={{ width: `${activeInternship.match.score}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                {aiMeta?.adviceSummary ?? activeInternship.match.readinessSummary}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {activeInternship.match.ruleChecks.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-start gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-3.5"
                >
                  {rule.met ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-success)]" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-danger)]" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs text-[var(--text-secondary)]">{rule.label}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                      {rule.actual} / {rule.required}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
              <span className="text-xs text-[var(--text-secondary)]">
                Deadline{' '}
                <strong className="text-[var(--text-primary)]">
                  {formatDateID(activeInternship.deadline)}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => openOpportunityDetail(activeInternship.id)}
                className="careerku-btn-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
              >
                <span>View Full Requirements</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Skills Comparison Row */}
          <div
            id="skill-gaps"
            data-anim="analysis-panel"
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div className="careerku-card rounded-3xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--status-success)]" />
                  <span>Matched Skills</span>
                </h3>
                <span className="rounded-full bg-[var(--status-success-soft)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[var(--status-success-text)]">
                  {matchedCount}
                </span>
              </div>
              {matchedCount === 0 ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  No core technical skills matched with your current profile yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {activeInternship.match.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--status-success-border)] bg-[var(--status-success-soft)] px-3 py-1 text-xs font-semibold text-[var(--status-success-text)]"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="careerku-card rounded-3xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                  <AlertCircle className="h-4 w-4 text-[var(--status-danger)]" />
                  <span>Detected Skill Gaps</span>
                </h3>
                <span className="rounded-full bg-[var(--status-danger-soft)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[var(--status-danger-text)]">
                  {missingCount}
                </span>
              </div>
              {missingCount === 0 ? (
                <p className="text-xs font-medium text-[var(--status-success-text)]">
                  Great job! No core technical skill gaps detected for this internship.
                </p>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-2">
                    {activeInternship.match.missingSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        title="Click if you already have this skill to add it to your profile"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--status-danger-border)] bg-[var(--status-danger-soft)] px-3 py-1 text-xs font-semibold text-[var(--status-danger-text)] transition-opacity hover:opacity-85"
                      >
                        <span>{skill}</span>
                        <Plus className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    Tip: Click <strong className="text-[var(--text-primary)]">+</strong> if you
                    already know a skill to add it to your profile and recalculate live.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Priority Learning Steps & Portfolio Sprints */}
          {aiMeta && (
            <>
              <div data-anim="lower-panel" className="careerku-card rounded-3xl p-5 sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                  <BookOpen className="h-4 w-4 text-[var(--accent-indigo)]" />
                  <span>Priority Learning Steps</span>
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {aiMeta.prioritySkills.map((rec) => (
                    <div
                      key={rec.skill}
                      className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4"
                    >
                      <p className="text-sm font-bold text-[var(--text-primary)]">{rec.skill}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {rec.reason}
                      </p>
                      <p className="mt-2.5 flex items-start gap-1.5 text-xs font-medium text-[var(--accent-indigo)]">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{rec.resourceHint}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                id="portfolio-sprints"
                data-anim="lower-panel"
                className="careerku-card rounded-3xl p-5 sm:p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                  <FolderGit2 className="h-4 w-4 text-[var(--accent-indigo)]" />
                  <span>Recommended Portfolio Sprints</span>
                </h3>
                <div className="space-y-3">
                  {aiMeta.portfolioIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4 sm:p-5"
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                          {idea.title}
                        </h4>
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                          Est. {idea.estimatedDuration}
                        </span>
                      </div>
                      <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {idea.description}
                      </p>
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {idea.targetSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[var(--accent-indigo-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent-indigo)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        <strong className="text-[var(--text-primary)]">Deliverable:</strong>{' '}
                        {idea.deliverable}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
