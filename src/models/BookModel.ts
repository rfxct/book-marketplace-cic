import { Schema, model } from 'mongoose'

const BookSchema = new Schema({
  seller_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Provide a seller id for `seller_id`']
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
  pages: {
    type: Number,
    set: Math.ceil,
    required: [true, 'Provide a integer value to `pages`'],
    validate: {
      validator: checkNumber,
      message: 'The value for `pages` must be greater than 0'
    }
  },
  publication_date: {
    type: Number,
    required: [true, 'Provide a integer value to `publication_date`'],
    validate: {
      validator: checkNumber,
      message: 'The value for `publication_date` must be greater than 0'
    }
  },
  publisher: {
    type: String,
    required: [true, 'Provide a string value for `publisher`']
  },
  price: {
    type: String,
    required: [true, 'Provide a decimal value for `price`'],
    validate: {
      validator: (value: number) => value >= 0,
      message: 'The value for `publication_date` must be greater than or equal 0'
    }
  }
})

function checkNumber (value: number) {
  return value > 0
}

export default model('Book', BookSchema)
