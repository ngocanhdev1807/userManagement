import { Express } from 'express'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'

export const crud = (app: Express) => {
  app.use('/users', usersRouter)

  app.use(defaultErrorHandler)
}
