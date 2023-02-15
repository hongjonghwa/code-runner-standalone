import { Logger } from '@nestjs/common'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CodesService } from './codes.service'

// import pty from 'node-pty'
const pty = require('node-pty')

// const appSocket = require('./ssh2socket')

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    // credentials: false,
  },
  namespace: 'codes',
})
export class CodesGateway {
  private readonly logger = new Logger(CodesGateway.name)

  constructor(private readonly codesService: CodesService) {}

  @WebSocketServer()
  server: Server

  // lifecycle
  afterInit() {
    this.logger.log(`WebSocket initialized`)
  }
  totalWebSocketConnectionCount = 0
  handleConnection(socket) {
    this.totalWebSocketConnectionCount++
    this.logger.log(`socket connected: ${socket.id}`)
    this.logger.log(`total socket #: ${this.totalWebSocketConnectionCount}`)
  }
  handleDisconnect(socket) {
    this.totalWebSocketConnectionCount--
    this.logger.log(`socket connected: ${socket.id}`)
    this.logger.log(`total socket #: ${this.totalWebSocketConnectionCount}`)
  }

  @SubscribeMessage('terminal')
  async terminal(
    @MessageBody('codeId') codeId: string,
    @MessageBody('actionId') actionId: number,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`connect terminal - codeID ${codeId} actionID ${actionId}: ${socket.id}`)
    this.codesService.bindTerminal(socket, codeId, actionId)
  }

  // @SubscribeMessage('ping')
  // ping(@MessageBody() data: any, @ConnectedSocket() connectedSocket: any) {
  //   this.server.emit('pong') // send to all client
  //   connectedSocket.emit('pong') // send to connected client
  //   console.log('codes.gateway ping', data, connectedSocket.id)
  // }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   console.log('codes.gateway.events')
  //   return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })))
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   console.log('codes.gateway.identity')
  //   return data
  // }
}
