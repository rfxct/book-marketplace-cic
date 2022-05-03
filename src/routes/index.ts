import 'express-async-errors'
import { Router } from 'express'

import multer from 'multer'

import ValidateRequestMiddleware from '@middlewares/ValidateRequestMiddleware'
import AuthMiddleware from '@middlewares/AuthMiddleware'
import CheckFileHeaderMiddleware from '@middlewares/CheckFileHeaderMiddleware'

import SellerController from '@controllers/SellerController'
import SellerValidator from '@validators/SellerValidator'

import BookController from '@controllers/BookController'

const router = Router()
const upload = multer({
  limits: { fileSize: 10 * 1e+6 /* 10MB */ }
})

// Seller
router.post('/api/sellers', SellerValidator.create, ValidateRequestMiddleware, SellerController.create)
router.post('/api/sellers/login', SellerValidator.login, ValidateRequestMiddleware, SellerController.login)

// Book
router.get('/api/books', AuthMiddleware, BookController.index)
router.post('/api/books', AuthMiddleware, CheckFileHeaderMiddleware, upload.single('book'), BookController.uploadBook)
router.post('/api/books/catalog', AuthMiddleware, CheckFileHeaderMiddleware, upload.single('catalog'), BookController.uploadCatalog)

router.get('/api/books/download/:bookId', BookController.downloadBook)

export default router
