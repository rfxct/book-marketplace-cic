import IExceptionHandler from '@interfaces/IExceptionHandler'
import Exception from './Exception'

export default class LoginException extends Exception {
  constructor (
    message: string = 'You need to be authenticated to access this feature',
    status: number = 401,
    code: string = 'UNAUTHORIZED_ACCESS'
  ) {
    super(message, status, code)
  }

  handle ({ res }: IExceptionHandler) {
    this.respondWithJSON(res)
  }
}
