import React, { useEffect, useState } from 'react'
import ConsoleContainer from './ConsoleContainer'

type ActionContainerProps = {
  actions: string[]
}

export default function ActionContainer(props: Partial<ActionContainerProps>) {
  const [isTerminalOpened, setIsTerminalOpened] = useState<boolean>(false)
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(-1)

  if (!props.actions) return null

  const handleClick = (index: number) => () => {
    if (selectedActionIndex === index) setIsTerminalOpened(!isTerminalOpened)
    else {
      //setIsTerminalOpened(false)
      setSelectedActionIndex(index)
      //setIsTerminalOpened(true)
    }
  }

  return (
    <div>
      {props.actions.map((i, idx) => (
        <div key={i} onClick={handleClick(idx)} style={{ display: 'inline-block' }}>
          | {i} |
        </div>
      ))}
      {isTerminalOpened && <ConsoleContainer selectedActionIndex={selectedActionIndex} />}
    </div>
  )
}
