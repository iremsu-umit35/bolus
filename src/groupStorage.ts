/**
 * Grup verilerinin localStorage kalıcılığını, çalışma zamanı doğrulamasını
 * ve eski kişi/harcama anahtarlarından migration işlemini yönetir.
 */
import {
  expenseCategories,
  type AvatarTone,
  type Expense,
  type Group,
  type Person,
} from './types'

const GROUPS_STORAGE_KEY = 'bolus-groups'
const ACTIVE_GROUP_STORAGE_KEY = 'bolus-active-group-id'
const LEGACY_PEOPLE_STORAGE_KEY = 'bolus-people'
const LEGACY_EXPENSES_STORAGE_KEY = 'bolus-expenses'
const LEGACY_GROUP_ID = 'izmir-tatili'
const LEGACY_GROUP_NAME = 'İzmir Tatili'
const DEMO_EXPENSE_IDS = new Set(['aksam-yemegi', 'taksi', 'kahve'])
const avatarTones: AvatarTone[] = ['sage', 'blue', 'sand', 'lilac']

type LegacyExpense = Omit<Expense, 'participantIds'>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPerson(value: unknown): value is Person {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.initials === 'string' &&
    avatarTones.some((tone) => tone === value.tone)
  )
}

function isLegacyExpense(value: unknown): value is LegacyExpense & Record<string, unknown> {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    expenseCategories.some((category) => category === value.category) &&
    typeof value.paidById === 'string' &&
    typeof value.amount === 'number' &&
    Number.isFinite(value.amount) &&
    typeof value.icon === 'string'
  )
}

function isExpense(value: unknown): value is Expense {
  return (
    isLegacyExpense(value) &&
    Array.isArray(value.participantIds) &&
    value.participantIds.every((participantId) => typeof participantId === 'string')
  )
}

function parsePeople(value: unknown): Person[] | null {
  return Array.isArray(value) && value.every(isPerson) ? value : null
}

function parseExpenses(value: unknown, defaultParticipantIds: string[]): Expense[] | null {
  if (!Array.isArray(value)) return null

  const expenses: Expense[] = []

  for (const expenseValue of value) {
    if (isExpense(expenseValue)) {
      expenses.push(expenseValue)
    } else if (isLegacyExpense(expenseValue) && !('participantIds' in expenseValue)) {
      // participantIds öncesindeki kayıtlar veri kaybetmeden yeni modele taşınır;
      // eski harcamaların tüm mevcut kişiler arasında bölündüğü varsayılır.
      expenses.push({
        ...expenseValue,
        participantIds: [...defaultParticipantIds],
      })
    } else {
      return null
    }
  }

  return expenses
}

function parseGroup(value: unknown): Group | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
    return null
  }

  const people = parsePeople(value.people)

  if (!people) return null

  const expenses = parseExpenses(
    value.expenses,
    people.map((person) => person.id),
  )

  if (!expenses) return null

  return {
    id: value.id,
    name: value.name,
    people,
    expenses,
  }
}

function parseGroups(value: unknown): Group[] | null {
  if (!Array.isArray(value)) return null

  const groups: Group[] = []

  for (const groupValue of value) {
    const group = parseGroup(groupValue)

    if (!group) return null
    groups.push(group)
  }

  return groups
}

function readLegacyPeople(defaultPeople: Person[]) {
  try {
    const storedValue = localStorage.getItem(LEGACY_PEOPLE_STORAGE_KEY)

    if (storedValue === null) return defaultPeople

    const parsedValue: unknown = JSON.parse(storedValue)
    return parsePeople(parsedValue) ?? defaultPeople
  } catch {
    return defaultPeople
  }
}

function readLegacyExpenses(defaultParticipantIds: string[]) {
  try {
    const storedValue = localStorage.getItem(LEGACY_EXPENSES_STORAGE_KEY)

    if (storedValue === null) return []

    const parsedValue: unknown = JSON.parse(storedValue)
    const expenses = parseExpenses(parsedValue, defaultParticipantIds)

    return expenses?.filter((expense) => !DEMO_EXPENSE_IDS.has(expense.id)) ?? []
  } catch {
    return []
  }
}

function createDefaultGroup(defaultPeople: Person[]): Group {
  return {
    id: LEGACY_GROUP_ID,
    name: LEGACY_GROUP_NAME,
    people: defaultPeople,
    expenses: [],
  }
}

export function loadGroups(defaultPeople: Person[]): Group[] {
  try {
    const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY)

    if (storedGroups !== null) {
      // [] geçerli bir persisted değerdir: kullanıcı son grubu bilerek silmiş olabilir.
      // Bu nedenle yalnızca anahtarın yokluğu legacy migration'ı başlatır.
      const parsedGroups: unknown = JSON.parse(storedGroups)
      return parseGroups(parsedGroups) ?? [createDefaultGroup(defaultPeople)]
    }
  } catch {
    return [createDefaultGroup(defaultPeople)]
  }

  // Yeni storage henüz oluşmadıysa eski iki anahtar tek bir başlangıç grubunda birleşir.
  const people = readLegacyPeople(defaultPeople)
  const expenses = readLegacyExpenses(people.map((person) => person.id))

  return [
    {
      id: LEGACY_GROUP_ID,
      name: LEGACY_GROUP_NAME,
      people,
      expenses,
    },
  ]
}

export function loadActiveGroupId(groups: Group[]) {
  try {
    const storedGroupId = localStorage.getItem(ACTIVE_GROUP_STORAGE_KEY)

    if (storedGroupId && groups.some((group) => group.id === storedGroupId)) {
      return storedGroupId
    }
  } catch {
    return groups[0]?.id ?? ''
  }

  return groups[0]?.id ?? ''
}

export function saveGroups(groups: Group[]) {
  try {
    // Storage erişiminin tarayıcı tarafından engellenmesi uygulamanın çalışmasını durdurmamalı.
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups))
  } catch {
    return
  }
}

export function saveActiveGroupId(activeGroupId: string) {
  try {
    localStorage.setItem(ACTIVE_GROUP_STORAGE_KEY, activeGroupId)
  } catch {
    return
  }
}
