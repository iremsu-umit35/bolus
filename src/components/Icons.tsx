/**
 * Arayüz genelinde tekrar kullanılan küçük, bağımlılıksız SVG ikonlarını içerir.
 */
export function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 4.25v11.5M4.25 10h11.5" />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 10h11M11.25 5.75 15.5 10l-4.25 4.25" />
    </svg>
  )
}

export function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m13.7 3.8 2.5 2.5M4.25 15.75l.65-3.1L13.6 3.9a1.4 1.4 0 0 1 2 0l.5.5a1.4 1.4 0 0 1 0 2l-8.75 8.7-3.1.65Z" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.75 5.5h12.5M8 3.5h4M6 5.5l.6 10h6.8l.6-10M8.25 8v4.75M11.75 8v4.75" />
    </svg>
  )
}
