import { Result, ValidationError } from 'express-validator'
import IExceptionHandler from '@interfaces/IExceptionHandler'
import Exception from './Exception'

export default class ValidatorException extends Exception {
  public errors

  constructor (
    errors: Result<ValidationError>,
    message: string = 'Invalid data was provided',
    status: number = 400,
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, status, code)

    this.errors = errors
  }

  handle ({ res }: IExceptionHandler) {
    const errors = this.errors.formatWith(({ value, msg: message, param }) => ({
      param, message, value
    })).array()

    this.respondWithJSON(res, { errors })
  }
}
