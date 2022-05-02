import 'express-async-errors'
import { Router } from 'express'

import multer from 'multer'

import ValidateRequestMiddleware from '@middlewares/ValidateRequestMiddleware'
import AuthMiddleware from '@middlewares/AuthMiddleware'

import SellerController from '@controllers/SellerController'
import SellerValidator from '@validators/SellerValidator'

const router = Router()
const upload = multer({
  limits: { fileSize: 50 * 1e+6 /* 50MB */ }
})

// Seller
router.post('/api/sellers', Validator.create, ValidateRequestMiddleware, Controller.create)
router.post('/api/sellers/login', SellerValidator.login, ValidateRequestMiddleware, SellerController.login)

router.post('/api/sellers/catalog', AuthMiddleware, upload.single('catalog'), (req, res) => {
  console.log(req.file?.buffer.toString('utf-8'))
  res.send('ok')
})

export default router
