/**
 * Bölüş uygulamasında component ve utility'ler arasında paylaşılan
 * kişi, harcama, hesaplaşma ve grup domain modellerini içerir.
 */
export type AvatarTone = 'sage' | 'blue' | 'sand' | 'lilac'

export type Person = {
  id: string
  name: string
  initials: string
  tone: AvatarTone
}

export const expenseCategories = [
  'Yeme & İçme',
  'Ulaşım',
  'Konaklama',
  'Market',
  'Eğlence',
  'Diğer',
] as const

export type ExpenseCategory = (typeof expenseCategories)[number]

export type Expense = {
  id: string
  title: string
  category: ExpenseCategory
  paidById: string
  amount: number
  icon: string
  participantIds: string[]
}

export type Settlement = {
  fromPersonId: string
  toPersonId: string
  amount: number
}

export type Group = {
  id: string
  name: string
  people: Person[]
  expenses: Expense[]
}
