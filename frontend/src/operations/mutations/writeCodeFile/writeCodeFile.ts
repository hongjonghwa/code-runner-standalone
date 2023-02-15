import { gql, useMutation } from '@apollo/client'
import { READ_CODE_FILE } from '../../queries/readCodeFile'

export const WRITE_CODE_FILE = gql`
  mutation writeCodeFile($codeId: String!, $fileId: Int!, $contents: String!) {
    writeCodeFile(codeId: $codeId, fileId: $fileId, contents: $contents)
  }
`

export default function useWriteCodeFile(codeId: string, fileId: number) {
  const [mutate, { data, error }] = useMutation(WRITE_CODE_FILE, {
    refetchQueries: [
      { query: READ_CODE_FILE, variables: { codeId, fileId } }, // DocumentNode object parsed with gql
      'ReadCodeFile', // Query name
    ],
  })

  const mutateFunction = (contents: String) => {
    mutate({ variables: { codeId, fileId, contents: contents } })
  }

  return { mutate: mutateFunction, data, error }
}
