import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import path from 'path'
import { CodesService } from './codes.service'
import { Access } from './entities/access.entity'

@Resolver('Code')
export class CodesResolver {
  constructor(private codesService: CodesService) {}

  @Query('code')
  async code(@Args('id') id: string) {
    const access = this.codesService.findAccess(id)
    console.log('access', access)
    return { ...access, id }
  }

  @ResolveField('template')
  async template(@Parent() parent: Access) {
    const t = this.codesService.findTemplate(parent.templateId)
    console.log('###TEMPLATE###', t)
    const ret = { id: parent.templateId }
    if (t['files']) ret['files'] = t.files
    if (t['actions']) ret['actions'] = t['actions'].map((i) => i.name)
    return ret
  }

  @Query('readCodeFile')
  async readCodeFile(@Args('codeId') accessId: string, @Args('fileId') fileId: number) {
    return this.codesService.readUserCodeFile(accessId, fileId)
  }

  @Mutation('writeCodeFile')
  async writeCodeFile(
    @Args('codeId') accessId: string,
    @Args('fileId') fileId: number,
    @Args('contents') contents: string,
  ) {
    return this.codesService.writeUserCodeFile(accessId, fileId, contents)
  }
  /*

  // @ResolveField('contents')
  async contents(@Parent() file: File) {}

  // @Query('readFile')
  async readFile(@Args('path') path: string) {}

  // @Mutation('writeFile')
  async writeFile(@Args('path') path: string, @Args('contents') contents: string) {}
  /*
  @Query()
  async author(@Args('id') id: number) {
    return this.authorsService.findOneById(id)
  }

  @ResolveField()
  async posts(@Parent() author) {
    const { id } = author
    return this.postsService.findAll({ authorId: id })
  }
  */
}
