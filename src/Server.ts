import mongoose from 'mongoose'
import { Signale } from 'signale'

import app from './App'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default class Server {
  public app
  public log

  private connectionAttempts: number = 1
  private connectionAttemptsLimit = Number(process.env.CONNECTION_ATTEMPTS_LIMIT!) || 5
  private connectionAttemptsMS = Number(process.env.CONNECTION_ATTEMPTS_MS_TO_RETRY!) || 5000

  private applicationPort = process.env.PORT || 3000

  constructor () {
    this.app = app
    this.log = new Signale()
  }

  public async start () {
    await this.mongooseConnect()

    this.app.listen(this.applicationPort, () =>
      this.log.scope('Server').success('API started successfully')
    )
  }

  public async mongooseConnect () {
    // Tenta se conectar novamente ao banco de dados até que haja sucesso ou o limite de tentativas se exceda
    try {
      await mongoose.connect(process.env.MONGODB_URI!)
      this.log.scope('MongoDB').success('Successfully connected to database')
    } catch (error) {
      this.log
        .scope('MongoDB', `Attempt ${this.connectionAttempts} of ${this.connectionAttemptsLimit}`)
        .debug('Could not connect to MongoDB server. Reconnecting...')
    } finally {
      if (this.connectionAttempts === this.connectionAttemptsLimit && mongoose.connection.readyState === 0) {
        this.log.scope('MongoDB').fatal('Could not connect to MongoDB server')
        process.exit(1)
      }

      if (this.connectionAttempts < this.connectionAttemptsLimit && mongoose.connection.readyState === 0) {
        this.connectionAttempts++
        await sleep(this.connectionAttemptsMS)
        await this.mongooseConnect()
      }
    }
  }
}
