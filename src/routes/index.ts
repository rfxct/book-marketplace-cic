import 'express-async-errors'
import { Router } from 'express'

import ValidateRequestMiddleware from '@middlewares/ValidateRequestMiddleware'
// import AuthMiddleware from '@middlewares/AuthMiddleware'

import SellerController from '@controllers/SellerController'
import SellerValidator from '@validators/SellerValidator'

const router = Router()

// Seller
router.post('/api/seller', SellerValidator.create, ValidateRequestMiddleware, SellerController.create)

export default router
