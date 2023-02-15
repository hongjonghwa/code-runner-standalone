import { Module } from '@nestjs/common'
import { CodesService } from './codes.service'
import { CodesController } from './codes.controller'
import { CodesRepository } from './codes.repository'
import { CodesResolver } from './codes.resolver'
import { CodesGateway } from './codes.gateway'

@Module({
  controllers: [CodesController],
  providers: [CodesService, CodesResolver, CodesRepository, CodesGateway],
})
export class CodesModule {}
