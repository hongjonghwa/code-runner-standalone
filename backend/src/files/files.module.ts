import { Module } from '@nestjs/common'

import { FilesService } from './files.service'
import { FilesResolver } from './files.resolver'

@Module({
  imports: [],
  controllers: [],
  providers: [FilesService, FilesResolver],
})
export class FilesModule {}
