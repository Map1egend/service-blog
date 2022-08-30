import { Controller, Get, Query } from '@nestjs/common'
import { query } from 'express';

@Controller('music')
export class MusicContoller {
  @Get('song/url/v1')
  findMusicUrl(@Query() query): string {
    return `Query 参数是: ${query.id}${query.level}`
  }
}