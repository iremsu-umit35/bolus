/**
 * Sayısal tutarları Türkçe yerel ayarlarla Türk Lirası biçiminde gösterir.
 */
const turkishLiraFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

export function formatCurrency(amount: number) {
  return turkishLiraFormatter.format(amount)
}
