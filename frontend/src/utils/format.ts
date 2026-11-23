import type { ApplicationStatus, OpportunityCategory } from '@/types'

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatDateID(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  const day = date.getDate()
  const month = MONTHS_EN[date.getMonth()] ?? ''
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatVerifiedTimestamp(isoDateTime: string): string {
  const date = new Date(isoDateTime)
  if (Number.isNaN(date.getTime())) return isoDateTime
  const day = date.getDate()
  const month = (MONTHS_EN[date.getMonth()] ?? '').slice(0, 3)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month} ${day} • ${hours}:${minutes} WIB`
}

export function getDaysUntilDeadline(isoDate: string): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(isoDate)
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const diffMs = targetDay.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function getCategoryLabel(category: OpportunityCategory): string {
  switch (category) {
    case 'internship':
      return 'Internship'
    case 'competition':
      return 'Competition'
    case 'scholarship':
      return 'Scholarship'
  }
}

export function getStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case 'saved':
      return 'Saved'
    case 'preparing':
      return 'Preparing Docs'
    case 'applied':
      return 'Applied'
    case 'interview':
      return 'In Review'
  }
}
