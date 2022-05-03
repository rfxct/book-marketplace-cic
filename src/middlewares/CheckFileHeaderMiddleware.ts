import { NextFunction, Request, Response } from 'express'

import GenericException from '@exceptions/GenericException'

export default async function auth(req: Request, _res: Response, next: NextFunction) {
  console.log(req.headers['content-type'])
  if (!req.headers['content-type']?.toLowerCase().includes('multipart/form-data')) {
    throw new GenericException('Content-Type must be multipart/form-data', 400)
  }
  return next()
}
