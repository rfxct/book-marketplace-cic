export default function removeDiacritics (value?: string) {
  return typeof value === 'string' ? value.trim().normalize('NFD').replace(/[\u0300-\u036f]|[^a-z\s]/ig, '').toLowerCase() : ''
}
