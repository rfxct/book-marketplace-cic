import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import * as csv from '@utils/csv'

import AuthException from '@exceptions/AuthException'
import GenericException from '@exceptions/GenericException'

import SellerModel from '@models/SellerModel'
import IBookCsv from '@interfaces/IBookCsv'
import BookModel from '@models/BookModel'

export default class SellerControler {
  public static async create(req: Request, res: Response) {
    const { email, password: rawPassword, ...data } = req.body

    const emailAlreadyUsed = await SellerModel.findOne({ email })
    if (emailAlreadyUsed) {
      throw new GenericException('The e-mail provided already in use', 409, 'EMAIL_ALREADY_IN_USE')
    }

    const fiscalDocument = data.fiscalDocument.replace(/[^\d]/g, '')
    const fiscalDocumentAlreadyUsed = await SellerModel.findOne({
      fiscalDocument: { $regex: `(cpf|cnpj)\\:${fiscalDocument}`, $options: 'i' }
    })
    if (fiscalDocumentAlreadyUsed) {
      throw new GenericException('The fiscalDocument provided already in use', 409, 'FISCAL-DOCUMENT_ALREADY_IN_USE')
    }

    const password = await bcrypt.hash(rawPassword, Number(process.env.BCRYPT_SALT_ROUNDS) || 5)
    const { _doc: document } = await SellerModel.create({ email, password, ...data })

    const sanitized = _.omitBy({ ...document, password: null }, _.isNull)

    res.status(201).json({
      message: 'Seller created successfully',
      seller: sanitized
    })
  }

  public static async login(req: Request, res: Response) {
    const { email, password } = req.body

    const seller = await SellerModel.findOne({ email }, 'email password')
    const passwordIsValid = !!seller?.password && await bcrypt.compare(password, seller.password)
    if (!passwordIsValid) throw new AuthException('The access credentials are invalid')

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.status(200).send({ token })
  }

  public static async catalog({ file, seller }: Request, res: Response) {
    const rawCatalog = file?.buffer && file.buffer.toString('utf-8')
    if (!csv.isValid(rawCatalog)) throw new GenericException('The csv provided is invalid')

    const catalog: IBookCsv[] = csv.parse(rawCatalog)

    const receivedKeys = Object.keys(catalog[0])
    const allowedKeys = ['title', 'authors', 'numPages', 'publicationDate', 'publisher', 'price']

    if (receivedKeys.length !== allowedKeys.length || receivedKeys.some(k => !allowedKeys.includes(k))) {
      throw new GenericException(`This route only accept csv with the following keys: ${allowedKeys}`)
    }

    const toInsert = catalog.map(({ numPages, price, ...book }) => ({
      sellerId: seller._id,
      numPages: parseInt(numPages),
      price: parseFloat(price), 
      ...book
    }))
    
    const addedBooks = await BookModel.insertMany(toInsert)
    res.send(addedBooks)
  }
}
