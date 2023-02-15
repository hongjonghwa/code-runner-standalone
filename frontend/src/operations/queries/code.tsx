import { gql } from '@apollo/client'

export const CODE = gql`
  query ($codeId: String!) {
    code(id: $codeId) {
      template {
        id
        actions
        files
      }
    }
  }
`
