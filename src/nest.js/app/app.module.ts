import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { AppController } from "./app.controller";

@Module({
  imports: [RedisModule],
  controllers: [AppController],
})
export class AppModule {}