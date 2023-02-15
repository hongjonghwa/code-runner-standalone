import React, { useState, useEffect } from 'react'

import SshTerminal from './components/SshTerminal'

import { useQuery } from '@apollo/client'
import { Session } from './models/Session'
import { GET_SESSION } from './operations/queries/getSession'
import { sessionMutations } from './operations/mutations'
import Xterm from './components/Xterm'

import './Main.css'
import { CODE } from './operations/queries/code'

function Main() {
  const { loading, error, data } = useQuery(CODE)

  const [showTerminal, setShowTerminal] = useState(false)

  const toggleTerminal = () => setShowTerminal(!showTerminal)

  const sessionQueryResult = useQuery(GET_SESSION)
  const session: Session = sessionQueryResult.data.session

  // console.log(sessionQueryResult)
  const testMutation = () => sessionMutations.updateSession({ currentSelectedFile: 'hello.cpp' })

  return (
    <div className="Main">
      <div className="Main-left"></div>
      <div className="Main-center">
        {JSON.stringify(session)}
        <button onClick={testMutation}>mutation session</button>
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
