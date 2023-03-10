import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import Terminal from './components/SshTerminal'
import Main from './Main'
import MainContainer from './containers/MainContainer'
function App() {
  const [showTerminal, setShowTerminal] = useState(false)

  const toggleTerminal = () => setShowTerminal(!showTerminal)

  return (
    <div className="App">
      <header className="App-header">
        <MainContainer />
        {/* 
        <Main></Main>
        */}
        {/* 
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        */}
      </header>
    </div>
  )
}

export default App
