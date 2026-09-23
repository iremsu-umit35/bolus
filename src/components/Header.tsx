/**
 * Uygulama markasını ve yeni grup oluşturma aksiyonunu içeren üst çubuktur.
 */
import { PlusIcon } from './Icons'

type HeaderProps = {
  onCreateGroup: () => void
}

export function Header({ onCreateGroup }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="Bölüş ana sayfa">
          <span className="brand-mark" aria-hidden="true">B</span>
          <strong>Bölüş</strong>
        </a>
        <button
          className="button button-secondary header-action"
          type="button"
          onClick={onCreateGroup}
        >
          <PlusIcon />
          <span>Yeni Grup</span>
        </button>
      </div>
    </header>
  )
}
