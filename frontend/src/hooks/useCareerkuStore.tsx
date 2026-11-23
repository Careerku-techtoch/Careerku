import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  createInitialTrackedApplications,
  DEFAULT_STUDENT_PROFILE,
  MOCK_OPPORTUNITIES,
} from '@/services'
import type {
  ApplicationStatus,
  EnrichedOpportunity,
  ExperienceItem,
  StudentProfile,
  ToastMessage,
  TrackedApplication,
} from '@/types'
import { evaluateOpportunityMatch, getStatusLabel } from '@/utils'
import {
  CareerkuContext,
  type CareerkuContextValue,
  type ThemeMode,
} from './careerkuContext'

const PROFILE_STORAGE_KEY = 'careerku_profile_v2'
const TRACKED_STORAGE_KEY = 'careerku_tracked_v2'
const THEME_STORAGE_KEY = 'careerku_theme_v1'

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function CareerkuProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(() =>
    loadFromStorage(PROFILE_STORAGE_KEY, DEFAULT_STUDENT_PROFILE),
  )
  const [trackedApplications, setTrackedApplications] = useState<TrackedApplication[]>(() =>
    loadFromStorage(TRACKED_STORAGE_KEY, createInitialTrackedApplications()),
  )
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    loadFromStorage<ThemeMode>(THEME_STORAGE_KEY, 'light'),
  )
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const toastTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme))
    } catch {
      // Ignore storage quota errors
    }
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // Ignore storage quota errors
    }
  }, [profile])

  useEffect(() => {
    try {
      window.localStorage.setItem(TRACKED_STORAGE_KEY, JSON.stringify(trackedApplications))
    } catch {
      // Ignore storage quota errors
    }
  }, [trackedApplications])

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    setToast(null)
  }, [])

  const showToast = useCallback(
    (title: string, description?: string, tone: 'success' | 'info' = 'success') => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
      }
      setToast({
        id: `${Date.now()}`,
        title,
        description,
        tone,
      })
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null)
        toastTimerRef.current = null
      }, 3600)
    },
    [],
  )

  const opportunities = useMemo<EnrichedOpportunity[]>(() => {
    return MOCK_OPPORTUNITIES.map((opportunity) => ({
      ...opportunity,
      match: evaluateOpportunityMatch(opportunity, profile),
    }))
  }, [profile])

  const selectedOpportunity = useMemo(
    () => opportunities.find((item) => item.id === selectedOpportunityId) ?? null,
    [opportunities, selectedOpportunityId],
  )

  const updateProfile = useCallback(
    (updater: Partial<StudentProfile>) => {
      setProfile((prev) => ({ ...prev, ...updater }))
      showToast('Profile updated', 'Opportunity match scores have been recalculated.')
    },
    [showToast],
  )

  const addSkill = useCallback(
    (skill: string) => {
      const cleaned = skill.trim()
      if (!cleaned) return
      setProfile((prev) => {
        const exists = prev.skills.some(
          (item) => item.toLowerCase() === cleaned.toLowerCase(),
        )
        if (exists) return prev
        return { ...prev, skills: [...prev.skills, cleaned] }
      })
      showToast('Skill added', `"${cleaned}" is now included in your Match Score.`)
    },
    [showToast],
  )

  const removeSkill = useCallback((skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.toLowerCase() !== skill.toLowerCase()),
    }))
  }, [])

  const addExperience = useCallback(
    (exp: Omit<ExperienceItem, 'id'>) => {
      setProfile((prev) => ({
        ...prev,
        experiences: [
          { ...exp, id: `exp-${Date.now()}` },
          ...prev.experiences,
        ],
      }))
      showToast('Experience added', `${exp.role} at ${exp.organization}`)
    },
    [showToast],
  )

  const removeExperience = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((item) => item.id !== id),
    }))
  }, [])

  const getTrackedByOpportunityId = useCallback(
    (opportunityId: string) =>
      trackedApplications.find((item) => item.opportunityId === opportunityId),
    [trackedApplications],
  )

  const trackOpportunity = useCallback(
    (opportunityId: string, initialStatus: ApplicationStatus = 'saved') => {
      const target = MOCK_OPPORTUNITIES.find((item) => item.id === opportunityId)
      if (!target) return

      setTrackedApplications((prev) => {
        const existing = prev.find((item) => item.opportunityId === opportunityId)
        if (existing) return prev

        const now = new Date().toISOString()
        const nextItem: TrackedApplication = {
          opportunityId,
          status: initialStatus,
          savedAt: now,
          updatedAt: now,
          documents: target.defaultDocuments.map((doc) => ({
            ...doc,
            completed: false,
          })),
          notes: '',
          cvDraftNote: '',
          motivationLetterDraft: '',
        }
        return [nextItem, ...prev]
      })

      showToast(
        'Opportunity saved',
        `Moved to "${getStatusLabel(initialStatus)}" in Tracker`,
      )
    },
    [showToast],
  )

  const untrackOpportunity = useCallback(
    (opportunityId: string) => {
      setTrackedApplications((prev) =>
        prev.filter((item) => item.opportunityId !== opportunityId),
      )
      showToast('Removed from Tracker', 'Opportunity removed from your tracked list.', 'info')
    },
    [showToast],
  )

  const updateApplicationStatus = useCallback(
    (opportunityId: string, status: ApplicationStatus) => {
      setTrackedApplications((prev) =>
        prev.map((item) =>
          item.opportunityId === opportunityId
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item,
        ),
      )
      showToast('Status updated', `Moved to "${getStatusLabel(status)}"`)
    },
    [showToast],
  )

  const toggleDocumentItem = useCallback((opportunityId: string, documentId: string) => {
    setTrackedApplications((prev) =>
      prev.map((item) => {
        if (item.opportunityId !== opportunityId) return item
        const nextDocs = item.documents.map((doc) =>
          doc.id === documentId ? { ...doc, completed: !doc.completed } : doc,
        )
        const anyCompleted = nextDocs.some((doc) => doc.completed)
        const nextStatus: ApplicationStatus =
          item.status === 'saved' && anyCompleted ? 'preparing' : item.status
        return {
          ...item,
          status: nextStatus,
          documents: nextDocs,
          updatedAt: new Date().toISOString(),
        }
      }),
    )
  }, [])

  const updateApplicationDrafts = useCallback(
    (
      opportunityId: string,
      payload: Partial<Pick<TrackedApplication, 'notes' | 'cvDraftNote' | 'motivationLetterDraft'>>,
    ) => {
      setTrackedApplications((prev) =>
        prev.map((item) =>
          item.opportunityId === opportunityId
            ? { ...item, ...payload, updatedAt: new Date().toISOString() }
            : item,
        ),
      )
    },
    [],
  )

  const openOpportunityDetail = useCallback((opportunityId: string) => {
    setSelectedOpportunityId(opportunityId)
  }, [])

  const closeOpportunityDetail = useCallback(() => {
    setSelectedOpportunityId(null)
  }, [])

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
  }, [])

  const resetDemoData = useCallback(() => {
    setProfile(DEFAULT_STUDENT_PROFILE)
    setTrackedApplications(createInitialTrackedApplications())
    showToast('Demo data reset', 'Profile and tracker restored to default values.', 'info')
  }, [showToast])

  const value = useMemo<CareerkuContextValue>(
    () => ({
      profile,
      updateProfile,
      addSkill,
      removeSkill,
      addExperience,
      removeExperience,
      opportunities,
      trackedApplications,
      getTrackedByOpportunityId,
      trackOpportunity,
      untrackOpportunity,
      updateApplicationStatus,
      toggleDocumentItem,
      updateApplicationDrafts,
      selectedOpportunity,
      openOpportunityDetail,
      closeOpportunityDetail,
      theme,
      setTheme,
      toast,
      showToast,
      dismissToast,
      resetDemoData,
    }),
    [
      profile,
      updateProfile,
      addSkill,
      removeSkill,
      addExperience,
      removeExperience,
      opportunities,
      trackedApplications,
      getTrackedByOpportunityId,
      trackOpportunity,
      untrackOpportunity,
      updateApplicationStatus,
      toggleDocumentItem,
      updateApplicationDrafts,
      selectedOpportunity,
      openOpportunityDetail,
      closeOpportunityDetail,
      theme,
      setTheme,
      toast,
      showToast,
      dismissToast,
      resetDemoData,
    ],
  )

  return <CareerkuContext.Provider value={value}>{children}</CareerkuContext.Provider>
}
