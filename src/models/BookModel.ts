import { Schema, model } from 'mongoose'
import removeDiacritics from '@utils/removeDiacritics'


const BookSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: [true, 'Provide a seller id for `sellerId`']
  },
  title: {
    type: String,
    required: [true, 'Provide a string value for `title`']
  },
  authors: {
    type: String,
    required: [true, 'Provide a valid string value for `authors']
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
    type: Date,
    required: [true, 'Provide a date value to `publicationDate`']
  },
  publisher: {
    type: String,
    required: [true, 'Provide a string value for `publisher`']
  },
  searchablePublisher: {
    type: String,
    set: removeDiacritics,
    default: function () {
      return removeDiacritics((this as any).publisher)
    }
  },
  price: {
    type: Number,
    required: [true, 'Provide a decimal value for `price`'],
    validate: {
      validator: (value: number) => value >= 0,
      message: 'The value for `price` must be greater than or equal 0'
    }
  },
  fileName: {
    type: String,
    default: null
  }
})

BookSchema.pre('save', function (next) {
  this.searchablePublisher = removeDiacritics(this.publisher)
  next()
})

function checkNumber(value: number) {
  return value > 0
}
export default model('Book', BookSchema)
