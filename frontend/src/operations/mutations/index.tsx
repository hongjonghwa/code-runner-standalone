import { sessionVar } from '../../cache'
import createSetSession from './setSession/setSession'
import createUpdateSession from './updateSession/updateSession'

export const sessionMutations = {
  setSession: createSetSession(sessionVar),
  updateSession: createUpdateSession(sessionVar),
}

export const fileMutations = {
  writeFile: '',
}
