import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { RedisService } from '../redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly service: RedisService) {}
  @Post()
  async setKey(@Body('key') key: string, @Body('value') value: string) {
    return this.service.setKey(key, value)
  }
  @Get()
  async getValue(@Query('key') key: string) {
    return this.service.getValue(key)
  }
}