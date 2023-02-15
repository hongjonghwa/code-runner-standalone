import React, { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import io, { Socket } from 'socket.io-client'
import Xterm from '../components/Xterm'
import { CONSTANTS } from '../constants'

const IO_SERVER_ADDRESS = 'http://localhost:2222/codes'

type ConsoleContainerProps = { selectedActionIndex: number }
export default function ConsoleContainer(props: Partial<ConsoleContainerProps>) {
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('start', props.selectedActionIndex)

    const term = new Terminal()
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(myRef.current!)
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

    const ws = io(IO_SERVER_ADDRESS, {})

    ws.on('connect', () => {
      // console.log('ws on connect')
      setIsConnected(true)
    })

    ws.on('disconnect', () => {
      console.log('ws on disconnect')
      // 서버에서 끊어졌을 때 처리
      setIsConnected(false)
    })

    ws.on('data', (data) => {
      // console.log('ws on data')
      term.write(data.toString('utf-8'))
    })

    // xterm 데이터
    term.onData((data) => {
      ws.emit('data', data)
    })

    ws.emit('terminal', { codeId: CONSTANTS.CODE_ID, actionId: props.selectedActionIndex })

    setSocket(ws) // ! state 에 저장할 필요가 있나?

    function resizeScreen() {
      fitAddon.fit()
      ws.emit('resize', { cols: term.cols, rows: term.rows })
      // console.log(`resize: ${JSON.stringify({ cols: term.cols, rows: term.rows })}`)
    }

    resizeScreen()
    window.addEventListener('resize', resizeScreen, false)

    return () => {
      console.log('end', props.selectedActionIndex)

      // ComponentWillUnmount
      ws.off('connect')
      ws.off('disconnect')
      ws.off('data')
      ws.disconnect()
      term.dispose()
      window.removeEventListener('resize', resizeScreen, false)
    }
  }, [props.selectedActionIndex])

  return (
    <div>
      <div className="Xterm">
        <div>Connected: {'' + isConnected}</div>
        <div ref={myRef} style={{ width: '100%', height: 150 }} />
      </div>
    </div>
  )
}
