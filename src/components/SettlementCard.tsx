/**
 * Aktif grubun hesaplanan ödeme planını, kapalı hesap veya boş durumuyla birlikte gösterir.
 */
import { formatCurrency } from '../formatCurrency'
import type { Expense, Person } from '../types'
import { calculateSettlements } from '../utils/calculateSettlements'
import { ArrowIcon } from './Icons'

type SettlementCardProps = {
  expenses: Expense[]
  people: Person[]
}

function SettlementSymbol() {
  return (
    <div className="settlement-symbol" aria-hidden="true">
      <svg viewBox="0 0 28 28">
        <path d="M7 9.5h13.5M17 6l3.5 3.5L17 13M21 18.5H7.5M11 15l-3.5 3.5L11 22" />
      </svg>
    </div>
  )
}

export function SettlementCard({ expenses, people }: SettlementCardProps) {
  const settlements = calculateSettlements(people, expenses)
  const peopleById = new Map(people.map((person) => [person.id, person]))

  if (expenses.length === 0) {
    return (
      <aside className="settlement" aria-labelledby="settlement-title">
        <SettlementSymbol />
        <div className="settlement-copy">
          <span className="overline">Sıradaki adım</span>
          <h2 id="settlement-title">Hesaplaşmaya hazır mısınız?</h2>
          <p>Tüm harcamaları eklediğinizde kimin kime ne kadar ödeyeceğini görün.</p>
        </div>
        <button className="button button-primary settlement-button" type="button">
          Borçları Hesapla
          <ArrowIcon />
        </button>
        <small className="settlement-note">Henüz hesaplanacak harcama yok</small>
      </aside>
    )
  }

  if (settlements.length === 0) {
    return (
      <aside className="settlement" aria-labelledby="settlement-title">
        <SettlementSymbol />
        <div className="settlement-copy">
          <span className="overline">Hesaplaşma</span>
          <h2 id="settlement-title">Hesaplar kapandı</h2>
          <p>Şu anda kimsenin kimseye ödeme yapması gerekmiyor.</p>
        </div>
        <small className="settlement-note">
          {expenses.length} harcama hesaplamaya dahil edildi
        </small>
      </aside>
    )
  }

  return (
    <aside className="settlement" aria-labelledby="settlement-title">
      <SettlementSymbol />
      <div className="settlement-copy">
        <span className="overline">Hesaplaşma</span>
        <h2 id="settlement-title">Ödeme planı</h2>
        <p>Hesapları kapatmak için aşağıdaki ödemeleri yapın.</p>
      </div>

      <ul className="settlement-list">
        {settlements.map((settlement) => {
          const fromPerson = peopleById.get(settlement.fromPersonId)
          const toPerson = peopleById.get(settlement.toPersonId)

          if (!fromPerson || !toPerson) return null

          return (
            <li key={`${settlement.fromPersonId}-${settlement.toPersonId}`}>
              <div className="settlement-route">
                <strong>{fromPerson.name}</strong>
                <ArrowIcon />
                <strong>{toPerson.name}</strong>
              </div>
              <div className="settlement-payment">
                <strong>{formatCurrency(settlement.amount)}</strong>
                <span>ödeyecek</span>
              </div>
            </li>
          )
        })}
      </ul>

      <small className="settlement-note">
        {expenses.length} harcama hesaplamaya dahil edildi
      </small>
    </aside>
  )
}
