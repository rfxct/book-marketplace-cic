export default function removeDiacritics (value: string) {
  return typeof value === 'string' ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : ''
}
