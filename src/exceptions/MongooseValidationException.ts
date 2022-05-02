import IExceptionHandler from '@interfaces/IExceptionHandler'
import IModelValidatorError from '@interfaces/IModelValidatorError'
import Exception from './Exception'

export default class MongooseValidationException extends Exception {
  public errors

  constructor (
    { errors }: IModelValidatorError,
    message: string = 'Some data is missing',
    status: number = 400,
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, status, code)

    this.errors = errors
  }

  handle ({ res }: IExceptionHandler) {
    const errors = Object.values(this.errors).map(err => ({
      param: err.path, message: err.properties.message
    }))

    this.respondWithJSON(res, { errors })
  }
}
