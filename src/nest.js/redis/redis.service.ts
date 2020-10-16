import { Injectable, Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { ClientRedis } from "@nestjs/microservices";
import { RedisClient } from "@nestjs/microservices/external/redis.interface";
import { Subject } from 'rxjs'
import { promisify } from "util";

@Injectable()
export class RedisService implements OnApplicationBootstrap, OnApplicationShutdown {
  private connector: ClientRedis
  private subscriber$: Subject<Error>
  private client: RedisClient
  private _get: Function
  private _set: Function
  private _quit: Function

  async onApplicationBootstrap() {
    this.connector = new ClientRedis({})
    await this.connector.connect()
    this.subscriber$ = new Subject<Error>()
    this.subscriber$.subscribe(
      () => {},
      (e) => { Logger.error('Error', e, RedisService.name) },
      () => { Logger.log('Complete!', RedisService.name) }
    )
    this.client = await this.connector.createClient(this.subscriber$)
    this._get = promisify(this.client.get).bind(this.client)
    this._set = promisify(this.client.set).bind(this.client)
    this._quit = promisify(this.client.quit).bind(this.client)
  }

  async onApplicationShutdown(signal?: string) {
    this.subscriber$.complete()
    await this._quit()
    await this.connector.close()
  }
  
  async getValue (key: string): Promise<string|null> {
    return this._get(key)
  }
  async setKey (key: string, value: string): Promise<"OK"> {
    return this._set(key, value)
  }
}