/**
 * Grup adlarını Türkçe karakter kurallarına göre karşılaştırılabilir hale getirir
 * ve oluşturma/düzenleme işlemlerinde tekrar eden adları tespit eder.
 */
import type { Group } from '../types'

export function normalizeGroupName(name: string) {
  // NFC eşdeğer Unicode yazımlarını, tr-TR ise İ/i gibi Türkçe harfleri eşitler.
  return name.trim().normalize('NFC').toLocaleLowerCase('tr-TR')
}

export function isDuplicateGroupName(
  groups: Group[],
  name: string,
  excludedGroupId?: string,
) {
  const normalizedName = normalizeGroupName(name)

  return groups.some(
    (group) =>
      group.id !== excludedGroupId && normalizeGroupName(group.name) === normalizedName,
  )
}
