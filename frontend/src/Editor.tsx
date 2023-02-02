import React, { useState, useEffect } from 'react'
import CodeEditor from './containers/CodeEditor'
import './Editor.css'

function Editor() {
  return (
    <div className="Editor">
      <CodeEditor></CodeEditor>
    </div>
  )
}

export default Editor
