import { ApolloClient, InMemoryCache, ApolloProvider, gql, makeVar, ReactiveVar } from '@apollo/client'
import { Session } from './models/Session'

export const cache = new InMemoryCache({
  typePolicies: {
    // Type policy map
    Query: {
      fields: {
        session: {
          read() {
            // return localStorage.getItem('state')
            return sessionVar()
          },
        },
      },
    },
  },
})

const sessionInitialValue: Session = {
  currentSelectedFile: '',
  currentSelectedFileIndex: -1,
  test: 'test',
}

export const sessionVar: ReactiveVar<Session> = makeVar<Session>(sessionInitialValue)

/*
import { Todos } from "./models/Todos";
import { VisibilityFilter, VisibilityFilters } from "./models/VisibilityFilter";

const todosInitialValue: Todos = [
  {
    id: 0,
    completed: false,
    text: 'Use Apollo Client 3',
  },
]

export const todosVar: ReactiveVar<Todos> = makeVar<Todos>(todosInitialValue)

export const visibilityFilterVar = makeVar<VisibilityFilter>(VisibilityFilters.SHOW_ALL)
*/
