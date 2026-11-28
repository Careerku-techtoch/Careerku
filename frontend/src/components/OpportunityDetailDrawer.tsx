import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useCareerku } from '@/hooks'
import {
  formatDateID,
  formatVerifiedTimestamp,
  getCategoryLabel,
  getDaysUntilDeadline,
} from '@/utils'
import { MatchBadge } from './MatchBadge'

export function OpportunityDetailDrawer() {
  const navigate = useNavigate()
  const {
    selectedOpportunity,
    closeOpportunityDetail,
    getTrackedByOpportunityId,
    trackOpportunity,
    untrackOpportunity,
  } = useCareerku()

  if (!selectedOpportunity) return null

  const tracked = getTrackedByOpportunityId(selectedOpportunity.id)
  const daysLeft = getDaysUntilDeadline(selectedOpportunity.deadline)

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
      onClick={closeOpportunityDetail}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedOpportunity.title}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col bg-[var(--bg-card)] shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: selectedOpportunity.orgAccent }}
            >
              {selectedOpportunity.orgInitials}
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {selectedOpportunity.organization}
                </span>
                <span className="rounded-full bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
                  {getCategoryLabel(selectedOpportunity.category)}
                </span>
              </div>
              <h2 className="text-lg font-bold leading-snug text-[var(--text-primary)]">
                {selectedOpportunity.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeOpportunityDetail}
            aria-label="Close details"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Match Score + Summary Banner */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Profile Match Evaluation
              </span>
              <MatchBadge match={selectedOpportunity.match} showPercentage />
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {selectedOpportunity.match.readinessSummary}
            </p>
          </div>

          {/* Core Metadata Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="careerku-subtle rounded-xl p-3">
              <span className="mb-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                <Calendar className="h-3.5 w-3.5" />
                Application Deadline
              </span>
              <p className="text-xs font-bold text-[var(--text-primary)]">
                {formatDateID(selectedOpportunity.deadline)} ({Math.max(0, daysLeft)}d left)
              </p>
            </div>
            <div className="careerku-subtle rounded-xl p-3">
              <span className="mb-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                <MapPin className="h-3.5 w-3.5" />
                Location & Mode
              </span>
              <p className="text-xs font-bold text-[var(--text-primary)]">
                {selectedOpportunity.location} • {selectedOpportunity.workMode}
              </p>
            </div>
          </div>

          {/* Official Source & Verification Timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--status-success-border)] bg-[var(--status-success-soft)] px-3.5 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-[var(--status-success-text)]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">{selectedOpportunity.sourceName}</p>
                <p className="flex items-center gap-1 text-[11px] opacity-85">
                  <Clock className="h-3 w-3" />
                  Verified {formatVerifiedTimestamp(selectedOpportunity.verifiedAt)}
                </p>
              </div>
            </div>
            <a
              href={selectedOpportunity.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--status-success-border)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold text-[var(--status-success-text)] shadow-xs hover:bg-[var(--bg-subtle)]"
            >
              <span>Official Source</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-1.5 text-sm font-bold text-[var(--text-primary)]">
              Opportunity Overview
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {selectedOpportunity.description}
            </p>
            <p className="mt-2 inline-block rounded-lg bg-[var(--bg-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-primary)]">
              Benefits: {selectedOpportunity.benefitLabel}
            </p>
          </div>

          {/* Rule-Based Matching Check */}
          <div>
            <h3 className="mb-2.5 text-sm font-bold text-[var(--text-primary)]">
              Academic Eligibility Check (Rule-Based)
            </h3>
            <div className="space-y-2">
              {selectedOpportunity.match.ruleChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] px-3.5 py-2.5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {check.met ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--status-success)]" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-[var(--status-danger)]" />
                    )}
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{check.label}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Required: {check.required}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      check.met
                        ? 'bg-[var(--status-success-soft)] text-[var(--status-success-text)]'
                        : 'bg-[var(--status-danger-soft)] text-[var(--status-danger-text)]'
                    }`}
                  >
                    Yours: {check.actual}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Match Overview */}
          {(selectedOpportunity.requirements.technicalSkills.length > 0 ||
            selectedOpportunity.requirements.softSkills.length > 0) && (
            <div>
              <h3 className="mb-2.5 text-sm font-bold text-[var(--text-primary)]">
                Skill Qualifications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpportunity.match.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--status-success-border)] bg-[var(--status-success-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--status-success-text)]"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {skill}
                  </span>
                ))}
                {selectedOpportunity.match.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--status-danger-border)] bg-[var(--status-danger-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--status-danger-text)]"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {skill} (Gap)
                  </span>
                ))}
                {selectedOpportunity.match.matchedSoftSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]"
                  >
                    ✓ {skill}
                  </span>
                ))}
                {selectedOpportunity.match.missingSoftSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-dashed border-[var(--border-strong)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Document Checklist Preview */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-[var(--text-primary)]">
              Required Documents ({selectedOpportunity.defaultDocuments.length})
            </h3>
            <ul className="space-y-1.5">
              {selectedOpportunity.defaultDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl bg-[var(--bg-subtle)] px-3 py-2 text-xs"
                >
                  <span className="font-medium text-[var(--text-primary)]">{doc.label}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {doc.required ? 'Required' : 'Optional'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-6 py-4">
          {selectedOpportunity.category === 'internship' ? (
            <button
              type="button"
              onClick={() => {
                const id = selectedOpportunity.id
                closeOpportunityDetail()
                navigate(`/analyze?opportunity=${id}`)
              }}
              className="careerku-btn-secondary inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-indigo)]" />
              <span>AI Skill Gap Analysis</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!tracked) {
                  trackOpportunity(selectedOpportunity.id, 'preparing')
                }
                closeOpportunityDetail()
                navigate(`/tracker?opportunity=${selectedOpportunity.id}`)
              }}
              className="careerku-btn-secondary inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              <span>Open Document Checklist</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (tracked) {
                untrackOpportunity(selectedOpportunity.id)
              } else {
                trackOpportunity(selectedOpportunity.id, 'saved')
              }
            }}
            className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold ${
              tracked
                ? 'border border-[var(--accent-brand)]/30 bg-[var(--accent-brand-soft)] text-[var(--accent-brand)] hover:opacity-90'
                : 'careerku-btn-primary'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{tracked ? 'Saved in Tracker' : 'Save to Tracker'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
