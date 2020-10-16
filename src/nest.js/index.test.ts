import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import Axios from 'axios';

import { AppModule } from './app/app.module';

const axios = Axios.create({
  baseURL: `http://127.0.0.1:3000`
})

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule, { cors: true })
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: { url: `redis://127.0.0.1:6379` }
    })
    await app.startAllMicroservicesAsync()
    Logger.log(`Redis listening on port 6379`, bootstrap.name)
    await app.listen(3000)
    Logger.log(`Application listening on port 3000`, bootstrap.name)
    return app
  } catch (e) { Logger.error('Error', e, bootstrap.name) }
}
const teardown = async (app: INestApplication) => {
  try {
    await app.close()
    Logger.log(`Application gracefully shutdown`, teardown.name)
    return true
  } catch (e) { Logger.error('Error', e, bootstrap.name) }
}

describe('nest.js : there should be no open handle', () => {
  let app: INestApplication|undefined
  beforeAll(async () => {
    app = await bootstrap()
  })
  afterAll(async () => {
    if (app) await teardown(app)
  })
  it('should be able to write', async () => {
    const { data, status } = await axios.post('/', { key: 'foo', value: 'bar' })
    expect(status).toBe(HttpStatus.CREATED)
    expect(data).toBe('OK')
  })
  it('should be able to read', async () => {
    const { data, status } = await axios.get('?key=foo')
    expect(status).toBe(HttpStatus.OK)
    expect(data).toBe('bar')
  })
})