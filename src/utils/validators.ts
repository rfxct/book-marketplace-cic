import { PHONE_PATTERN } from './regexp'

// https://gist.github.com/rfxct/8761501e0d0f6fe6c41873981ea6158d
export function validateCPF (value: string) {
  const cpf = value.replace(/[^\d]/g, '')

  if (cpf.length !== 11 || /^(\d)\1{10}/.test(cpf)) return false

  for (let toVerify = 9; toVerify < 11; toVerify++) {
    let accumulator = 0

    for (let i = 0; i < toVerify; i++) {
      accumulator += Number(cpf[i]) * ((toVerify + 1) - i)
    }

    const digit = accumulator % 11 < 2 ? 0 : 11 - accumulator % 11
    if (Number(cpf[toVerify]) !== digit) return false
  }

  return true
}

// https://gist.github.com/rfxct/b33dc79bcda858cb4c2af2b81acd3eed
export function validateCNPJ (value: string) {
  const cnpj = value.replace(/[^\d]/g, '')
  const multipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  if (cnpj.length !== 14 || /^(\d)\1{13}/.test(cnpj)) return false

  for (let toVerify = 12; toVerify < 14; toVerify++) {
    let accumulator = 0

    for (let i = 0; i < toVerify; i++) {
      accumulator += Number(cnpj[i]) * multipliers[toVerify === 12 ? i + 1 : i]
    }

    const digit = accumulator % 11 < 2 ? 0 : 11 - accumulator % 11
    if (Number(cnpj[toVerify]) !== digit) return false
  }

  return true
}

export function validatePhone (value: string) {
  const rawPhone = value.replace(/\+55|[^\d]/g, '').replace(/^0/, '')
  return PHONE_PATTERN.test(rawPhone)
}
