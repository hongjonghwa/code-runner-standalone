import { gql } from '@apollo/client'

export const READ_FILE = gql`
  query ReadFile($path: String!) {
    readFile(path: $path)
  }
`
