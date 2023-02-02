import { Socket as WSocket } from 'socket.io'
const pty = require('node-pty')

// Global States.
// const terminals = {}
// const unsentOutput = {}
// const temporaryDisposable = {}

const ptySocket = (ws: WSocket) => {
  let login = false

  ws.once('disconnection', (reason) => {
    console.log(`[ptySocket] DISCONNECTING: ${reason}`)
    login = false
  })

  const newTerminal = () => {
    const env = Object.assign({}, process.env)
    env['COLORTERM'] = 'truecolor'
    env['PS1'] = 'w e[0;31m$e[m '
    console.log(env)
    // const env = {
    //   COLORTERM: 'truecolor',
    // }
    const cols = 80
    const rows = 24
    const ptyProcess = pty.spawn('bash', [], {
      name: 'xterm-256color',
      cols: cols || 80,
      rows: rows || 24,
      // cwd: process.env.PWD,
      cwd: '/home/user/dev/gits/standalone/CODE',
      env: env,
      encoding: null, // or 'utf8'
    })

    console.log('Created terminal with PID: ' + ptyProcess.pid)

    ws.once('disconnect', (reason) => {
      console.log(`[ptySocket] disconnect: ${reason}`)
    })
    ws.on('error', (errMsg) => {
      console.log(`[ptySocket] disconnect: ${errMsg}`)
      // conn.end()
      ws.disconnect(true)
    })
    ws.on('control', (controlData) => {
      console.log(`[ptySocket] disconnect: ${controlData}`)
    })
    ws.on('resize', (data) => {
      ptyProcess.resize(data.cols, data.rows)
      // term.setWindow(data.rows, data.cols)
      // console.log(`[ptySocket] resize`, data)
    })
    ws.on('data', (data) => {
      ptyProcess.write(data)
    })
    ptyProcess.on('data', (data) => {
      ws.emit('data', data.toString('utf-8'))
    })
    ptyProcess.on('close', (code, signal) => {
      console.log(`[ptySocket] disconnect: ${code} ${signal}`)
      ws.disconnect(true)
    })
    // term.stderr.on('data', (data) => {
    //   console.error(`STDERR: ${data}`)
    // })
    /*
    this.terminals[term.pid] = term
    this.unsentOutput[term.pid] = ''
    this.temporaryDisposable[term.pid] = term.onData((data) => {
      socket.emit('data', data.toString())
      console.log('onData', data.toString())
      this.unsentOutput[term.pid] += data
    })
    */
  }
  newTerminal()
}

export default ptySocket
/*

import { readFileSync } from 'fs'
import { Server, Socket } from 'socket.io'
import { Client as SSH } from 'ssh2'

const util = require('util')
const webssh2debug = (...args) => console.log('webssh2debug', args)
const auditLog = (...args) => console.log('auditLog', args)
const checkSubnet = (...args) => console.log('checkSubnet', args)
const logError = (...args) => console.log('logError', args)
const debug = (...args) => console.log('debug', args)

function connError(socket, err) {
  let msg = util.inspect(err)
  const { session } = socket.request
  if (err?.level === 'client-authentication') {
    msg = `Authentication failure user=${session.username} from=${socket.handshake.address}`
    socket.emit('allowreauth', session.ssh.allowreauth)
    socket.emit('reauth')
  }
  if (err?.code === 'ENOTFOUND') {
    msg = `Host not found: ${err.hostname}`
  }
  if (err?.level === 'client-timeout') {
    msg = `Connection Timeout: ${session.ssh.host}`
  }
  logError(socket, 'CONN ERROR', msg)
}

module.exports = function appSocket(socket) {
  let login = false

  socket.once('disconnecting', (reason) => {
    webssh2debug(socket, `SOCKET DISCONNECTING: ${reason}`)
    if (login === true) {
      auditLog(
        socket,
        `LOGOUT user=${socket.request.session.username} from=${socket.handshake.address} host=${socket.request.session.ssh.host}:${socket.request.session.ssh.port}`,
      )
      login = false
    }
  })

  async function setupConnection() {


    const conn = new SSH()



    conn.on('ready', () => {
      login = true

      socket.request.session = configDefault
      const { term, cols, rows } = socket.request.session.ssh

      conn.shell({ term, cols, rows }, (err, stream) => {
        if (err) {
          logError(socket, `EXEC ERROR`, err)
          conn.end()
          socket.disconnect(true)
          return
        }
        socket.once('disconnect', (reason) => {
          webssh2debug(socket, `CLIENT SOCKET DISCONNECT: ${util.inspect(reason)}`)
          conn.end()
          //socket.request.session.destroy()
        })
        socket.on('error', (errMsg) => {
          webssh2debug(socket, `SOCKET ERROR: ${errMsg}`)
          logError(socket, 'SOCKET ERROR', errMsg)
          conn.end()
          socket.disconnect(true)
        })
        socket.on('control', (controlData) => {
          if (controlData === 'replayCredentials' && socket.request.session.ssh.allowreplay) {
            stream.write(`${socket.request.session.userpassword}\n`)
          }
          if (controlData === 'reauth' && socket.request.session.username && login === true) {
            auditLog(
              socket,
              `LOGOUT user=${socket.request.session.username} from=${socket.handshake.address} host=${socket.request.session.ssh.host}:${socket.request.session.ssh.port}`,
            )
            login = false
            conn.end()
            socket.disconnect(true)
          }
          webssh2debug(socket, `SOCKET CONTROL: ${controlData}`)
        })
        socket.on('resize', (data) => {
          stream.setWindow(data.rows, data.cols)
          webssh2debug(socket, `SOCKET RESIZE: ${JSON.stringify([data.rows, data.cols])}`)
        })
        socket.on('data', (data) => {
          stream.write(data)
        })
        stream.on('data', (data) => {
          socket.emit('data', data.toString('utf-8'))
        })
        stream.on('close', (code, signal) => {
          webssh2debug(socket, `STREAM CLOSE: ${util.inspect([code, signal])}`)
          if (socket.request.session?.username && login === true) {
            auditLog(
              socket,
              `LOGOUT user=${socket.request.session.username} from=${socket.handshake.address} host=${socket.request.session.ssh.host}:${socket.request.session.ssh.port}`,
            )
            login = false
          }
          if (code !== 0 && typeof code !== 'undefined')
            logError(socket, 'STREAM CLOSE', util.inspect({ message: [code, signal] }))
          socket.disconnect(true)
          conn.end()
        })
        stream.stderr.on('data', (data) => {
          console.error(`STDERR: ${data}`)
        })
      })
    })

    conn.on('end', (err) => {
      if (err) logError(socket, 'CONN END BY HOST', err)
      webssh2debug(socket, 'CONN END BY HOST')
      socket.disconnect(true)
    })
    conn.on('close', (err) => {
      if (err) logError(socket, 'CONN CLOSE', err)
      webssh2debug(socket, 'CONN CLOSE')
      socket.disconnect(true)
    })
    conn.on('error', (err) => connError(socket, err))

    conn.on('keyboard-interactive', (_name, _instructions, _instructionsLang, _prompts, finish) => {
      webssh2debug(socket, 'CONN keyboard-interactive')
      finish([socket.request.session.userpassword])
    })
    if (
      true ||
      (socket.request.session.username &&
        (socket.request.session.userpassword || socket.request.session.privatekey) &&
        socket.request.session.ssh)
    ) {


      const config = {
        host: 'adj.hijk.dev',
        port: 443,
        username: 'ec2-user',
        privateKey: readFileSync('/home/user/.my/pki/jh.pem'),
      }
      conn.connect(config)
      console.log('JH SSH connect socket.js:231')
    } else {
      webssh2debug(
        socket,
        `CONN CONNECT: Attempt to connect without session.username/password or session varialbles defined, potentially previously abandoned client session. disconnecting websocket client.\r\nHandshake information: \r\n  ${util.inspect(
          socket.handshake,
        )}`,
      )
      socket.emit('ssherror', 'WEBSOCKET ERROR - Refresh the browser and try again')
      socket.request.session.destroy()
      socket.disconnect(true)
    }
  }
  setupConnection()
}


*/
