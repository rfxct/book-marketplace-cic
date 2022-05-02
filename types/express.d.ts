/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

declare namespace Express {
  export interface Request {
    user: {
      _id: string
      name: string
      email: string
      phone: string
      password: string
      fiscal_document: string
    }
  }
}
