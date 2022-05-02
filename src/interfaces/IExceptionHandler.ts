import { NextFunction, Request, Response } from 'express'

export default interface IExceptionHandler {
  req: Request
  res: Response
  next: NextFunction
}
