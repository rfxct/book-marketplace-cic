import { Schema, model, mongo } from 'mongoose'
import { EMAIL_PATTERN } from '@utils/regexp'
import { validatePhone, validateCPF, validateCNPJ } from '@utils/validators'

const SellerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Provide a string value for `name`']
  },
  email: {
    type: String,
    required: [true, 'Provide a string value for `e-mail`'],
    match: [EMAIL_PATTERN, 'The `e-mail` is invalid'],
    unique: [true, 'E-mail already in use']
  },
  phone: {
    required: [true, 'Provide a string value for `phone`'],
    type: String,
    set: (value: string) => value.replace(/\+55|[^\d]/g, '').replace(/^0/, ''),
    validate: [validatePhone, 'The `phone` isn\'t in a valid format']
  },
  fiscal_document: {
    required: [true, 'Provide a string value for `fiscal_document`'],
    type: String,
    set: (value: string) => `${documentType(value)}:${value.replace(/[^\d]/g, '')}`,
    validate: {
      validator: documentType,
      message: 'Provide a valid `CPF` or `CNPJ`'
    },
    unique: [true, '`CPF` or `CNPJ` already in use']
  },
  password: {
    type: String,
    required: [true, 'Provide a string value for `password`']
  },
  api_signature: {
    type: Schema.Types.ObjectId,
    default: new mongo.ObjectId()
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

function documentType (value: string) {
  return validateCPF(value) ? 'cpf' : validateCNPJ(value) ? 'cnpj' : false
}

export default model('Seller', SellerSchema)
