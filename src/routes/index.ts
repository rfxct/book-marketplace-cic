import 'express-async-errors'
import { Router } from 'express'

import multer from 'multer'

import ValidateRequestMiddleware from '@middlewares/ValidateRequestMiddleware'
import AuthMiddleware from '@middlewares/AuthMiddleware'

import SellerController from '@controllers/SellerController'
import SellerValidator from '@validators/SellerValidator'

const router = Router()
const upload = multer({
  limits: { fileSize: 10 * 1e+6 /* 10MB */ }
})

// Seller
router.post('/api/sellers', SellerValidator.create, ValidateRequestMiddleware, SellerController.create)
router.post('/api/sellers/login', SellerValidator.login, ValidateRequestMiddleware, SellerController.login)

router.post('/api/sellers/catalog', AuthMiddleware, upload.single('catalog'), SellerController.catalog)

export default router
