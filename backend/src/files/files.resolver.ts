import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FilesService } from './files.service'

import { File, Directory } from '../graphql'
import path from 'path'

@Resolver('File')
export class FilesResolver {
  constructor(private filesService: FilesService) {}

  @Query('files')
  async files(@Args('dir') dir: string) {
    if (!dir || dir === '') dir = '/'
    return this.filesService.files(dir)
  }

  @ResolveField('size')
  async size(@Parent() file: File) {
    return this.filesService.size(file.path)
  }

  @ResolveField('contents')
  async contents(@Parent() file: File) {
    return this.filesService.contents(file.path)
  }

  @Query('readFile')
  async readFile(@Args('path') path: string) {
    return this.filesService.readFile(path)
  }

  @Mutation('writeFile')
  async writeFile(@Args('path') path: string, @Args('contents') contents: string) {
    return this.filesService.writeFile(path, contents)
  }
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
