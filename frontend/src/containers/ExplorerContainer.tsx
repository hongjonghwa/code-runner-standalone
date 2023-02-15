import { useQuery } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import MainComponent from '../components/MainComponent'
import { Code } from '../models/Code'
import { Session } from '../models/Session'
import { sessionMutations } from '../operations/mutations'
import { CODE } from '../operations/queries/code'
import { GET_SESSION } from '../operations/queries/getSession'

type ExplorerContainerProps = {
  files: string[]
}
export default function ExplorerContainer(props: ExplorerContainerProps) {
  // console.log('error', error)

  const sessionQueryResult = useQuery(GET_SESSION)
  const session: Session = sessionQueryResult.data.session

  return (
    <div>
      {props.files.map((i, idx) => (
        <div
          key={i}
          onClick={() => sessionMutations.updateSession({ currentSelectedFile: i, currentSelectedFileIndex: idx })}
          style={{ display: 'inline-block' }}
        >
          | {i.replace(/^.*[\\\/]/, '')}
          {session.currentSelectedFileIndex === idx ? '(*)' : null} |{' '}
        </div>
      ))}
    </div>
  )
}
