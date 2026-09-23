/**
 * Aktif grubun harcamalarını listeler ve ekleme, düzenleme ve silme aksiyonlarını sunar.
 */
import { formatCurrency } from '../formatCurrency'
import type { Expense, Person } from '../types'
import { ArrowIcon, EditIcon, PlusIcon, TrashIcon } from './Icons'

type ExpenseSectionProps = {
  expenses: Expense[]
  people: Person[]
  onAddExpense: () => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (expense: Expense) => void
}

function ExpenseIcon({ type }: { type: string }) {
  if (type === 'car') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5.5 16-1.2-1.2V11l1.4-1.4L7 6.5h10l1.3 3.1 1.4 1.4v3.8L18.5 16M7 16v1.5M17 16v1.5M6 12h12M8 13.5h.01M16 13.5h.01" />
      </svg>
    )
  }

  if (type === 'coffee') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 8h11v6.5A3.5 3.5 0 0 1 13.5 18h-4A3.5 3.5 0 0 1 6 14.5V8Zm11 2h1a2 2 0 1 1 0 4h-1M8 5.5h7" />
      </svg>
    )
  }

  if (type === 'accommodation') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 18.5v-9l7.5-5 7.5 5v9M8.5 18.5v-5h7v5M3.5 18.5h17" />
      </svg>
    )
  }

  if (type === 'market') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h14l-1 11H6L5 8Zm3-2.5A4 4 0 0 1 12 2a4 4 0 0 1 4 3.5M9 11v4M15 11v4" />
      </svg>
    )
  }

  if (type === 'entertainment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 9.5h8M12 5v9M7.5 7 5 8.5 3.5 16c-.4 2 1.9 3.3 3.4 1.9l2.6-2.4h5l2.6 2.4c1.5 1.4 3.8.1 3.4-1.9L19 8.5 16.5 7" />
      </svg>
    )
  }

  if (type === 'other') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="18" cy="12" r="1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5v5M9.5 4.5v5M7 7h2.5M8.25 9.5v10M16 4.5c-1.1 0-2 1.5-2 3.4v3.6h4V7.9c0-1.9-.9-3.4-2-3.4Zm0 7v8" />
    </svg>
  )
}

export function ExpenseSection({
  expenses,
  people,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}: ExpenseSectionProps) {
  return (
    <section className="expenses" aria-labelledby="expenses-title">
      <div className="section-heading expenses-heading">
        <div>
          <h2 id="expenses-title">Harcamalar</h2>
          <p>Son eklenen ortak harcamalar</p>
        </div>
        <button className="button button-primary" type="button" onClick={onAddExpense}>
          <PlusIcon />
          Harcama Ekle
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="expense-empty">
          <strong>Henüz harcama eklenmedi.</strong>
          <p>İlk ortak harcamanızı ekleyerek başlayın.</p>
        </div>
      ) : (
        <>
          <ul className="transaction-list">
            {expenses.map((expense) => {
              const payer = people.find((person) => person.id === expense.paidById)
              const payerName = payer?.name ?? 'Bilinmeyen kişi'

              return (
                <li key={expense.id}>
                  <span className={`transaction-icon transaction-icon-${expense.icon}`}>
                    <ExpenseIcon type={expense.icon} />
                  </span>
                  <span className="transaction-main">
                    <strong>{expense.title}</strong>
                    <small>
                      {expense.category}
                      <span className="mobile-payer"> · {payerName} ödedi</span>
                    </small>
                  </span>
                  <span className="transaction-payer">
                    <small>Ödeyen</small>
                    <span>{payerName}</span>
                  </span>
                  <strong className="transaction-amount">
                    {formatCurrency(expense.amount)}
                  </strong>
                  <div className="transaction-actions">
                    <button
                      className="transaction-edit"
                      type="button"
                      aria-label={`${expense.title} harcamasını düzenle`}
                      onClick={() => onEditExpense(expense)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="transaction-delete"
                      type="button"
                      aria-label={`${expense.title} harcamasını sil`}
                      onClick={() => onDeleteExpense(expense)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <button className="all-expenses" type="button">
            Tüm harcamaları gör
            <ArrowIcon />
          </button>
        </>
      )}
    </section>
  )
}
