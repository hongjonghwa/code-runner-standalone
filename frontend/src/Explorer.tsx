import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { File } from './models/Files'
import { GET_FILES } from './operations/queries/getFiles'
import { sessionMutations } from './operations/mutations'

function Explorer() {
  const { loading, error, data } = useQuery(GET_FILES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
    <div className="Explorer">
      [v FILES]
      {data.files &&
        data.files.map((i: File) => (
          <li
            key={i.path}
            onClick={() => sessionMutations.updateSession({ currentFile: i.path })}
            style={{ cursor: 'pointer' }}
          >
            {i.name}
          </li>
        ))}
    </div>
  )
}

export default Explorer
