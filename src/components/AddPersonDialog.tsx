/**
 * Aktif gruba kişi eklemek için erişilebilir isim formunu ve dialog odağını yönetir.
 */
import { useEffect, useRef, type FormEvent } from 'react'
import { CloseIcon } from './Icons'

type AddPersonDialogProps = {
  isOpen: boolean
  name: string
  error: string
  onNameChange: (name: string) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AddPersonDialog({
  isOpen,
  name,
  error,
  onNameChange,
  onClose,
  onSubmit,
}: AddPersonDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (isOpen && dialog && !dialog.open) {
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!isOpen && dialog?.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog"
      aria-labelledby="person-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="person-dialog-title">Kişi Ekle</h2>
        <button
          className="dialog-close"
          type="button"
          aria-label="Kişi ekleme penceresini kapat"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <form className="person-form" onSubmit={onSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="person-name">İsim</label>
          <input
            ref={inputRef}
            id="person-name"
            name="personName"
            type="text"
            value={name}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'person-name-error' : undefined}
            placeholder="Örn. Ahmet"
            autoComplete="off"
            onChange={(event) => onNameChange(event.target.value)}
          />
          {error && (
            <p id="person-name-error" className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="dialog-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            İptal
          </button>
          <button className="button button-primary" type="submit">
            Ekle
          </button>
        </div>
      </form>
    </dialog>
  )
}
