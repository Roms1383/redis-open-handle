import { RedisClient } from 'redis'
import { promisify } from 'util'

describe('client : there should be no open handle', () => {
  let client: RedisClient
  let _get: Function
  let _set: Function
  let _quit: Function
  beforeAll(async () => {
    client = new RedisClient({})
    _get = promisify(client.get).bind(client)
    _set = promisify(client.set).bind(client)
    _quit = promisify(client.quit).bind(client)
  })
  afterAll(async () => {
    await _quit()
  })
  it('should be able to write', async () => {
    const OK = await _set('foo', 'bar')
    expect(OK).toBe('OK')
  })
  it('should be able to read', async () => {
    const bar = await _get('foo')
    expect(bar).toBe('bar')
  })
})