/**
 * Benzersiz ve geçerli bir adla yeni grup oluşturulmasını sağlayan dialog formudur.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Group } from '../types'
import { isDuplicateGroupName } from '../utils/groupName'
import { CloseIcon } from './Icons'

type CreateGroupDialogProps = {
  groups: Group[]
  onClose: () => void
  onCreate: (name: string) => void
}

export function CreateGroupDialog({ groups, onClose, onCreate }: CreateGroupDialogProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    dialog?.showModal()
    inputRef.current?.focus()

    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Lütfen bir grup adı girin.')
      return
    }

    // Ortak helper, Unicode ve Türkçe harf farklarının duplicate kontrolünü aşmasını önler.
    if (isDuplicateGroupName(groups, trimmedName)) {
      setError('Bu isimde bir grup zaten var.')
      return
    }

    onCreate(trimmedName)
  }

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog"
      aria-labelledby="create-group-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="create-group-title">Yeni grup oluştur</h2>
        <button
          className="dialog-close"
          type="button"
          aria-label="Yeni grup penceresini kapat"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <form className="person-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="group-name">Grup adı</label>
          <input
            ref={inputRef}
            id="group-name"
            type="text"
            value={name}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'group-name-error' : undefined}
            placeholder="Örn. Kapadokya Tatili"
            autoComplete="off"
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
            }}
          />
          {error && (
            <p id="group-name-error" className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="dialog-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            Vazgeç
          </button>
          <button className="button button-primary" type="submit">
            Oluştur
          </button>
        </div>
      </form>
    </dialog>
  )
}
