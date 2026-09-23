/**
 * Kişi silmeyi onaylar veya kişi harcamalarda kullanılıyorsa neden silinemediğini açıklar.
 */
import { useEffect, useRef } from 'react'
import type { Person } from '../types'
import { CloseIcon } from './Icons'

type DeletePersonDialogProps = {
  person: Person | null
  isInUse: boolean
  onClose: () => void
  onConfirm: (personId: string) => void
}

export function DeletePersonDialog({
  person,
  isInUse,
  onClose,
  onConfirm,
}: DeletePersonDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const safeButtonRef = useRef<HTMLButtonElement>(null)
  const title = isInUse ? 'Bu kişi henüz silinemez' : 'Kişiyi sil?'

  useEffect(() => {
    const dialog = dialogRef.current

    if (person && dialog && !dialog.open) {
      dialog.showModal()
      safeButtonRef.current?.focus()
    } else if (!person && dialog?.open) {
      dialog.close()
    }
  }, [person])

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog delete-dialog"
      aria-labelledby="delete-person-title"
      aria-describedby="delete-person-description"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="delete-person-title">{title}</h2>
        <button
          className="dialog-close"
          type="button"
          aria-label="Kişi silme penceresini kapat"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="delete-dialog-content">
        {isInUse ? (
          <p id="delete-person-description">
            <strong>{person?.name}</strong> mevcut harcamalarda ödeyen veya katılımcı olarak
            kullanılıyor. Kişiyi silmeden önce ilgili harcamaları kaldırın.
          </p>
        ) : (
          <p id="delete-person-description">
            <strong>{person?.name}</strong> kişisini gruptan silmek istediğinize emin misiniz?
          </p>
        )}

        <div className="dialog-actions">
          {isInUse ? (
            <button
              ref={safeButtonRef}
              className="button button-primary"
              type="button"
              onClick={onClose}
            >
              Tamam
            </button>
          ) : (
            <>
              <button
                ref={safeButtonRef}
                className="button button-secondary"
                type="button"
                onClick={onClose}
              >
                Vazgeç
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={() => person && onConfirm(person.id)}
              >
                Sil
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  )
}
