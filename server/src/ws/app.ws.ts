import { WebSocketServer } from 'ws'
import { Server } from 'http'
import { parse } from 'url'
import handleUserConnection from './handle_user.ws'

export function appWs(server: Server) {
  const wssUser = new WebSocketServer({ noServer: true })
  wssUser.on('connection', handleUserConnection.result)
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url as string)
    if (pathname === '/user') {
      wssUser.handleUpgrade(request, socket, head, (ws) => {
        wssUser.emit('connection', ws, request)
      })
    } else {
      socket.destroy()
    }
  })
}
