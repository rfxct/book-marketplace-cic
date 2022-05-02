import { NextFunction, Request, Response } from 'express'
import jwt, { TokenExpiredError, JsonWebTokenError, JwtPayload } from 'jsonwebtoken'

import AuthException from '@exceptions/AuthException'
import SellerModel from '@models/SellerModel'

export default async function auth (req: Request, _res: Response, next: NextFunction) {
  if (!req.headers.authorization) throw new AuthException()
  const [, token] = req.headers.authorization.trim().split(/\s+/)

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.seller = await SellerModel.findById(id)
    
    if (!req.seller) throw new AuthException('A invalid token was provided')
  } catch (error: any) {
    if (error instanceof TokenExpiredError) throw new AuthException('A expired token was provided. Logiin again')
    if (error instanceof JsonWebTokenError) throw new AuthException('Provide a access token')
    if (error instanceof AuthException) throw error
    throw new AuthException()
  }
  return next()
}
