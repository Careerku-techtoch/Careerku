import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  FolderGit2,
  Lightbulb,
  Plus,
  Sparkles,
} from 'lucide-react'
import { MatchBadge } from '@/components'
import { useCareerku } from '@/hooks'
import { formatDateID } from '@/utils'

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

  if (!activeInternship) return null

  const aiMeta = activeInternship.aiImprovementMeta
  const isTracked = Boolean(getTrackedByOpportunityId(activeInternship.id))

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-xs">
        <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <p>
            <strong className="text-[var(--text-primary)]">AI Analysis Focus:</strong> In-depth{' '}
            <em>skill gap</em> evaluation and portfolio project recommendations focus on{' '}
            <strong className="text-[var(--text-primary)]">Internships</strong>. Competitions &
            Scholarships focus on search, basic matching, and document checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left Column: Internship Selector */}
        <div className="careerku-sheet rounded-3xl p-4 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Select Internship ({internships.length})
            </h2>
            <Briefcase className="h-4 w-4 text-[var(--text-muted)]" />
          </div>

          <div className="space-y-2.5">
            {internships.map((item) => {
              const selected = item.id === activeInternship.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSearchParams({ opportunity: item.id })}
                  className={`w-full cursor-pointer rounded-2xl border p-4 text-left ${
                    selected
                      ? 'border-[var(--btn-primary-bg)] bg-[var(--bg-card)] shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)]/70 hover:bg-[var(--bg-card)]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
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
                    <MatchBadge match={item.match} />
                  </div>

                  <p className="mb-1 text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {item.match.missingSkills.length === 0
                      ? 'All core technical skills met'
                      : `${item.match.missingSkills.length} skill gap(s) detected`}{' '}
                    • Due {formatDateID(item.deadline)}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: AI Skill Gap & Improve Panel */}
        <div className="careerku-sheet space-y-5 rounded-3xl p-5 sm:p-6 xl:col-span-8">
          <div className="careerku-card rounded-2xl p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ backgroundColor: activeInternship.orgAccent }}
                >
                  {activeInternship.orgInitials}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    {activeInternship.organization} • {activeInternship.location}
                  </p>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {activeInternship.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MatchBadge match={activeInternship.match} showPercentage />
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-[var(--bg-subtle)] p-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">
                  Readiness & Qualification Suitability Score
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {activeInternship.match.score}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-card)]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    activeInternship.match.tier === 'high'
                      ? 'bg-emerald-500'
                      : activeInternship.match.tier === 'medium'
                        ? 'bg-indigo-500'
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${activeInternship.match.score}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                {aiMeta?.adviceSummary ?? activeInternship.match.readinessSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {activeInternship.match.ruleChecks.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5"
                >
                  {rule.met ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[11px] text-[var(--text-muted)]">{rule.label}</p>
                    <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                      {rule.actual} / {rule.required}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="careerku-card rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Matched Skills
                </h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {activeInternship.match.matchedSkills.length}
                </span>
              </div>
              {activeInternship.match.matchedSkills.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">
                  No core technical skills matched with your current profile yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {activeInternship.match.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="careerku-card rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                  Detected Skill Gaps
                </h3>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                  {activeInternship.match.missingSkills.length}
                </span>
              </div>
              {activeInternship.match.missingSkills.length === 0 ? (
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Great job! No core technical skill gaps detected for this internship.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {activeInternship.match.missingSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        title="Click if you already have this skill to add it to your profile"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300"
                      >
                        <span>{skill}</span>
                        <Plus className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Tip: Click <strong className="text-[var(--text-primary)]">+</strong> if you
                    already know a skill to add it to your profile and recalculate live.
                  </p>
                </div>
              )}
            </div>
          </div>

          {aiMeta && (
            <div className="space-y-4">
              <div className="careerku-card rounded-2xl p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                  <BookOpen className="h-4 w-4 text-[var(--accent-indigo)]" />
                  Self-Development Steps (Improve)
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {aiMeta.prioritySkills.map((rec) => (
                    <div key={rec.skill} className="careerku-subtle rounded-xl p-3.5">
                      <p className="mb-1 text-xs font-bold text-[var(--text-primary)]">
                        {rec.skill}
                      </p>
                      <p className="mb-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {rec.reason}
                      </p>
                      <p className="flex items-start gap-1.5 text-[11px] font-medium text-[var(--accent-indigo)]">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{rec.resourceHint}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="careerku-card rounded-2xl p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                  <FolderGit2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Recommended Portfolio Project Ideas
                </h3>
                <div className="space-y-3">
                  {aiMeta.portfolioIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4"
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                          {idea.title}
                        </h4>
                        <span className="rounded-full bg-[var(--bg-card)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                          Est. {idea.estimatedDuration}
                        </span>
                      </div>
                      <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {idea.description}
                      </p>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {idea.targetSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[var(--accent-indigo-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-indigo)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        <strong className="text-[var(--text-primary)]">Deliverable:</strong>{' '}
                        {idea.deliverable}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => openOpportunityDetail(activeInternship.id)}
              className="careerku-btn-secondary cursor-pointer rounded-full px-4 py-2.5 text-xs font-semibold"
            >
              View Full Requirements
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isTracked) {
                  trackOpportunity(activeInternship.id, 'preparing')
                }
                navigate(`/tracker?opportunity=${activeInternship.id}`)
              }}
              className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>{isTracked ? 'Open Document Prep' : 'Start Prep & Track'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
