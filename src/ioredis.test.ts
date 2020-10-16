import IORedis from 'ioredis'
import Redis from 'ioredis'

describe('ioredis : there should be no open handle', () => {
  let client: IORedis.Redis
  beforeAll(async () => {
    client = new Redis()
  })
  afterAll(async () => {
    await client.quit()
  })
  it('should be able to write', async () => {
    const OK = await client.set('foo', 'bar')
    expect(OK).toBe('OK')
  })
  it('should be able to read', async () => {
    const bar = await client.get('foo')
    expect(bar).toBe('bar')
  })
})