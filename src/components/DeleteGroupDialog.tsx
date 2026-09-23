/**
 * Grup ve içindeki verilerin kalıcı silinmesi için veri kaybı uyarılı onay sunar.
 */
import { useEffect, useRef } from 'react'
import type { Group } from '../types'
import { CloseIcon } from './Icons'

type DeleteGroupDialogProps = {
  group: Group
  onClose: () => void
  onConfirm: (groupId: string) => void
}

export function DeleteGroupDialog({ group, onClose, onConfirm }: DeleteGroupDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const hasGroupData = group.people.length > 0 || group.expenses.length > 0

  useEffect(() => {
    const dialog = dialogRef.current

    dialog?.showModal()
    cancelButtonRef.current?.focus()

    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="person-dialog delete-dialog"
      aria-labelledby="delete-group-title"
      aria-describedby="delete-group-description"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-header">
        <h2 id="delete-group-title">Grubu sil?</h2>
        <button
          className="dialog-close"
          type="button"
          aria-label="Grup silme penceresini kapat"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="delete-dialog-content">
        <p id="delete-group-description">
          <strong>{group.name}</strong> grubunu silmek istediğinize emin misiniz?
        </p>
        {hasGroupData && (
          <p className="delete-group-warning">
            Bu gruptaki kişiler ve harcamalar da silinecek. Bu işlem geri alınamaz.
          </p>
        )}
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
            onClick={() => onConfirm(group.id)}
          >
            Grubu Sil
          </button>
        </div>
      </div>
    </dialog>
  )
}
