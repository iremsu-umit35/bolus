/**
 * Aktif grubun seçicisini, yönetim aksiyonlarını, sayaçlarını ve toplam tutarını gösterir.
 */
import { formatCurrency } from '../formatCurrency'
import type { Group } from '../types'
import { GroupSelector } from './GroupSelector'
import { EditIcon, TrashIcon } from './Icons'

type GroupOverviewProps = {
  groups: Group[]
  activeGroupId: string
  peopleCount: number
  expenseCount: number
  totalExpense: number
  onGroupChange: (groupId: string) => void
  onEditGroup: () => void
  onDeleteGroup: () => void
}

export function GroupOverview({
  groups,
  activeGroupId,
  peopleCount,
  expenseCount,
  totalExpense,
  onGroupChange,
  onEditGroup,
  onDeleteGroup,
}: GroupOverviewProps) {
  const activeGroup = groups.find((group) => group.id === activeGroupId)

  return (
    <section className="group-overview" aria-labelledby="group-title">
      <div className="group-identity">
        <span className="overline">Aktif grup</span>
        <div className="group-title-row">
          <h1 id="group-title">
            <GroupSelector
              groups={groups}
              activeGroupId={activeGroupId}
              onChange={onGroupChange}
            />
          </h1>
          <div className="group-actions">
            <button
              className="icon-button"
              type="button"
              aria-label={`${activeGroup?.name ?? 'Aktif grup'} grubunun adını düzenle`}
              onClick={onEditGroup}
            >
              <EditIcon />
            </button>
            <button
              className="icon-button group-delete-button"
              type="button"
              aria-label={`${activeGroup?.name ?? 'Aktif grup'} grubunu sil`}
              onClick={onDeleteGroup}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
        <p>{peopleCount} kişi <span aria-hidden="true">·</span> {expenseCount} harcama</p>
      </div>

      <div className="total-block">
        <span>Toplam harcama</span>
        <strong>{formatCurrency(totalExpense)}</strong>
      </div>
    </section>
  )
}
