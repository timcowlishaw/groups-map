import P from 'ts-prove'
import lambda from './lambdaUtils'

test('Lambda should catch errors and return 500', async () => {
  const result = await lambda(() => Promise.reject('Error'))({} as any, {} as any).catch(err => err)
  expect(result).toEqual({ statusCode: 500, body: 'Error' })
})

test('Lambda should return callback results', async () => {
  const result = await lambda(() => 'RESULTS')({} as any, {} as any).catch(err => err)

  expect(result).toEqual({
    statusCode: 200,
    body: JSON.stringify('RESULTS'),
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
})

test('Lambda body should provide parse body', async () => {
  const cb = jest.fn()
  await lambda.body()(cb)({ body: JSON.stringify({ one: 'foo' }) } as any, {} as any)
  expect(cb.mock.calls).toEqual([[{ one: 'foo' }]])
})

test('Lambda should validate body', async () => {
  const cb = jest.fn()
  const fail = await lambda.body(P.shape({ one: P.string }))(cb)(
    { body: JSON.stringify({ one: 10 }) } as any,
    {} as any
  )
  expect(cb.mock.calls).toEqual([])
  expect(fail.statusCode).toBe(500)

  const succeed = await lambda.body(P.shape({ one: P.string }))(cb)(
    { body: JSON.stringify({ one: 'foo' }) } as any,
    {} as any
  )
  expect(cb.mock.calls).toEqual([[{ one: 'foo' }]])
  expect(succeed.statusCode).toBe(200)
})

test('Lambda.queryParams should provide query paramets', async () => {
  const cb = jest.fn()
  await lambda.queryParams()(cb)({ queryStringParameters: { one: 'foo' } } as any, {} as any)
  expect(cb.mock.calls).toEqual([[{ one: 'foo' }]])
})

test('Lambda.queryParams should accept proof validation', async () => {
  const cb = jest.fn()
  const fail = await lambda.queryParams(P.shape({ one: P.string }))(cb)(
    { queryStringParameters: { one: 10 } } as any,
    {} as any
  )
  expect(cb.mock.calls).toEqual([])
  expect(fail.statusCode).toBe(500)
})
