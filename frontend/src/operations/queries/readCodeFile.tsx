import { gql } from '@apollo/client'

export const READ_CODE_FILE = gql`
  query readCodeFile($codeId: String!, $fileId: Int!) {
    readCodeFile(codeId: $codeId, fileId: $fileId)
  }
`
