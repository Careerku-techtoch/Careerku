import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { MatchBadge } from '@/components'
import { useCareerku } from '@/hooks'
import { formatDateID, getDaysUntilDeadline } from '@/utils'

export function DashboardPage() {
  const navigate = useNavigate()
  const { profile, opportunities, trackedApplications, openOpportunityDetail } = useCareerku()

  const highMatches = opportunities
    .filter((o) => o.match.tier === 'high')
    .sort((a, b) => b.match.score - a.match.score)

  const avgScore = Math.round(
    opportunities.reduce((sum, item) => sum + item.match.score, 0) /
      Math.max(1, opportunities.length),
  )

  const urgentDeadlines = opportunities
    .filter((o) => getDaysUntilDeadline(o.deadline) <= 14)
    .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline))

  const topInternships = opportunities
    .filter((o) => o.category === 'internship')
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3)

  const pendingDocuments = trackedApplications.flatMap((app) => {
    const opp = opportunities.find((o) => o.id === app.opportunityId)
    if (!opp) return []
    return app.documents
      .filter((d) => !d.completed)
      .map((doc) => ({
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        organization: opp.organization,
        docLabel: doc.label,
        deadline: opp.deadline,
      }))
  })

  return (
    <section className="space-y-5">
      {/* Greeting & Quick Actions */}
      <div className="careerku-sheet flex flex-col justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-semibold text-[var(--accent-indigo)]">
            {profile.university} • {profile.major}
          </p>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            Hello, {profile.name.split(' ')[0]}! Ready to explore opportunities this week?
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            You have <strong>{highMatches.length} high-match opportunities</strong> and{' '}
            <strong>{pendingDocuments.length} pending document(s)</strong> to wrap up.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="careerku-btn-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Explore Opportunities</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/analyze')}
            className="careerku-btn-secondary inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
            <span>Check AI Skill Gaps</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="careerku-card rounded-2xl p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">High Matches</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{highMatches.length}</p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            Out of {opportunities.length} listings
          </p>
        </div>

        <div className="careerku-card rounded-2xl p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Average Match</span>
            <Sparkles className="h-4 w-4 text-[var(--accent-indigo)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{avgScore}%</p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            GPA {profile.gpa.toFixed(2)} • {profile.skills.length} skills
          </p>
        </div>

        <div className="careerku-card rounded-2xl p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Tracked</span>
            <ClipboardCheck className="h-4 w-4 text-[var(--text-primary)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {trackedApplications.length}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">Active in Tracker</p>
        </div>

        <div className="careerku-card rounded-2xl p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Due &le; 14 Days</span>
            <CalendarClock className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{urgentDeadlines.length}</p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">Review soon</p>
        </div>
      </div>

      {/* Bottom 2-Column Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="careerku-sheet rounded-3xl p-5 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Top Recommended Internships
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Includes AI skill gap detection and portfolio project ideas
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/analyze')}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[var(--accent-indigo)] hover:underline"
            >
              <span>All Analyses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topInternships.map((opp) => (
              <div
                key={opp.id}
                className="careerku-card flex flex-col justify-between gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: opp.orgAccent }}
                  >
                    {opp.orgInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                      {opp.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {opp.organization} • Due {formatDateID(opp.deadline)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <MatchBadge match={opp.match} />
                  <button
                    type="button"
                    onClick={() => openOpportunityDetail(opp.id)}
                    className="careerku-btn-secondary cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="careerku-sheet rounded-3xl p-5 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Document Prep Action Items
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Priority checklists from your saved opportunities
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tracker')}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[var(--accent-indigo)] hover:underline"
            >
              <span>Open Tracker</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {pendingDocuments.length === 0 ? (
            <div className="careerku-card flex flex-col items-center justify-center rounded-2xl p-8 text-center">
              <CheckCircle2 className="mb-2 h-6 w-6 text-emerald-500" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                All document checklists are complete!
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {pendingDocuments.slice(0, 5).map((item) => (
                <li key={`${item.opportunityId}-${item.docLabel}`}>
                  <button
                    type="button"
                    onClick={() => navigate(`/tracker?opportunity=${item.opportunityId}`)}
                    className="careerku-card flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left hover:border-[var(--border-strong)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--text-primary)]">
                        {item.docLabel}
                      </p>
                      <p className="truncate text-[11px] text-[var(--text-secondary)]">
                        {item.organization} — {item.opportunityTitle}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--bg-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                      D-{Math.max(0, getDaysUntilDeadline(item.deadline))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
