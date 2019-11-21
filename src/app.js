import 'dotenv/config'
import express from 'express'
import { resolve } from 'path'
import Youch from 'youch'
import * as Sentry from '@sentry/node'
import 'express-async-errors' // Tem que vir antes da importação das rotas
import routes from './routes'
import sentryConfig from './config/sentry'
import './database'

class App {
  constructor() {
    this.server = express()
    Sentry.init(sentryConfig)
    this.middlewares()
    this.routes()
    this.exceptionHandler()
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler())
    this.server.use(express.json())
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    )
  }

  routes() {
    this.server.use(routes)
    this.server.use(Sentry.Handlers.errorHandler())
  }

  /**
   * O Express entende que quando um middleware possui 4 parâmetros, o primeiro
   * é um error e toda vez que for lançada uma exception na applicação a
   * execução é direcionada para este middleware
   */
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON() // Ele tem um .HTML() tb
        return res.status(500).json(errors)
      }
      return res.status(500).json({ error: 'Internal server error' })
    })
  }
}

export default new App().server
