import React, { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import { Terminal as Xterm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import io, { Socket } from 'socket.io-client'

const serverAddress = 'http://localhost:2222'

//     const socket = io(serverAddress,{
//       cors: { origin: '*' }
//     });
// const socket1 = io(serverAddress);

function SshTerminal() {
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = new Xterm()
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(myRef.current!)
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    fitAddon.fit()

    const newSocket = io(serverAddress, {})

    newSocket.on('connect', () => {
      console.log('socket on connect')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      // server 끊어짐
      console.log('socket on disconnect')
      setIsConnected(false)
    })

    newSocket.on('data', (data) => {
      term.write(data.toString('utf-8'))
    })

    // xterm 데이터
    term.onData((data) => {
      newSocket.emit('data', data)
    })

    newSocket.emit('terminal', 'test')
    setSocket(newSocket)
    return () => {
      // ComponentWillUnmount
      newSocket.off('connect')
      newSocket.off('disconnect')
      newSocket.off('data')
      newSocket.disconnect()
      term.dispose()
    }
  }, [])

  return (
    <div className="Terminal">
      [Terminal]
      <p>Connected: {'' + isConnected}</p>
      <div ref={myRef} style={{ width: 700, height: 300 }} />
    </div>
  )
}

export default SshTerminal
