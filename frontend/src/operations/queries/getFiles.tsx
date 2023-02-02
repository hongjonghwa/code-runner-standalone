import { gql } from '@apollo/client'

export const GET_FILES = gql`
  query GetFiles {
    files(dir: "/") {
      name
      path
    }
  }
`
