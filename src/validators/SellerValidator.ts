import { checkSchema } from 'express-validator'
import { validatePhone, validateCPF, validateCNPJ } from '@utils/validators'

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1).toLowerCase()

export default class AuthValidator {
  // Create
  public static create = checkSchema({
    name: {
      custom: {
        errorMessage: 'Provide only first and last name',
        options: (value) => /[a-z]{1,}\s+[a-z]{1,}/i.test(value)
      },
      customSanitizer: {
        options: (value) => value?.trim().split(/\s+/).map(capitalize).join(' ')
      }
    },
    phone: {
      custom: {
        errorMessage: 'Provide a valid phone(XX YYYYY-ZZZZ)',
        options: validatePhone
      }
    },
    email: {
      isEmail: { errorMessage: 'Provide a valid e-mail' }
    },
    password: {
      isLength: {
        errorMessage: 'Provide a 6+ digits password', options: { min: 6 }
      },
      custom: {
        errorMessage: 'Provide a alphanumeric password',
        options: (value) => /([a-z].*[0-9]|[0-9].*[a-z])/i.test(value)
      }
    },
    fiscal_document: {
      custom: {
        errorMessage: 'Provide a valid CPF (XXX.XXX.XXX-YY) or CNPJ(XX.XXX.XXX/0001-YY)',
        options: (value) => validateCPF(value) || validateCNPJ(value)
      }
    }
  })
}
