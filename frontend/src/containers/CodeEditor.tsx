import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import CodeMirror from '../components/CodeMirror'
import { Session } from '../models/Session'
import { useWriteFile } from '../operations/mutations/writeFile/writeFile'
import { GET_SESSION } from '../operations/queries/getSession'
import { READ_FILE } from '../operations/queries/readFile'

export default function CodeEditor() {
  const [file, setFile] = useState('')
  const [code, setCode] = useState(' ')
  const [message, setMessage] = useState('')

  const sessionQueryResult = useQuery(GET_SESSION)
  const session: Session = sessionQueryResult.data.session

  const { data } = useQuery(READ_FILE, {
    variables: { path: session.currentFile },
    skip: !session.currentFile || file === session.currentFile,
  })

  if (data) {
    setFile(session.currentFile)
    setCode(data.readFile)
  }

  const editorMode = useMemo(() => {
    if (!file) return undefined
    if (file.endsWith('.java')) return 'java'
    if (file.endsWith('.py')) return 'python'
    if (file.endsWith('.c') || file.endsWith('.c++') || file.endsWith('.cpp')) return 'cpp'
    return undefined
  }, [file])

  const onChange = React.useCallback((value: string) => {
    setCode(value)
  }, [])

  const { mutate: fileWrite } = useWriteFile(file)
  const onSave = () => fileWrite(code)

  return (
    <div>
      <p>{file}</p>
      <button value="Save" onClick={onSave}>
        저장!
      </button>
      <CodeMirror value={code} onChange={onChange} mode={editorMode} />
    </div>
  )
}
