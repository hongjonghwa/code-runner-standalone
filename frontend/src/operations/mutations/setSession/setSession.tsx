import { Session } from '../../../models/Session'
import { ReactiveVar } from '@apollo/client'

export default (sessionVar: ReactiveVar<Session>) => {
  return (session: Session) => {
    sessionVar(session)
  }
}
