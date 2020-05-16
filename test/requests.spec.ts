import Fetch, { FastFetchResponse } from '../src/index'
import { getAjaxRequest } from './helper'
import { FastFetchError } from '../src/helpers/error'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    Fetch('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', () => {
    Fetch({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
    })

    return getAjaxRequest().then(request => {
      return request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on network errors', () => {
    const resolveSpy = jest.fn((res: FastFetchResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: FastFetchError) => {
      return e
    })

    jasmine.Ajax.uninstall()

    return Fetch('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: FastFetchResponse | FastFetchError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as FastFetchError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()
    }
  })

  test('should reject when request timeout', done => {
    let err: FastFetchError

    Fetch('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(error => {
      err = error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout exceeds 2000s')
        done()
      }, 100)
    })
  })

  test('should reject when validateStatus returns false', () => {
    const resolveSpy = jest.fn((res: FastFetchResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: FastFetchError) => {
      return e
    })

    Fetch({
      url: '/foo',
      validateStatus: (status: number) => {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })

    function next(reason: FastFetchResponse | FastFetchError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as FastFetchError).message).toBe('Request failed with status 500')
      expect((reason as FastFetchError).response!.status).toBe(500)
    }
  })

  test('should reject when validateStatus returns true', () => {
    const resolveSpy = jest.fn((res: FastFetchResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: FastFetchError) => {
      return e
    })

    Fetch({
      url: '/foo',
      validateStatus: (status: number) => {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })

    function next(res: FastFetchResponse | FastFetchError) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect((res as FastFetchResponse).status).toBe(500)
      expect((res as FastFetchResponse).config.url).toBe('/foo')
    }
  })

  test('should return JSON when resolved', done => {
    let response: FastFetchResponse

    Fetch('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"errno": 0}'
      })

      setTimeout(() => {
        expect(response.data).toEqual({ errno: 0 })
        done()
      }, 100)
    })
  })

  test('should return JSON when rejected', done => {
    let response: FastFetchResponse

    Fetch('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"errno": 1, "msg": "BAD USERNAME"}'
      })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.msg).toBe('BAD USERNAME')
        expect(response.data.errno).toBe(1)
        done()
      }, 100)
    })
  })
})
