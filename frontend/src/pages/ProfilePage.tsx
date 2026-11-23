import { useState, type FormEvent } from 'react'
import {
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { useCareerku } from '@/hooks'
import { SUGGESTED_SKILLS } from '@/services'

export function ProfilePage() {
  const {
    profile,
    opportunities,
    updateProfile,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
  } = useCareerku()

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [university, setUniversity] = useState(profile.university)
  const [major, setMajor] = useState(profile.major)
  const [semester, setSemester] = useState(String(profile.semester))
  const [gpa, setGpa] = useState(String(profile.gpa))

  const [newSkill, setNewSkill] = useState('')
  const [expRole, setExpRole] = useState('')
  const [expOrg, setExpOrg] = useState('')
  const [expPeriod, setExpPeriod] = useState('')
  const [expSummary, setExpSummary] = useState('')

  const highMatchCount = opportunities.filter((o) => o.match.tier === 'high').length
  const avgMatchScore = Math.round(
    opportunities.reduce((sum, item) => sum + item.match.score, 0) /
      Math.max(1, opportunities.length),
  )

  const handleSaveAcademic = (event: FormEvent) => {
    event.preventDefault()
    const parsedSemester = Math.max(1, Math.min(14, Number(semester) || 1))
    const parsedGpa = Math.max(0, Math.min(4, Number(gpa) || 0))

    updateProfile({
      name: name.trim() || profile.name,
      email: email.trim() || profile.email,
      university: university.trim() || profile.university,
      major: major.trim() || profile.major,
      semester: parsedSemester,
      gpa: Number(parsedGpa.toFixed(2)),
    })
  }

  const handleAddSkillSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!newSkill.trim()) return
    addSkill(newSkill)
    setNewSkill('')
  }

  const handleAddExperienceSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!expRole.trim() || !expOrg.trim()) return
    addExperience({
      role: expRole.trim(),
      organization: expOrg.trim(),
      period: expPeriod.trim() || '2026',
      summary: expSummary.trim() || 'Active contributor across team projects and initiatives.',
    })
    setExpRole('')
    setExpOrg('')
    setExpPeriod('')
    setExpSummary('')
  }

  const availableSuggestions = SUGGESTED_SKILLS.filter(
    (skill) => !profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase()),
  )

  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      {/* Main Form Column */}
      <div className="space-y-5 xl:col-span-8">
        <form onSubmit={handleSaveAcademic} className="careerku-sheet rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  Academic Profile (Register)
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Used by rule-based matching to verify GPA, active semester, and major eligibility
                </p>
              </div>
            </div>
          </div>

          <div className="careerku-card grid grid-cols-1 gap-4 rounded-2xl p-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                University / Personal Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                Major / Study Program
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                Active Semester (1–14)
              </label>
              <input
                type="number"
                min={1}
                max={14}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                GPA (4.00 Scale)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={4}
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="flex justify-end sm:col-span-2">
              <button
                type="submit"
                className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save & Recalculate Match</span>
              </button>
            </div>
          </div>
        </form>

        {/* Skills Management */}
        <div className="careerku-sheet rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Skills & Competencies ({profile.skills.length})
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Add technical and soft skills for automatic match scoring and AI skill gap detection
              </p>
            </div>
          </div>

          <div className="careerku-card space-y-4 rounded-2xl p-5">
            <form onSubmit={handleAddSkillSubmit} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., Python, Docker, Figma)..."
                className="flex-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-4 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
              />
              <button
                type="submit"
                className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-1 pl-3 pr-2 text-xs font-semibold text-[var(--text-primary)]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {availableSuggestions.length > 0 && (
              <div className="border-t border-[var(--border-subtle)] pt-3">
                <p className="mb-2 text-[11px] font-semibold text-[var(--text-muted)]">
                  Quick-add popular skills:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availableSuggestions.slice(0, 10).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-[var(--border-strong)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Experiences */}
        <div className="careerku-sheet rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-primary)]">
              <Briefcase className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Organizations & Project Experience
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Powers tailored CV highlights and motivation letter suggestions
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {profile.experiences.map((exp) => (
              <div
                key={exp.id}
                className="careerku-card flex items-start justify-between gap-3 rounded-2xl p-4"
              >
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{exp.role}</p>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    {exp.organization} • {exp.period}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{exp.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  aria-label="Remove experience"
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <form
              onSubmit={handleAddExperienceSubmit}
              className="careerku-card grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-3"
            >
              <input
                type="text"
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                placeholder="Role (e.g. Frontend Lead)"
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
              />
              <input
                type="text"
                value={expOrg}
                onChange={(e) => setExpOrg(e.target.value)}
                placeholder="Organization / Project"
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
              />
              <input
                type="text"
                value={expPeriod}
                onChange={(e) => setExpPeriod(e.target.value)}
                placeholder="Period (e.g. 2025–2026)"
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
              />
              <input
                type="text"
                value={expSummary}
                onChange={(e) => setExpSummary(e.target.value)}
                placeholder="Key contributions and measurable impact..."
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none sm:col-span-2"
              />
              <button
                type="submit"
                className="careerku-btn-secondary inline-flex cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Experience</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Summary Column */}
      <div className="space-y-4 xl:col-span-4">
        <div className="careerku-sheet sticky top-5 rounded-3xl p-5">
          <h3 className="mb-3 text-sm font-bold text-[var(--text-primary)]">
            Live Matching Impact
          </h3>

          <div className="space-y-3">
            <div className="careerku-card rounded-2xl p-4">
              <p className="text-xs text-[var(--text-muted)]">Average Match Score</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                {avgMatchScore}%
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                Across {opportunities.length} indexed opportunities
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="careerku-card rounded-2xl p-4">
                <p className="text-[11px] text-[var(--text-muted)]">High Match</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {highMatchCount}
                </p>
              </div>
              <div className="careerku-card rounded-2xl p-4">
                <p className="text-[11px] text-[var(--text-muted)]">Total Skills</p>
                <p className="mt-1 text-2xl font-bold text-[var(--accent-indigo)]">
                  {profile.skills.length}
                </p>
              </div>
            </div>

            <div className="careerku-card rounded-2xl p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
              <p className="mb-1 font-bold text-[var(--text-primary)]">Try Updating Your Skills</p>
              <p>
                Add skills like <strong>Python</strong>, <strong>Docker</strong>, or{' '}
                <strong>Figma</strong> on the left — every Match Score across Opportunities and AI
                Analysis updates immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
