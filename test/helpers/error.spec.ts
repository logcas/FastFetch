import { createError } from '../../src/helpers/error'
import { FastFetchConfig, FastFetchResponse } from '../../src/types'

describe('helper: error', () => {
  test('should validate createError', () => {
    const request = new XMLHttpRequest()
    const config: FastFetchConfig = {
      headers: {
        aaa: 'bbb'
      }
    }
    const response: FastFetchResponse = {
      status: 200,
      data: {
        a: 1231
      },
      headers: {
        'Content-Type': 'application/json'
      },
      request,
      statusText: 'OK',
      config
    }
    const error = createError('Test', true, config, response, request, '')
    expect(error.code).toBe('')
    expect(error.config).toEqual(config)
    expect(error.isFastFetchError).toBeTruthy()
    expect(error.message).toBe('Test')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
  })
})
