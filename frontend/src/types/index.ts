export type OpportunityCategory = 'internship' | 'competition' | 'scholarship'

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site' | 'Online'

export type ApplicationStatus = 'saved' | 'preparing' | 'applied' | 'interview'

export type MatchTier = 'high' | 'medium' | 'low'

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface ExperienceItem {
  id: string
  role: string
  organization: string
  period: string
  summary: string
}

export interface StudentProfile {
  name: string
  email: string
  university: string
  major: string
  semester: number
  gpa: number
  skills: string[]
  interests: string[]
  preferredCategories: OpportunityCategory[]
  experiences: ExperienceItem[]
}

export interface DocumentChecklistTemplate {
  id: string
  label: string
  category: 'cv' | 'motivation_letter' | 'academic' | 'portfolio' | 'other'
  required: boolean
  tip: string
}

export interface DocumentChecklistItem extends DocumentChecklistTemplate {
  completed: boolean
}

export interface PrioritySkillRecommendation {
  skill: string
  reason: string
  resourceHint: string
}

export interface PortfolioProjectIdea {
  id: string
  title: string
  description: string
  estimatedDuration: string
  targetSkills: string[]
  deliverable: string
}

export interface OpportunityRequirements {
  minGpa: number
  minSemester: number
  maxSemester?: number
  allowedMajors: string[]
  technicalSkills: string[]
  softSkills: string[]
  otherRequirements: string[]
}

export interface AiImprovementMeta {
  adviceSummary: string
  prioritySkills: PrioritySkillRecommendation[]
  portfolioIdeas: PortfolioProjectIdea[]
}

export interface Opportunity {
  id: string
  title: string
  organization: string
  orgInitials: string
  orgAccent: string
  category: OpportunityCategory
  typeLabel: string
  workMode: WorkMode
  location: string
  summary: string
  description: string
  deadline: string
  verifiedAt: string
  sourceUrl: string
  sourceName: string
  benefitLabel: string
  requirements: OpportunityRequirements
  defaultDocuments: DocumentChecklistTemplate[]
  cvHighlights: string[]
  motivationLetterPrompts: string[]
  aiImprovementMeta?: AiImprovementMeta
}

export interface RuleCheckItem {
  id: string
  label: string
  required: string
  actual: string
  met: boolean
}

export interface MatchEvaluation {
  score: number
  scoreOutOfTen: number
  tier: MatchTier
  tierLabel: 'High' | 'Medium' | 'Low'
  ruleChecks: RuleCheckItem[]
  matchedSkills: string[]
  missingSkills: string[]
  matchedSoftSkills: string[]
  missingSoftSkills: string[]
  readinessSummary: string
}

export interface EnrichedOpportunity extends Opportunity {
  match: MatchEvaluation
}

export interface TrackedApplication {
  opportunityId: string
  status: ApplicationStatus
  savedAt: string
  updatedAt: string
  documents: DocumentChecklistItem[]
  notes: string
  cvDraftNote: string
  motivationLetterDraft: string
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  tone?: 'success' | 'info'
}
