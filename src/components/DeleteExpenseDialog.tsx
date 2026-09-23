/**
 * Bir harcama silinmeden önce kullanıcıdan güvenli ve erişilebilir onay alır.
 */
import { useEffect, useRef } from 'react'
import type { Expense } from '../types'
import { CloseIcon } from './Icons'

type DeleteExpenseDialogProps = {
  expense: Expense | null
  onClose: () => void
  onConfirm: (expenseId: string) => void
}

export function DeleteExpenseDialog({
  expense,
  onClose,
  onConfirm,
}: DeleteExpenseDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (expense && dialog && !dialog.open) {
      dialog.showModal()
      cancelButtonRef.current?.focus()
    } else if (!expense && dialog?.open) {
      dialog.close()
    }
  }, [expense])

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog delete-dialog"
      aria-labelledby="delete-expense-title"
      aria-describedby="delete-expense-description"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="delete-expense-title">Harcamayı sil?</h2>
        <button
          className="dialog-close"
          type="button"
          aria-label="Harcama silme penceresini kapat"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="delete-dialog-content">
        <p id="delete-expense-description">
          <strong>{expense?.title}</strong> harcamasını silmek istediğinize emin misiniz?
        </p>
        <div className="dialog-actions">
          <button
            ref={cancelButtonRef}
            className="button button-secondary"
            type="button"
            onClick={onClose}
          >
            Vazgeç
          </button>
          <button
            className="button button-danger"
            type="button"
            onClick={() => expense && onConfirm(expense.id)}
          >
            Sil
          </button>
        </div>
      </div>
    </dialog>
  )
}
