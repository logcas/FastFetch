import {
  normalizeHeader,
  processHeaders,
  parseHeaders,
  flattenHeaders
} from '../../src/helpers/headers'

describe('helpers: headers', () => {
  describe('normalizeHeader', () => {
    test('should normalize attribute name', () => {
      const headers = {
        'content-type': 'application/json',
        accept: 'text/html'
      }
      normalizeHeader(headers, 'Content-Type')
      expect(headers['content-type']).toBeUndefined()
      expect((headers as any)['Content-Type']).toBe('application/json')
      expect(headers['accept']).toBe('text/html')
    })
  })

  describe('processHeaders', () => {
    test('should set Content-Type when data is a PlainObject and Content-Type is unset', () => {
      const data = { a: 111 }
      const headers = {}
      processHeaders(headers, data)
      expect((headers as any)['Content-Type']).toBe('application/json; charset=utf-8')
    })

    test('should unset Content-Type when data is a PlainObject and Content-Type is set', () => {
      const data = { a: 111 }
      const headers = {
        'Content-Type': 'text/plain'
      }
      processHeaders(headers, data)
      expect(headers['Content-Type']).toBe('text/plain')
    })

    test('should unset Content-Type when data is not a PlainObject', () => {
      const data = new FormData()
      const headers = {}
      processHeaders(headers, data)
      expect((headers as any)['Content-Type']).toBeUndefined()
    })
  })

  //   connection: keep-alive
  // content-length: 11
  // content-type: text/html; charset=utf-8
  // date: Fri, 15 May 2020 07:40:23 GMT
  // etag: W/"b-SeRn+P0S5Cv7Z2+z+paQB3qapuc"
  // x-powered-by: Express

  describe('parseHeaders', () => {
    test('should validate parse headers', () => {
      const headerString =
        'connection: keep-alive\r\n' +
        'content-length: 11\r\n' +
        'content-type: text/html; charset=utf-8\r\n' +
        'date: Fri, 15 May 2020 07:40:23 GMT\r\n' +
        'x-powered-by: \r\n'

      const headers = parseHeaders(headerString)
      expect(headers['connection']).toBe('keep-alive')
      expect(headers['content-length']).toBe('11')
      expect(headers['content-type']).toBe('text/html; charset=utf-8')
      expect(headers['date']).toBe('Fri, 15 May 2020 07:40:23 GMT')
      expect(headers['x-powered-by']).toBe('')
      expect(headers['aaaa']).toBeUndefined()
    })
  })

  describe('flattenHeaders', () => {
    const headers = {
      common: {
        Accept: 'application/json, text/plain, */*'
      },
      post: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      put: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const flattenedHeaders = flattenHeaders(headers, 'post')

    expect(flattenedHeaders['common']).toBeUndefined()
    expect(flattenedHeaders['post']).toBeUndefined()
    expect(flattenedHeaders['put']).toBeUndefined()
    expect(flattenedHeaders['Content-Type']).toBe('application/x-www-form-urlencoded')
    expect(flattenedHeaders['Accept']).toBe('application/json, text/plain, */*')
  })
})
