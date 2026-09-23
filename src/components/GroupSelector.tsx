/**
 * Kullanıcının mevcut gruplar arasında erişilebilir bir select ile geçiş yapmasını sağlar.
 */
import type { Group } from '../types'

type GroupSelectorProps = {
  groups: Group[]
  activeGroupId: string
  onChange: (groupId: string) => void
}

export function GroupSelector({ groups, activeGroupId, onChange }: GroupSelectorProps) {
  return (
    <select
      className="group-title-select"
      value={activeGroupId}
      aria-label="Aktif grubu değiştir"
      onChange={(event) => onChange(event.target.value)}
    >
      {groups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </select>
  )
}
