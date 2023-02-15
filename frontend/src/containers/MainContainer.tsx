import { useQuery } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import MainComponent from '../components/MainComponent'
import { Code } from '../models/Code'
import { CODE } from '../operations/queries/code'
import ActionContainer from './ActionContainer'
import CodeEditorContainer from './CodeEditorContainer'
import ExplorerContainer from './ExplorerContainer'
import { CONSTANTS } from '../constants'

export default function () {
  const { loading, error, data } = useQuery(CODE, {
    variables: { codeId: CONSTANTS.CODE_ID },
    skip: false,
  })
  if (!data?.code) return <div>No Code</div>

  const code: Code = data?.code

  // console.log('error', error)
  return (
    <div style={{ width: 800, textAlign: 'left' }}>
      <ExplorerContainer files={code.template.files} />
      <CodeEditorContainer />
      <ActionContainer actions={code.template.actions} />
    </div>
  )
}
