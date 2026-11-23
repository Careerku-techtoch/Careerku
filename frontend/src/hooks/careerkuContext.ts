import { createContext, useContext } from 'react'
import type {
  ApplicationStatus,
  EnrichedOpportunity,
  ExperienceItem,
  StudentProfile,
  ToastMessage,
  TrackedApplication,
} from '@/types'

export type ThemeMode = 'light' | 'dark'

export interface CareerkuContextValue {
  profile: StudentProfile
  updateProfile: (updater: Partial<StudentProfile>) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void
  removeExperience: (id: string) => void
  opportunities: EnrichedOpportunity[]
  trackedApplications: TrackedApplication[]
  getTrackedByOpportunityId: (opportunityId: string) => TrackedApplication | undefined
  trackOpportunity: (opportunityId: string, initialStatus?: ApplicationStatus) => void
  untrackOpportunity: (opportunityId: string) => void
  updateApplicationStatus: (opportunityId: string, status: ApplicationStatus) => void
  toggleDocumentItem: (opportunityId: string, documentId: string) => void
  updateApplicationDrafts: (
    opportunityId: string,
    payload: Partial<Pick<TrackedApplication, 'notes' | 'cvDraftNote' | 'motivationLetterDraft'>>,
  ) => void
  selectedOpportunity: EnrichedOpportunity | null
  openOpportunityDetail: (opportunityId: string) => void
  closeOpportunityDetail: () => void
  theme: ThemeMode
  setTheme: (mode: ThemeMode) => void
  toast: ToastMessage | null
  showToast: (title: string, description?: string, tone?: 'success' | 'info') => void
  dismissToast: () => void
  resetDemoData: () => void
}

export const CareerkuContext = createContext<CareerkuContextValue | null>(null)

export function useCareerku(): CareerkuContextValue {
  const ctx = useContext(CareerkuContext)
  if (!ctx) {
    throw new Error('useCareerku must be used inside CareerkuProvider')
  }
  return ctx
}
