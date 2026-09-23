/**
 * Bir grubun harcamalarından net kişi bakiyelerini hesaplar ve hesapların
 * kapanması için gereken en sade ödeme transferlerini üretir.
 */
import type { Expense, Person, Settlement } from '../types'

type Debtor = {
  personId: string
  remainingDebtInCents: number
}

type Creditor = {
  personId: string
  remainingCreditInCents: number
}

export function calculateSettlements(people: Person[], expenses: Expense[]): Settlement[] {
  const balancesInCents = new Map<string, number>()

  for (const person of people) {
    balancesInCents.set(person.id, 0)
  }

  const validPersonIds = new Set(balancesInCents.keys())

  for (const expense of expenses) {
    if (!Number.isFinite(expense.amount) || expense.amount <= 0) continue
    if (!validPersonIds.has(expense.paidById)) continue
    if (!Array.isArray(expense.participantIds)) continue

    // Floating-point yuvarlama hatalarını önlemek için tüm hesap para biriminin
    // en küçük tam sayı değeri olan kuruş üzerinden yapılır.
    const amountInCents = Math.round(expense.amount * 100)

    if (!Number.isSafeInteger(amountInCents) || amountInCents <= 0) continue

    // Silinmiş kişiler ve tekrarlanan kimlikler bakiyeyi yapay olarak değiştirmemeli.
    const participantIds = [
      ...new Set(
        expense.participantIds.filter(
          (participantId) =>
            typeof participantId === 'string' && validPersonIds.has(participantId),
        ),
      ),
    ]

    if (participantIds.length === 0) continue

    const payerBalance = balancesInCents.get(expense.paidById) ?? 0
    balancesInCents.set(expense.paidById, payerBalance + amountInCents)

    const baseShareInCents = Math.floor(amountInCents / participantIds.length)
    const remainderInCents = amountInCents % participantIds.length

    participantIds.forEach((participantId, index) => {
      // Eşit bölünemeyen kuruşları sırayla dağıtmak toplam borç ve alacağı
      // tam olarak dengede tutar.
      const participantShare = baseShareInCents + (index < remainderInCents ? 1 : 0)
      const participantBalance = balancesInCents.get(participantId) ?? 0

      balancesInCents.set(participantId, participantBalance - participantShare)
    })
  }

  const debtors: Debtor[] = []
  const creditors: Creditor[] = []

  for (const [personId, balanceInCents] of balancesInCents) {
    if (balanceInCents < 0) {
      debtors.push({ personId, remainingDebtInCents: -balanceInCents })
    } else if (balanceInCents > 0) {
      creditors.push({ personId, remainingCreditInCents: balanceInCents })
    }
  }

  const settlements: Settlement[] = []
  let debtorIndex = 0
  let creditorIndex = 0

  // Her adımda borç ve alacağın küçüğünü kapatmak, taraflardan en az birini
  // sıfırlayarak gereksiz transfer üretmeden ilerler.
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex]
    const creditor = creditors[creditorIndex]
    const paymentInCents = Math.min(
      debtor.remainingDebtInCents,
      creditor.remainingCreditInCents,
    )

    if (paymentInCents > 0) {
      settlements.push({
        fromPersonId: debtor.personId,
        toPersonId: creditor.personId,
        amount: paymentInCents / 100,
      })
    }

    debtor.remainingDebtInCents -= paymentInCents
    creditor.remainingCreditInCents -= paymentInCents

    if (debtor.remainingDebtInCents === 0) debtorIndex += 1
    if (creditor.remainingCreditInCents === 0) creditorIndex += 1
  }

  return settlements
}
