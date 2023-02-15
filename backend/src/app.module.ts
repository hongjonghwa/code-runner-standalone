import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

import { join } from 'path'
import { CodesModule } from './codes/codes.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      debug: true,
      playground: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        // outputAs: 'class',
      },
      cors: {
        origin: '*',
        // origin: 'http://localhost:3000',
        // credentials: true,
      },
    }),
    CodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
