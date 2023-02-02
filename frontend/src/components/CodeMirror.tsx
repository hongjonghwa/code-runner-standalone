import React, { useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'

import './CodeMirror.css'

type CodeMirrorProps = {
  mode: 'java' | 'cpp' | 'python'
  value: string
  onChange: (value: string) => void
}

export default function (props: Partial<CodeMirrorProps>) {
  const defaultOnChange = React.useCallback((value: string, viewUpdate: any) => {
    console.log('value:', value)
  }, [])

  const extensions = []
  if (props.mode && props.mode === 'python') extensions.push(python())
  if (props.mode && props.mode === 'java') extensions.push(java())
  if (props.mode && props.mode === 'cpp') extensions.push(cpp())

  return (
    <CodeMirror
      value={props.value}
      extensions={[...extensions]}
      theme="dark"
      onChange={props.onChange || defaultOnChange}
      className="cm-outer-container"
    />
  )
}
