import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import AuthException from '@exceptions/AuthException'
import GenericException from '@exceptions/GenericException'

import SellerModel from '@models/SellerModel'

export default class SellerControler {
  public static async create (req: Request, res: Response) {
    const { email, password: rawPassword, ...data } = req.body

    // TODO: remover essa linha de debug
    await SellerModel.deleteOne({ email })

    const emailAlreadyUsed = await SellerModel.findOne({ email })
    if (emailAlreadyUsed) {
      throw new GenericException('The e-mail provided already in use', 409, 'EMAIL_ALREADY_IN_USE')
    }

    const fiscalDocument = data.fiscal_document.replace(/[^\d]/g, '')
    const fiscalDocumentAlreadyUsed = await SellerModel.findOne({
      fiscal_document: { $regex: `(cpf|cnpj)\\:${fiscalDocument}`, $options: 'i' }
    })
    if (fiscalDocumentAlreadyUsed) {
      throw new GenericException('The fiscal_document provided already in use', 409, 'FISCAL-DOCUMENT_ALREADY_IN_USE')
    }

    const password = await bcrypt.hash(rawPassword, Number(process.env.BCRYPT_SALT_ROUNDS) || 5)
    const { _doc: document } = await SellerModel.create({ email, password, ...data })

    const sanitized = _.omitBy({ ...document, password: null, api_signature: null }, _.isNull)

    res.status(201).json({
      message: 'Seller created successfully',
      user: sanitized
    })
  }

  public static async login (req: Request, res: Response) {
    const { email, password } = req.body

    const seller = await SellerModel.findOne({ email }, 'api_signature email password')
    const passwordIsValid = !!seller?.password && await bcrypt.compare(password, seller.password)
    if (!passwordIsValid) throw new AuthException('The access credentials are invalid')

    const token = jwt.sign({ id: seller._id, sign: seller.api_signature }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.status(200).send({ token })
  }
}
