/**
 * Aktif grubun adını diğer grup adlarıyla çakışmadan düzenleyen dialog formudur.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Group } from '../types'
import { isDuplicateGroupName } from '../utils/groupName'
import { CloseIcon } from './Icons'

type EditGroupDialogProps = {
  group: Group
  groups: Group[]
  onClose: () => void
  onSave: (name: string) => void
}

export function EditGroupDialog({ group, groups, onClose, onSave }: EditGroupDialogProps) {
  const [name, setName] = useState(group.name)
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

    // Düzenlenen grubun kendi ID'si hariç tutulur; mevcut adı yeniden kaydetmek geçerlidir.
    if (isDuplicateGroupName(groups, trimmedName, group.id)) {
      setError('Bu isimde başka bir grup zaten var.')
      return
    }

    onSave(trimmedName)
  }

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog"
      aria-labelledby="edit-group-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="edit-group-title">Grup adını düzenle</h2>
        <button
          className="dialog-close"
          type="button"
          aria-label="Grup adı düzenleme penceresini kapat"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <form className="person-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="edit-group-name">Grup adı</label>
          <input
            ref={inputRef}
            id="edit-group-name"
            type="text"
            value={name}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'edit-group-name-error' : undefined}
            autoComplete="off"
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
            }}
          />
          {error && (
            <p id="edit-group-name-error" className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="dialog-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>
            Vazgeç
          </button>
          <button className="button button-primary" type="submit">
            Kaydet
          </button>
        </div>
      </form>
    </dialog>
  )
}
