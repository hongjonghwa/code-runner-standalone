import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets'
import { readFileSync } from 'fs'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import ptySocket from './ptySocket'

// import pty from 'node-pty'
const pty = require('node-pty')

// const appSocket = require('./ssh2socket')

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    // credentials: false,
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  // lifecycle
  afterInit() {
    console.log(`init 접속`)
  }
  totalWebSocketConnectionCount = 0
  handleConnection(socket) {
    this.totalWebSocketConnectionCount++
    console.log(`${socket.id} 접속, total ${this.totalWebSocketConnectionCount}`)
  }
  handleDisconnect(socket) {
    this.totalWebSocketConnectionCount--
    console.log(`${socket.id} 해제, total ${this.totalWebSocketConnectionCount}`)
  }


  @SubscribeMessage('terminal')
  async terminal(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log(`terminal - ${socket.id}`)
    ptySocket(socket)
  }

  @SubscribeMessage('connection')
  connection(@MessageBody() data: any) {
    console.log('events.gateway connection')
  }

  @SubscribeMessage('disconnect')
  disconnect(@MessageBody() data: any) {
    console.log('events.gateway disconnect')
  }

  @SubscribeMessage('input')
  input(@MessageBody() data: any) {
    console.log('events.gateway input', data)
  }

  @SubscribeMessage('ping')
  ping(@MessageBody() data: any, @ConnectedSocket() connectedSocket: any) {
    // this.server.emit("pong"); // send to all client
    // connectedSocket.emit("pong"); // send to connected client
    connectedSocket.emit('pong')
    console.log('events.gateway ping', data, connectedSocket.id)
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })))
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data
  }
}
