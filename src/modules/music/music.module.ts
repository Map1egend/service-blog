import { Module } from '@nestjs/common'
import { MusicContoller } from './music.controller'

@Module({
  controllers: [MusicContoller]
})

export class MusicModule {}