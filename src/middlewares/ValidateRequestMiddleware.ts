import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

import ValidatorException from '@exceptions/ValidatorException'

export default function validateRequest (req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) throw new ValidatorException(errors)
  next()
}
