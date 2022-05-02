import { Schema, model } from 'mongoose'

const BookSchema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Provide a seller id for `sellerId`']
  },
  title: {
    type: String,
    required: [true, 'Provide a string value for `title`']
  },
  authors: {
    type: Array,
    required: [true, 'Provide a valid string-array value for `authors'],
    validate: {
      validator: (value: unknown) => Array.isArray(value) && value.every(item => typeof item === 'string'),
      message: 'The `authors` array must be string-only'
    }
  },
  numPages: {
    type: Number,
    set: Math.ceil,
    required: [true, 'Provide a integer value to `numPages`'],
    validate: {
      validator: checkNumber,
      message: 'The value for `numPages` must be greater than 0'
    }
  },
  publicationDate: {
    type: String,
    required: [true, 'Provide a string value to `publicationDate`']
  },
  publisher: {
    type: String,
    required: [true, 'Provide a string value for `publisher`']
  },
  price: {
    type: Number,
    required: [true, 'Provide a decimal value for `price`'],
    validate: {
      validator: (value: number) => value >= 0,
      message: 'The value for `price` must be greater than or equal 0'
    }
  }
})

function checkNumber (value: number) {
  return value > 0
}

export default model('Book', BookSchema)
