import IExceptionHandler from '@interfaces/IExceptionHandler'
import Exception from './Exception'

export default class GenericException extends Exception {
  constructor (
    message: string = 'Internal error',
    status: number = 500,
    code: string = 'INTERNAL_ERROR'
  ) {
    super(message, status, code)
  }

  handle ({ res }: IExceptionHandler) {
    this.respondWithJSON(res)
  }
}
