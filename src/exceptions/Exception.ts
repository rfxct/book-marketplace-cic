import IExceptionHandler from '@interfaces/IExceptionHandler'
import { Response } from 'express'

export default abstract class Exception {
  message: string
  status: number
  code: string

  constructor (message: string, status: number, code: string) {
    this.message = message
    this.status = status
    this.code = code
  }

  respondWithJSON (res: Response, data?: Object) {
    res.status(this.status).json({ code: this.code, message: this.message, ...data })
  }

  abstract handle ({ res, req, next }: IExceptionHandler): void
}
