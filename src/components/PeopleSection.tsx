/**
 * Aktif grubun kişilerini gösterir ve kişi ekleme/silme aksiyonlarını sunar.
 */
import type { Person } from '../types'
import { PlusIcon, TrashIcon } from './Icons'

type PeopleSectionProps = {
  people: Person[]
  onAddPerson: () => void
  onDeletePerson: (person: Person) => void
}

export function PeopleSection({ people, onAddPerson, onDeletePerson }: PeopleSectionProps) {
  return (
    <section className="members" aria-labelledby="members-title">
      <div className="section-heading compact-heading">
        <div>
          <h2 id="members-title">Kişiler</h2>
          <p>Bu harcamayı paylaşanlar</p>
        </div>
        <button className="text-action" type="button" onClick={onAddPerson}>
          <PlusIcon />
          Kişi ekle
        </button>
      </div>

      {people.length === 0 ? (
        <p className="people-empty">Henüz kişi eklenmedi.</p>
      ) : (
        <ul className="member-list">
          {people.map((person) => (
            <li key={person.id}>
              <span className={`avatar avatar-${person.tone}`} aria-hidden="true">
                {person.initials}
              </span>
              <span className="member-name">{person.name}</span>
              <button
                className="member-delete"
                type="button"
                aria-label={`${person.name} kişisini sil`}
                onClick={() => onDeletePerson(person)}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
