import type { MatchEvaluation, MatchTier, Opportunity, RuleCheckItem, StudentProfile } from '@/types'

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function hasSkillMatch(userSkills: string[], requiredSkill: string): boolean {
  const target = normalizeText(requiredSkill)
  return userSkills.some((skill) => {
    const normalized = normalizeText(skill)
    return (
      normalized === target ||
      normalized.includes(target) ||
      target.includes(normalized)
    )
  })
}

function isMajorEligible(userMajor: string, allowedMajors: string[]): boolean {
  const normalizedUser = normalizeText(userMajor)
  return allowedMajors.some((major) => {
    const normalizedAllowed = normalizeText(major)
    if (normalizedAllowed === 'all majors' || normalizedAllowed === 'semua jurusan') return true
    return (
      normalizedUser === normalizedAllowed ||
      normalizedUser.includes(normalizedAllowed) ||
      normalizedAllowed.includes(normalizedUser)
    )
  })
}

export function evaluateOpportunityMatch(
  opportunity: Opportunity,
  profile: StudentProfile,
): MatchEvaluation {
  const { requirements } = opportunity

  const gpaMet = profile.gpa >= requirements.minGpa
  const semesterMet =
    profile.semester >= requirements.minSemester &&
    (requirements.maxSemester === undefined || profile.semester <= requirements.maxSemester)
  const majorMet = isMajorEligible(profile.major, requirements.allowedMajors)

  const matchedSkills = requirements.technicalSkills.filter((skill) =>
    hasSkillMatch(profile.skills, skill),
  )
  const missingSkills = requirements.technicalSkills.filter(
    (skill) => !hasSkillMatch(profile.skills, skill),
  )

  const matchedSoftSkills = requirements.softSkills.filter((skill) =>
    hasSkillMatch(profile.skills, skill),
  )
  const missingSoftSkills = requirements.softSkills.filter(
    (skill) => !hasSkillMatch(profile.skills, skill),
  )

  const totalTech = requirements.technicalSkills.length
  const totalSoft = requirements.softSkills.length
  const techRatio = totalTech > 0 ? matchedSkills.length / totalTech : 1
  const softRatio = totalSoft > 0 ? matchedSoftSkills.length / totalSoft : 1

  let rawScore = 0
  if (opportunity.category === 'internship') {
    rawScore =
      (gpaMet ? 15 : 4) +
      (semesterMet ? 15 : 5) +
      (majorMet ? 15 : 5) +
      techRatio * 45 +
      softRatio * 10
  } else if (opportunity.category === 'scholarship') {
    rawScore =
      (gpaMet ? 35 : 10) +
      (semesterMet ? 20 : 6) +
      (majorMet ? 15 : 6) +
      techRatio * 10 +
      softRatio * 20
  } else {
    rawScore =
      (gpaMet ? 10 : 5) +
      (semesterMet ? 15 : 6) +
      (majorMet ? 15 : 8) +
      techRatio * 40 +
      softRatio * 20
  }

  const score = Math.max(20, Math.min(99, Math.round(rawScore)))
  const scoreOutOfTen = Math.max(2, Math.min(10, Math.round(score / 10)))

  let tier: MatchTier = 'low'
  let tierLabel: MatchEvaluation['tierLabel'] = 'Low'
  if (score >= 75) {
    tier = 'high'
    tierLabel = 'High'
  } else if (score >= 55) {
    tier = 'medium'
    tierLabel = 'Medium'
  }

  const semesterRequirementText = requirements.maxSemester
    ? `Semester ${requirements.minSemester}–${requirements.maxSemester}`
    : `Min. Semester ${requirements.minSemester}`

  const ruleChecks: RuleCheckItem[] = [
    {
      id: 'gpa',
      label: 'GPA',
      required: `Min. ${requirements.minGpa.toFixed(2)}`,
      actual: profile.gpa.toFixed(2),
      met: gpaMet,
    },
    {
      id: 'semester',
      label: 'Active Semester',
      required: semesterRequirementText,
      actual: `Semester ${profile.semester}`,
      met: semesterMet,
    },
    {
      id: 'major',
      label: 'Major / Study Program',
      required: requirements.allowedMajors.join(', '),
      actual: profile.major,
      met: majorMet,
    },
  ]

  let readinessSummary = ''
  if (tier === 'high') {
    readinessSummary =
      missingSkills.length === 0
        ? 'Your academic profile and skills align strongly with this opportunity. Focus on finalizing your application documents before the deadline.'
        : `Strong academic fit. Strengthening ${missingSkills.slice(0, 2).join(' & ')} will make your application even more competitive.`
  } else if (tier === 'medium') {
    readinessSummary =
      missingSkills.length > 0
        ? `Promising fit, with ${missingSkills.length} technical skill gap(s) to close (${missingSkills.slice(0, 2).join(', ')}).`
        : 'Solid technical readiness, though some academic eligibility criteria require attention.'
  } else {
    readinessSummary =
      'Several key qualification gaps were detected. Follow the recommended portfolio project ideas first to boost readiness before applying.'
  }

  return {
    score,
    scoreOutOfTen,
    tier,
    tierLabel,
    ruleChecks,
    matchedSkills,
    missingSkills,
    matchedSoftSkills,
    missingSoftSkills,
    readinessSummary,
  }
}
