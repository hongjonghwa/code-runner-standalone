import { sessionVar } from '../../cache'
import createSetSession from './setSession/setSession'
import createUpdateSession from './updateSession/updateSession'
import createWriteCodeFile from './writeCodeFile/writeCodeFile'

export const sessionMutations = {
  setSession: createSetSession(sessionVar),
  updateSession: createUpdateSession(sessionVar),
}

export const fileMutations = {
  writeCodeFile: (codeId: string, fileId: number) => createWriteCodeFile(codeId, fileId),
  writeFile: '',
}
