import { Session } from '../../../models/Session'
import { ReactiveVar } from '@apollo/client'

export default (sessionVar: ReactiveVar<Session>) => {
  return (s: Partial<Session>) => {
    const session = sessionVar() 
    sessionVar({...session, ...s})
  }
}
