/**
 * Aynı form ve validasyon kurallarıyla yeni harcama ekler veya mevcut harcamayı düzenler.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  expenseCategories,
  type Expense,
  type ExpenseCategory,
  type Person,
} from '../types'
import { CloseIcon } from './Icons'

type ExpenseField = 'title' | 'amount' | 'category' | 'paidById' | 'participantIds'
type ExpenseFormErrors = Partial<Record<ExpenseField, string>>

type ExpenseDialogProps = {
  expense: Expense | null
  people: Person[]
  onClose: () => void
  onSave: (expense: Expense) => void
}

const categoryIcons: Record<ExpenseCategory, string> = {
  'Yeme & İçme': 'restaurant',
  Ulaşım: 'car',
  Konaklama: 'accommodation',
  Market: 'market',
  Eğlence: 'entertainment',
  Diğer: 'other',
}

function parseAmount(value: string) {
  const compactValue = value.trim().replace(/\s/g, '')

  if (!compactValue) return null

  // Türkçe ondalık virgülle girilen tutarı Number tarafından okunabilen biçime dönüştürür.
  const normalizedValue = compactValue.includes(',')
    ? compactValue.replace(/\./g, '').replace(',', '.')
    : compactValue
  const parsedValue = Number(normalizedValue)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

function getInitialParticipantIds(expense: Expense | null, people: Person[]) {
  if (!expense) return null

  const validPersonIds = new Set(people.map((person) => person.id))

  return [
    ...new Set(
      expense.participantIds.filter((participantId) => validPersonIds.has(participantId)),
    ),
  ]
}

export function ExpenseDialog({ expense, people, onClose, onSave }: ExpenseDialogProps) {
  const isEditing = expense !== null
  const [title, setTitle] = useState(expense?.title ?? '')
  const [amount, setAmount] = useState(
    expense ? String(expense.amount).replace('.', ',') : '',
  )
  const [category, setCategory] = useState<ExpenseCategory | ''>(expense?.category ?? '')
  const [paidById, setPaidById] = useState(expense?.paidById ?? '')
  const [participantIds, setParticipantIds] = useState<string[] | null>(() =>
    getInitialParticipantIds(expense, people),
  )
  const [errors, setErrors] = useState<ExpenseFormErrors>({})
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const selectedParticipantIds = participantIds ?? people.map((person) => person.id)

  useEffect(() => {
    const dialog = dialogRef.current

    dialog?.showModal()
    titleInputRef.current?.focus()

    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  const clearError = (field: ExpenseField) => {
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
  }

  const handleParticipantChange = (personId: string, isSelected: boolean) => {
    setParticipantIds((currentParticipantIds) => {
      const currentSelection = currentParticipantIds ?? people.map((person) => person.id)

      if (isSelected) {
        return currentSelection.includes(personId)
          ? currentSelection
          : [...currentSelection, personId]
      }

      return currentSelection.filter((participantId) => participantId !== personId)
    })
    clearError('participantIds')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (people.length === 0) return

    const trimmedTitle = title.trim()
    const parsedAmount = parseAmount(amount)
    const validPersonIds = new Set(people.map((person) => person.id))
    const nextErrors: ExpenseFormErrors = {}

    if (!trimmedTitle) nextErrors.title = 'Lütfen harcama adını girin.'

    if (!amount.trim()) {
      nextErrors.amount = 'Lütfen bir tutar girin.'
    } else if (parsedAmount === null) {
      nextErrors.amount = 'Geçerli bir tutar girin.'
    } else if (parsedAmount <= 0) {
      nextErrors.amount = 'Tutar 0’dan büyük olmalıdır.'
    }

    if (!category) nextErrors.category = 'Lütfen bir kategori seçin.'
    if (!paidById || !validPersonIds.has(paidById)) {
      nextErrors.paidById = 'Lütfen geçerli bir ödeyen kişi seçin.'
    }
    if (
      selectedParticipantIds.length === 0 ||
      selectedParticipantIds.some((participantId) => !validPersonIds.has(participantId))
    ) {
      nextErrors.participantIds = 'En az bir geçerli katılımcı seçin.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    if (!category || !paidById || parsedAmount === null) return

    const savedExpense: Expense = {
      id: expense?.id ?? `${Date.now()}-${trimmedTitle.toLocaleLowerCase('tr-TR')}`,
      title: trimmedTitle,
      category,
      paidById,
      amount: parsedAmount,
      icon: categoryIcons[category],
      participantIds: [...selectedParticipantIds],
    }

    onSave(savedExpense)
  }

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog expense-dialog"
      aria-labelledby="expense-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="expense-dialog-title">
          {isEditing ? 'Harcamayı Düzenle' : 'Harcama Ekle'}
        </h2>
        <button
          className="dialog-close"
          type="button"
          aria-label={`${isEditing ? 'Harcama düzenleme' : 'Harcama ekleme'} penceresini kapat`}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <form className="person-form expense-form" onSubmit={handleSubmit} noValidate>
        {people.length === 0 && (
          <p className="dialog-notice" role="status">
            {isEditing ? 'Harcamayı düzenlemek' : 'Harcama eklemek'} için önce gruba bir kişi
            ekleyin.
          </p>
        )}
        <div className="expense-form-grid">
          <div className="form-field form-field-wide">
            <label htmlFor="expense-title">Harcama adı</label>
            <input
              ref={titleInputRef}
              id="expense-title"
              type="text"
              value={title}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'expense-title-error' : undefined}
              placeholder="Örn. Akşam yemeği"
              autoComplete="off"
              onChange={(event) => {
                setTitle(event.target.value)
                clearError('title')
              }}
            />
            {errors.title && (
              <p id="expense-title-error" className="form-error" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="expense-amount">Tutar</label>
            <div className="amount-input">
              <span aria-hidden="true">₺</span>
              <input
                id="expense-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? 'expense-amount-error' : undefined}
                placeholder="0,00"
                autoComplete="off"
                onChange={(event) => {
                  setAmount(event.target.value)
                  clearError('amount')
                }}
              />
            </div>
            {errors.amount && (
              <p id="expense-amount-error" className="form-error" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="expense-category">Kategori</label>
            <select
              id="expense-category"
              value={category}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'expense-category-error' : undefined}
              onChange={(event) => {
                setCategory(event.target.value as ExpenseCategory | '')
                clearError('category')
              }}
            >
              <option value="">Seçin</option>
              {expenseCategories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="expense-category-error" className="form-error" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="expense-payer">Ödeyen kişi</label>
            <select
              id="expense-payer"
              value={paidById}
              aria-invalid={Boolean(errors.paidById)}
              aria-describedby={errors.paidById ? 'expense-payer-error' : undefined}
              onChange={(event) => {
                setPaidById(event.target.value)
                clearError('paidById')
              }}
            >
              <option value="">Seçin</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            {errors.paidById && (
              <p id="expense-payer-error" className="form-error" role="alert">
                {errors.paidById}
              </p>
            )}
          </div>

          <fieldset
            className="participant-field form-field-wide"
            aria-invalid={Boolean(errors.participantIds)}
            aria-describedby={errors.participantIds ? 'expense-participants-error' : undefined}
          >
            <legend>Katılımcılar</legend>
            <p>Bu harcamayı paylaşacak kişileri seçin.</p>
            <div className="participant-options">
              {people.map((person) => (
                <label className="participant-option" key={person.id}>
                  <input
                    type="checkbox"
                    checked={selectedParticipantIds.includes(person.id)}
                    onChange={(event) =>
                      handleParticipantChange(person.id, event.target.checked)
                    }
                  />
                  <span className={`avatar avatar-${person.tone}`} aria-hidden="true">
                    {person.initials}
                  </span>
                  <span className="participant-name">{person.name}</span>
                </label>
              ))}
            </div>
            {errors.participantIds && (
              <p id="expense-participants-error" className="form-error" role="alert">
                {errors.participantIds}
              </p>
            )}
          </fieldset>
        </div>

        <div className="dialog-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            İptal
          </button>
          <button className="button button-primary" type="submit" disabled={people.length === 0}>
            {isEditing ? 'Kaydet' : 'Ekle'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
