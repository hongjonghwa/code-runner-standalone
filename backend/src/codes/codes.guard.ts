import { ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class CodesGuard {
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers['authorization']

    if (!authorization || Array.isArray(authorization)) throw new Error('Invalid Authorization Header')
    const [_, token] = authorization.split(' ')

    request.user = { account: 'account1' }
    console.log('token ', token)
    return false
  }
}
