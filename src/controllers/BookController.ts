import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'

import BookModel from '@models/BookModel'
import GenericException from '@exceptions/GenericException'

import IBookCsv from '@interfaces/IBookCsv'
import IPDFReaderResult from '@interfaces/IPDFReaderResult'

import removeDiacritics from '@utils/removeDiacritics'
import * as csv from '@utils/csv'
import * as pdf from '@utils/pdf'

export default class BookController {
  // Listar livros
  public static async index(req: Request, res: Response) {
    const { publisher, minPrice = 0, maxPrice = Infinity, priceOrder, publicationOrder } = req.query

    const sortOptions = Object.fromEntries([
      priceOrder ? ['price', parseInt(priceOrder as string)] : [],
      publicationOrder ? ['publicationDate', parseInt(publicationOrder as string)] : []
    ].filter(entrie => entrie.length))

    const books = await BookModel.aggregate([
      {
        $match: {
          price: { $gte: minPrice, $lte: maxPrice },
          searchablePublisher: { $regex: `^.*${removeDiacritics(publisher as string)}.*$`, $options: 'gi' }
        }
      },
      {
        $lookup: {
          from: BookModel.collection.name,
          let: { referenceTitle: '$title', referenceAuthors: '$authors', referenceId: '$_id', referencePrice: '$price' },
          as: 'bestPrice',
          pipeline: [
            {
              $match: {
                $expr: {
                  // Seleciona livros com o mesmo título, autor e com preço inferior
                  $and: [
                    { $eq: ['$$referenceTitle', '$title'] },
                    { $eq: ['$$referenceAuthors', '$authors'] },
                    { $lt: ['$price', '$$referencePrice'] }]
                }
              }
            },
            // Organiza do menor para o maior
            { $sort: { price: 1 } },
            // Exibe os 3 livros mais baratos
            { $limit: 3 },
            { $project: { _id: 1, seller: 1, title: 1, authors: 1, price: 1 } }
          ]
        }
      }
    ]).sort(sortOptions)

    res.status(200).json(books)
  }

  // Upload catálogo
  public static async uploadCatalog({ file, seller }: Request, res: Response) {
    const rawCatalog = file?.buffer && file.buffer.toString('utf-8')
    if (!csv.isValid(rawCatalog)) throw new GenericException('The csv provided is invalid. Upload a csv catalog using `catalog` field', 400)

    const catalog: IBookCsv[] = csv.parse(rawCatalog)

    const receivedKeys = Object.keys(catalog[0])
    const allowedKeys = ['title', 'authors', 'numPages', 'publicationDate', 'publisher', 'price']

    if (receivedKeys.length !== allowedKeys.length || receivedKeys.some(k => !allowedKeys.includes(k))) {
      throw new GenericException(`This route only accept csv with the following keys: ${allowedKeys}`)
    }

    const toInsert = catalog.map(({ numPages, publicationDate, price, ...book }) => ({
      seller: seller._id,
      numPages: parseInt(numPages),
      price: parseFloat(price),
      publicationDate: new Date(publicationDate),
      ...book
    }))

    const addedBooks = await BookModel.insertMany(toInsert)
    res.status(201).json(addedBooks)
  }

  // Upload livro
  public static async uploadBook({ file, seller }: Request, res: Response) {
    const rawBook = file?.buffer && file.buffer
    if (!rawBook) throw new GenericException('The pdf provided is invalid. Upload a pdf book using `book` field', 400, 'BAD_REQUEST')

    const result = await pdf.parse(rawBook) as IPDFReaderResult
    if (result.error) throw new GenericException(result?.message, result?.code)

    const fileName = `${uuidv4()}.pdf`
    const pathName = path.join('static', 'books', String(seller._id))
    await fs.mkdir(pathName, { recursive: true })
    await fs.writeFile(path.join(pathName, fileName), rawBook)

    const query = {
      $and: [{ seller: seller._id }],
      $or: result.data.filter(Boolean).map(text => ({ title: text.trim() }))
    }

    const matchedBooks = await BookModel.count(query)
    if (!matchedBooks) throw new GenericException('The uploaded book wasn\'t found in catalog', 404, 'BAD_REQUEST')
    
    const updateInfo = await BookModel.updateMany(query, { fileName })
    const books = await BookModel.find(query)

    res.status(201).json({
      message: `PDF added successfully to ${updateInfo.modifiedCount} document(s)`,
      books
    })
  }

  // Download livro
  public static async downloadBook(req: Request, res: Response) {
    const { bookId } = req.params

    const book = await BookModel.findOne({ _id: bookId })
    if (!book) throw new GenericException('Invalid bookId was provided', 404, 'NOT_FOUND')
    if (!book.fileName) throw new GenericException('Requested book isn\'t available for download', 404, 'NOT_FOUND')

    const fullPath = path.resolve('static', 'books', String(book.seller), book.fileName)
    const downloadFileName =book.title.replace(/\s/g, '_').replace(/[^\w]/, '')
    
    res.status(200).download(fullPath, `${downloadFileName}.pdf`)
  }
}
