import React, { useState, useEffect } from 'react'

import SshTerminal from './components/SshTerminal'
import Explorer from './Explorer'

import { useQuery } from '@apollo/client'
import { Session } from './models/Session'
import { GET_SESSION } from './operations/queries/getSession'
import { sessionMutations } from './operations/mutations'
import Editor from './Editor'
import Xterm from './components/Xterm'

import './Main.css'

function Main() {
  const [showTerminal, setShowTerminal] = useState(false)

  const toggleTerminal = () => setShowTerminal(!showTerminal)

  const sessionQueryResult = useQuery(GET_SESSION)
  const session: Session = sessionQueryResult.data.session

  // console.log(sessionQueryResult)
  const testMutation = () => sessionMutations.updateSession({ currentFile: 'hello.cpp' })

  return (
    <div className="Main">
      <div className="Main-left">
        <Explorer></Explorer>
      </div>
      <div className="Main-center">
        {JSON.stringify(session)}
        <button onClick={testMutation}>mutation session</button>
        <Editor></Editor>
      </div>
      <div className="Main-bottom">
        bottom
        <button onClick={toggleTerminal}>TERMINAL</button>
        {showTerminal && <Xterm />}
      </div>
    </div>
  )
}

export default Main
