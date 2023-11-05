import express, { Express } from 'express'
import { createServer, Server as HttpServer } from 'http'
import cors from 'cors'
import { appWs } from '~/ws/app.ws'
import { crud } from '~/app.mvc'
import { initFolder } from '~/utils/file.utils'
import loadEnv from '~/security/env.security'
import { messageNotification } from '~/utils/messageNotification.utils'

export const app = () => {
  const app: Express = express()
  const server: HttpServer = createServer(app)
  app.use(express.json())
  app.use(cors())
  appWs(server)
  crud(app)
  initFolder()
  server.listen(loadEnv.output.PORT, () => {
    console.log(messageNotification(`Server is listening on port ${loadEnv.output.PORT}`))
  })
}
