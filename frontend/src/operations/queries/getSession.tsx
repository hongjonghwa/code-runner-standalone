import { gql } from '@apollo/client'

export const GET_SESSION = gql`
  query GetSession {
    session @client {
      currentFile
      test
    }
  }
`
