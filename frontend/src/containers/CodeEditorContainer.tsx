import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import CodeMirrorComponent from '../components/CodeMirrorComponent'
import { Session } from '../models/Session'
import { GET_SESSION } from '../operations/queries/getSession'
import { READ_CODE_FILE } from '../operations/queries/readCodeFile'

import { fileMutations } from '../operations/mutations'

import { CONSTANTS } from '../constants'
const codeId = window.location.search.substring(1)

export default function CodeEditorContainer() {
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedFileIndex, setSelectedFileIndex] = useState(-1)
  const [code, setCode] = useState('')

  const sessionQueryResult = useQuery(GET_SESSION)
  const session: Session = sessionQueryResult.data.session

  const { data } = useQuery(READ_CODE_FILE, {
    variables: { codeId: codeId, fileId: session.currentSelectedFileIndex },
    skip: session.currentSelectedFileIndex < 0 || session.currentSelectedFileIndex === selectedFileIndex,
  })

  if (data) {
    setSelectedFile(session.currentSelectedFile)
    setSelectedFileIndex(session.currentSelectedFileIndex)
    setCode(data.readCodeFile)
  }

  const editorMode = useMemo(() => {
    if (!selectedFile) return undefined
    if (selectedFile.endsWith('.java')) return 'java'
    if (selectedFile.endsWith('.py')) return 'python'
    if (selectedFile.endsWith('.c') || selectedFile.endsWith('.c++') || selectedFile.endsWith('.cpp')) return 'cpp'
    return undefined
  }, [selectedFile])

  const onChange = React.useCallback((value: string) => {
    setCode(value)
  }, [])

  // const { mutate: fileWrite } = useWriteFile(selectedFile)

  const { mutate: fileWrite } = fileMutations.writeCodeFile(CONSTANTS.CODE_ID, selectedFileIndex)
  const onSave = () => fileWrite(code)

  const handleKeyDown = (event: any) => {
    // event.preventDefault()
    let charCode = String.fromCharCode(event.which).toLowerCase()
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault()
      alert('CTRL+S 저장')
      onSave()
    }
  }

  if (!code) return <div />

  return (
    <div onKeyDown={handleKeyDown}>
      <button value="Save" onClick={onSave}>
        저장(CTRL+S)
      </button>
      <CodeMirrorComponent value={code} onChange={onChange} mode={editorMode} />
    </div>
  )
}
