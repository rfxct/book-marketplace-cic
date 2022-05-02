/* eslint-disable no-unused-vars */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      CONNECTION_ATTEMPTS_LIMIT: string
      CONNECTION_ATTEMPTS_MS_TO_RETRY: string
      BCRYPT_SALT_ROUNDS: string
      PAGINATION_ITEMS_LIMIT: string
      JWT_SECRET: string
    }
  }
}

export { }
