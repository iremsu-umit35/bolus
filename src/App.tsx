/**
 * Uygulamanın ana bileşenidir; çoklu grup state'ini yönetir ve grup,
 * kişi ve harcama işlemlerini ilgili arayüz bileşenlerine bağlar.
 */
import { useEffect, useState, type FormEvent } from 'react'
import { AddPersonDialog } from './components/AddPersonDialog'
import { CreateGroupDialog } from './components/CreateGroupDialog'
import { DeleteExpenseDialog } from './components/DeleteExpenseDialog'
import { DeleteGroupDialog } from './components/DeleteGroupDialog'
import { DeletePersonDialog } from './components/DeletePersonDialog'
import { EditGroupDialog } from './components/EditGroupDialog'
import { ExpenseDialog } from './components/ExpenseDialog'
import { ExpenseSection } from './components/ExpenseSection'
import { GroupOverview } from './components/GroupOverview'
import { Header } from './components/Header'
import { PeopleSection } from './components/PeopleSection'
import { SettlementCard } from './components/SettlementCard'
import {
  loadActiveGroupId,
  loadGroups,
  saveActiveGroupId,
  saveGroups,
} from './groupStorage'
import type { AvatarTone, Expense, Group, Person } from './types'
import './App.css'

const initialPeople: Person[] = [
  { id: 'irem', name: 'İrem', initials: 'İR', tone: 'sage' },
  { id: 'ece', name: 'Ece', initials: 'EC', tone: 'blue' },
  { id: 'mert', name: 'Mert', initials: 'ME', tone: 'sand' },
  { id: 'deniz', name: 'Deniz', initials: 'DE', tone: 'lilac' },
]

const avatarTones: AvatarTone[] = ['sage', 'blue', 'sand', 'lilac']
const emptyPeople: Person[] = []
const emptyExpenses: Expense[] = []

function createInitials(name: string) {
  const words = name.split(/\s+/)

  if (words.length === 1) {
    return Array.from(words[0]).slice(0, 2).join('').toLocaleUpperCase('tr-TR')
  }

  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('')
    .toLocaleUpperCase('tr-TR')
}

function App() {
  const [groups, setGroups] = useState<Group[]>(() => loadGroups(initialPeople))
  const [activeGroupId, setActiveGroupId] = useState(() => loadActiveGroupId(groups))
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false)
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null)
  const [personName, setPersonName] = useState('')
  const [personError, setPersonError] = useState('')

  // Persist edilen aktif kimlik geçersizse ilk gruba dönmek, bozuk veya eski
  // storage verisinin uygulamayı kullanılamaz hale getirmesini önler.
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0] ?? null
  const people = activeGroup?.people ?? emptyPeople
  const expenses = activeGroup?.expenses ?? emptyExpenses

  useEffect(() => {
    // Migration sonrasında tek veri kaynağı groups olur; tüm alt veriler birlikte saklanır.
    saveGroups(groups)
  }, [groups])

  useEffect(() => {
    saveActiveGroupId(activeGroup?.id ?? '')
  }, [activeGroup?.id])

  const updateActiveGroup = (update: (group: Group) => Group) => {
    if (!activeGroup) return

    // Yalnızca aktif grup kopyalanır; diğer grupların referans ve verileri korunarak
    // gruplar arasında kişi/harcama sızıntısı engellenir.
    setGroups((currentGroups) =>
      currentGroups.map((group) => (group.id === activeGroup.id ? update(group) : group)),
    )
  }

  const handleCreateGroup = (name: string) => {
    const newGroup: Group = {
      id: `group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      people: [],
      expenses: [],
    }

    setGroups((currentGroups) => [...currentGroups, newGroup])
    setActiveGroupId(newGroup.id)
    setIsCreateGroupDialogOpen(false)
  }

  const handleUpdateGroupName = (name: string) => {
    if (!activeGroup) return

    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === activeGroup.id ? { ...group, name } : group,
      ),
    )
    setIsEditGroupDialogOpen(false)
  }

  const handleDeleteGroup = (groupId: string) => {
    const deletedGroupIndex = groups.findIndex((group) => group.id === groupId)
    const remainingGroups = groups.filter((group) => group.id !== groupId)

    setGroups(remainingGroups)

    if (activeGroup?.id === groupId) {
      // Önce aynı sıradaki sonraki grubu, o yoksa önceki grubu seçerek
      // grup geçişini kullanıcı için öngörülebilir tutuyoruz.
      const fallbackIndex = Math.min(deletedGroupIndex, remainingGroups.length - 1)
      const fallbackGroup = fallbackIndex >= 0 ? remainingGroups[fallbackIndex] : null

      setActiveGroupId(fallbackGroup?.id ?? '')
    }

    setGroupToDelete(null)
    setIsEditGroupDialogOpen(false)
  }

  const handleGroupChange = (groupId: string) => {
    if (!groups.some((group) => group.id === groupId)) return

    setIsPersonDialogOpen(false)
    setIsExpenseDialogOpen(false)
    setExpenseToEdit(null)
    setExpenseToDelete(null)
    setPersonToDelete(null)
    setIsEditGroupDialogOpen(false)
    setGroupToDelete(null)
    setPersonName('')
    setPersonError('')
    setActiveGroupId(groupId)
  }

  const openPersonDialog = () => {
    setPersonName('')
    setPersonError('')
    setIsPersonDialogOpen(true)
  }

  const closePersonDialog = () => {
    setIsPersonDialogOpen(false)
    setPersonName('')
    setPersonError('')
  }

  const handlePersonNameChange = (name: string) => {
    setPersonName(name)
    if (personError) setPersonError('')
  }

  const handleAddPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = personName.trim()

    if (!trimmedName) {
      setPersonError('Lütfen bir isim girin.')
      return
    }

    // Türkçe büyük/küçük harf kuralları ve eşdeğer Unicode yazımları,
    // aynı kişinin farklı görünüşlerle tekrar eklenmesini engeller.
    const normalizedName = trimmedName.normalize('NFC').toLocaleLowerCase('tr-TR')
    const isDuplicate = people.some(
      (person) => person.name.normalize('NFC').toLocaleLowerCase('tr-TR') === normalizedName,
    )

    if (isDuplicate) {
      setPersonError('Bu kişi zaten grupta.')
      return
    }

    const newPerson: Person = {
      id: `${Date.now()}-${normalizedName}`,
      name: trimmedName,
      initials: createInitials(trimmedName),
      tone: avatarTones[people.length % avatarTones.length],
    }

    updateActiveGroup((group) => ({
      ...group,
      people: [...group.people, newPerson],
    }))
    closePersonDialog()
  }

  const handleDeletePerson = (personId: string) => {
    updateActiveGroup((group) => ({
      ...group,
      people: group.people.filter((person) => person.id !== personId),
    }))
    setPersonToDelete(null)
  }

  const handleAddExpense = (expense: Expense) => {
    updateActiveGroup((group) => ({
      ...group,
      expenses: [...group.expenses, expense],
    }))
    setIsExpenseDialogOpen(false)
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    // ID korunarak yalnızca eşleşen kayıt değiştirilir; bu sayede harcama sayısı
    // ve kaydı referans alan mevcut akışlar değişmeden kalır.
    updateActiveGroup((group) => ({
      ...group,
      expenses: group.expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense,
      ),
    }))
    setExpenseToEdit(null)
  }

  const handleDeleteExpense = (expenseId: string) => {
    updateActiveGroup((group) => ({
      ...group,
      expenses: group.expenses.filter((expense) => expense.id !== expenseId),
    }))
    setExpenseToDelete(null)
  }

  const openAddExpenseDialog = () => {
    setExpenseToEdit(null)
    setIsExpenseDialogOpen(true)
  }

  const openEditExpenseDialog = (expense: Expense) => {
    setIsExpenseDialogOpen(false)
    setExpenseToEdit(expense)
  }

  const closeExpenseDialog = () => {
    setIsExpenseDialogOpen(false)
    setExpenseToEdit(null)
  }

  // İlişkili bir kişiyi sessizce silmek settlement bütünlüğünü bozacağı için,
  // hem ödeyen hem katılımcı ilişkileri silme onayından önce kontrol edilir.
  const isPersonToDeleteInUse = personToDelete
    ? expenses.some(
        (expense) =>
          expense.paidById === personToDelete.id ||
          expense.participantIds.includes(personToDelete.id),
      )
    : false

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0)

  return (
    <div className="app-shell">
      <Header onCreateGroup={() => setIsCreateGroupDialogOpen(true)} />

      <main id="top" className="page-container">
        {activeGroup ? (
          <>
            <GroupOverview
              groups={groups}
              activeGroupId={activeGroup.id}
              peopleCount={people.length}
              expenseCount={expenses.length}
              totalExpense={totalExpense}
              onGroupChange={handleGroupChange}
              onEditGroup={() => setIsEditGroupDialogOpen(true)}
              onDeleteGroup={() => setGroupToDelete(activeGroup)}
            />
            <PeopleSection
              people={people}
              onAddPerson={openPersonDialog}
              onDeletePerson={setPersonToDelete}
            />

            <div className="workspace-grid">
              <ExpenseSection
                expenses={expenses}
                people={people}
                onAddExpense={openAddExpenseDialog}
                onEditExpense={openEditExpenseDialog}
                onDeleteExpense={setExpenseToDelete}
              />
              <SettlementCard expenses={expenses} people={people} />
            </div>
          </>
        ) : (
          <section className="no-group-state" aria-labelledby="no-group-title">
            <h1 id="no-group-title">Henüz grup yok</h1>
            <p>Başlamak için ilk harcama grubunuzu oluşturun.</p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => setIsCreateGroupDialogOpen(true)}
            >
              Yeni Grup Oluştur
            </button>
          </section>
        )}
      </main>

      {isCreateGroupDialogOpen && (
        <CreateGroupDialog
          groups={groups}
          onClose={() => setIsCreateGroupDialogOpen(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {isEditGroupDialogOpen && activeGroup && (
        <EditGroupDialog
          group={activeGroup}
          groups={groups}
          onClose={() => setIsEditGroupDialogOpen(false)}
          onSave={handleUpdateGroupName}
        />
      )}

      {groupToDelete && (
        <DeleteGroupDialog
          group={groupToDelete}
          onClose={() => setGroupToDelete(null)}
          onConfirm={handleDeleteGroup}
        />
      )}

      {activeGroup && (
        <>
          <AddPersonDialog
            isOpen={isPersonDialogOpen}
            name={personName}
            error={personError}
            onNameChange={handlePersonNameChange}
            onClose={closePersonDialog}
            onSubmit={handleAddPerson}
          />

          {(isExpenseDialogOpen || expenseToEdit) && (
            <ExpenseDialog
              expense={expenseToEdit}
              people={people}
              onClose={closeExpenseDialog}
              onSave={expenseToEdit ? handleUpdateExpense : handleAddExpense}
            />
          )}

          <DeleteExpenseDialog
            expense={expenseToDelete}
            onClose={() => setExpenseToDelete(null)}
            onConfirm={handleDeleteExpense}
          />

          <DeletePersonDialog
            person={personToDelete}
            isInUse={isPersonToDeleteInUse}
            onClose={() => setPersonToDelete(null)}
            onConfirm={handleDeletePerson}
          />
        </>
      )}
    </div>
  )
}

export default App
