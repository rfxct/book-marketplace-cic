import { NextFunction, Request, Response } from 'express'

import Exception from '@exceptions/Exception'
import MongooseValidationException from '@exceptions/MongooseValidationException'

export default function handleError (error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof Exception) return error.handle({ req, res, next })
  if (error?.constructor.name === 'ValidationError') {
    const exception = new MongooseValidationException(error)
    return exception.handle({ req, res, next })
  }

  console.error(error)
  res.status(500).json({ messsage: 'Internal error' })
}
