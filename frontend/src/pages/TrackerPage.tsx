import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  FileText,
  Layers,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { FolderTabs, MatchBadge, type FolderTabItem } from '@/components'
import { useCareerku } from '@/hooks'
import type { ApplicationStatus } from '@/types'
import { formatDateID, getDaysUntilDeadline, getStatusLabel } from '@/utils'

type TrackerTab = 'all' | 'saved' | 'preparing' | 'applied'

const STATUS_OPTIONS: ApplicationStatus[] = ['saved', 'preparing', 'applied', 'interview']

export function TrackerPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    opportunities,
    trackedApplications,
    updateApplicationStatus,
    toggleDocumentItem,
    updateApplicationDrafts,
    untrackOpportunity,
  } = useCareerku()

  const [activeTab, setActiveTab] = useState<TrackerTab>('all')
  const [prepView, setPrepView] = useState<'checklist' | 'documents'>('checklist')

  const enrichedTracked = useMemo(() => {
    return trackedApplications
      .map((app) => {
        const opp = opportunities.find((item) => item.id === app.opportunityId)
        if (!opp) return null
        const completedCount = app.documents.filter((d) => d.completed).length
        const totalDocs = app.documents.length
        const progressPercent = totalDocs > 0 ? Math.round((completedCount / totalDocs) * 100) : 0
        return {
          application: app,
          opportunity: opp,
          completedCount,
          totalDocs,
          progressPercent,
          daysLeft: getDaysUntilDeadline(opp.deadline),
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  }, [opportunities, trackedApplications])

  const tabs = useMemo<FolderTabItem<TrackerTab>[]>(() => {
    const savedCount = enrichedTracked.filter((e) => e.application.status === 'saved').length
    const prepCount = enrichedTracked.filter((e) => e.application.status === 'preparing').length
    const appliedCount = enrichedTracked.filter(
      (e) => e.application.status === 'applied' || e.application.status === 'interview',
    ).length

    return [
      { id: 'all', label: 'All Tracked', count: enrichedTracked.length, icon: Layers },
      { id: 'saved', label: 'Saved', count: savedCount, icon: Bookmark },
      { id: 'preparing', label: 'Preparing Docs', count: prepCount, icon: ClipboardList },
      { id: 'applied', label: 'Applied', count: appliedCount, icon: Send },
    ]
  }, [enrichedTracked])

  const filteredList = useMemo(() => {
    return enrichedTracked.filter((entry) => {
      if (activeTab === 'all') return true
      if (activeTab === 'applied') {
        return (
          entry.application.status === 'applied' || entry.application.status === 'interview'
        )
      }
      return entry.application.status === activeTab
    })
  }, [enrichedTracked, activeTab])

  const requestedId = searchParams.get('opportunity')
  const selectedEntry =
    filteredList.find((e) => e.opportunity.id === requestedId) ??
    filteredList[0] ??
    enrichedTracked[0] ??
    null

  return (
    <section className="flex flex-col gap-3.5">
      <FolderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="careerku-sheet relative z-10 rounded-[28px] p-5 sm:p-6">
        {enrichedTracked.length === 0 ? (
          <div className="careerku-card flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
            <p className="mb-1 text-base font-bold text-[var(--text-primary)]">
              No opportunities tracked yet
            </p>
            <p className="mb-4 max-w-md text-xs text-[var(--text-secondary)]">
              Save internships, competitions, or scholarships from Opportunities to organize your
              document checklist and monitor upcoming deadlines.
            </p>
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="careerku-btn-primary cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              Browse Opportunities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {/* Left List of Tracked Opportunities */}
            <div className="space-y-3 xl:col-span-5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">
                  Tracked List ({filteredList.length})
                </h2>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Sorted by closest deadline
                </span>
              </div>

              {filteredList.length === 0 ? (
                <div className="careerku-card rounded-2xl p-6 text-center text-xs text-[var(--text-secondary)]">
                  No opportunities in this status tab.
                </div>
              ) : (
                filteredList.map((entry) => {
                  const isSelected = selectedEntry?.opportunity.id === entry.opportunity.id
                  return (
                    <button
                      key={entry.opportunity.id}
                      type="button"
                      onClick={() =>
                        setSearchParams({ opportunity: entry.opportunity.id })
                      }
                      className={`careerku-card w-full cursor-pointer rounded-2xl p-4 text-left ${
                        isSelected
                          ? 'ring-2 ring-[var(--btn-primary-bg)]'
                          : 'hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="mb-2.5 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: entry.opportunity.orgAccent }}
                          >
                            {entry.opportunity.orgInitials}
                          </span>
                          <span className="truncate text-xs font-semibold text-[var(--text-secondary)]">
                            {entry.opportunity.organization}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            entry.daysLeft <= 14
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                          }`}
                        >
                          D-{Math.max(0, entry.daysLeft)}
                        </span>
                      </div>

                      <p className="mb-1 text-sm font-bold text-[var(--text-primary)]">
                        {entry.opportunity.title}
                      </p>

                      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateID(entry.opportunity.deadline)}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[var(--text-secondary)]">
                          {getStatusLabel(entry.application.status)}
                        </span>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-[var(--text-secondary)]">Document readiness</span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {entry.completedCount}/{entry.totalDocs} ({entry.progressPercent}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${entry.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            {/* Right Apply Prep & Status Workspace */}
            {selectedEntry && (
              <div className="careerku-card flex flex-col gap-5 rounded-2xl p-5 sm:p-6 xl:col-span-7">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-secondary)]">
                        {selectedEntry.opportunity.organization}
                      </span>
                      <MatchBadge match={selectedEntry.opportunity.match} />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {selectedEntry.opportunity.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Deadline {formatDateID(selectedEntry.opportunity.deadline)} (D-
                      {Math.max(0, selectedEntry.daysLeft)}) • {selectedEntry.opportunity.typeLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={selectedEntry.opportunity.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="careerku-btn-secondary inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => untrackOpportunity(selectedEntry.opportunity.id)}
                      aria-label="Remove from tracker"
                      title="Remove from tracker"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Switcher */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-secondary)]">
                    Application Status (Track)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => {
                      const active = selectedEntry.application.status === status
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(selectedEntry.opportunity.id, status)
                          }
                          className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                            active ? 'careerku-btn-primary' : 'careerku-btn-secondary'
                          }`}
                        >
                          {getStatusLabel(status)}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <button
                    type="button"
                    onClick={() => setPrepView('checklist')}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                      prepView === 'checklist'
                        ? 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    <span>
                      Document Checklist ({selectedEntry.completedCount}/{selectedEntry.totalDocs})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrepView('documents')}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                      prepView === 'documents'
                        ? 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>CV & Motivation Letter Guide</span>
                  </button>
                </div>

                {prepView === 'checklist' ? (
                  <div className="space-y-2.5">
                    {selectedEntry.application.documents.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() =>
                          toggleDocumentItem(selectedEntry.opportunity.id, doc.id)
                        }
                        className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left ${
                          doc.completed
                            ? 'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-500/25 dark:bg-emerald-500/10'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-sheet)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {doc.completed ? (
                          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--text-muted)]" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p
                              className={`text-xs font-bold ${
                                doc.completed
                                  ? 'text-emerald-800 line-through dark:text-emerald-200'
                                  : 'text-[var(--text-primary)]'
                              }`}
                            >
                              {doc.label}
                            </p>
                            <span className="rounded-full bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                              {doc.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                            {doc.tip}
                          </p>
                        </div>
                      </button>
                    ))}

                    <div className="pt-2">
                      <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                        Personal Notes / Reminders
                      </label>
                      <textarea
                        rows={2}
                        value={selectedEntry.application.notes}
                        onChange={(e) =>
                          updateApplicationDrafts(selectedEntry.opportunity.id, {
                            notes: e.target.value,
                          })
                        }
                        placeholder="Example: Request advisor recommendation letter on Thursday..."
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="careerku-subtle rounded-xl p-4">
                      <h4 className="mb-2 text-xs font-bold text-[var(--text-primary)]">
                        Recommended CV Highlights for This Opportunity
                      </h4>
                      <ul className="list-disc space-y-1.5 pl-4 text-xs text-[var(--text-secondary)]">
                        {selectedEntry.opportunity.cvHighlights.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <textarea
                        rows={2}
                        value={selectedEntry.application.cvDraftNote}
                        onChange={(e) =>
                          updateApplicationDrafts(selectedEntry.opportunity.id, {
                            cvDraftNote: e.target.value,
                          })
                        }
                        placeholder="Jot down CV tweaks specific to this role..."
                        className="mt-3 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                      />
                    </div>

                    <div className="careerku-subtle rounded-xl p-4">
                      <h4 className="mb-2 text-xs font-bold text-[var(--text-primary)]">
                        Motivation Letter / Essay Prompts
                      </h4>
                      <ul className="mb-3 space-y-1.5 text-xs text-[var(--text-secondary)]">
                        {selectedEntry.opportunity.motivationLetterPrompts.map((prompt) => (
                          <li key={prompt} className="rounded-lg bg-[var(--bg-card)] px-3 py-2">
                            • {prompt}
                          </li>
                        ))}
                      </ul>
                      <textarea
                        rows={4}
                        value={selectedEntry.application.motivationLetterDraft}
                        onChange={(e) =>
                          updateApplicationDrafts(selectedEntry.opportunity.id, {
                            motivationLetterDraft: e.target.value,
                          })
                        }
                        placeholder="Draft your motivation letter outline here..."
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedEntry.opportunity.category === 'internship' && (
                  <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-sheet)] px-4 py-3 text-xs">
                    <span className="text-[var(--text-secondary)]">
                      Want to check <em>skill gaps</em> & portfolio ideas before applying?
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/analyze?opportunity=${selectedEntry.opportunity.id}`)
                      }
                      className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[var(--accent-indigo)] hover:underline"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Open AI Analysis</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
