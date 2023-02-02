import { gql, useMutation } from '@apollo/client'
import { READ_FILE } from '../../queries/readFile'

export const WRITE_FILE = gql`
  mutation writeFile($path: String!, $contents: String!) {
    writeFile(path: $path, contents: $contents)
  }
`

export function useWriteFile(path: string) {
  const [mutate, { data, error }] = useMutation(WRITE_FILE, {
    refetchQueries: [
      { query: READ_FILE, variables: { path } }, // DocumentNode object parsed with gql
      'ReadFile', // Query name
    ],
  })

  const mutateFunction = (contents: String) => {
    mutate({ variables: { path, contents: contents } })
  }

  return { mutate: mutateFunction, data, error }
}
