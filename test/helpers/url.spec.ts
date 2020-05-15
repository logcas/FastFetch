import { isAbsolutePath, combineURL, encode, buildURL, isSameOrigin } from '../../src/helpers/url'

describe('helpers: url', () => {
  test('should validate absolutePath', () => {
    const ab = 'https://www.baidu.com'
    const ab2 = '//www.baidu.com'
    const ab3 = 'www.baidu.com'
    const rb = '/aadsa/sfsdfs'

    expect(isAbsolutePath(ab)).toBeTruthy()
    expect(isAbsolutePath(ab2)).toBeTruthy()
    expect(isAbsolutePath(ab3)).toBeFalsy()
    expect(isAbsolutePath(rb)).toBeFalsy()
  })

  describe('combineURL', () => {
    const ab = 'http://www.baidu.com'
    const ab2 = 'http://www.baidu.com/'
    const rb = 'ab/cd'
    const rb2 = '/ab/cd'

    expect(combineURL(ab)).toBe(ab)
    expect(combineURL(ab, rb)).toBe('http://www.baidu.com/ab/cd')
    expect(combineURL(ab2, rb2)).toBe('http://www.baidu.com/ab/cd')
  })

  test('should validate encode', () => {
    const str = '@:$,+[]'
    expect(encode(str)).toBe(str)
  })

  describe('buildURL', () => {
    test('should validate buildURL with default serializer', () => {
      const url = 'http://www.baidu.com?a=123#aaa'
      const params = {
        b: 456,
        c: [1, 2, 3],
        d: null,
        e: undefined,
        f: '@',
        g: new Date(1589531270266),
        h: {
          a: 1,
          b: 2
        }
      }
      const _url = buildURL(url, params)
      expect(_url).toBe(
        'http://www.baidu.com?a=123&b=456&c[]=1&c[]=2&c[]=3&f=@&g=2020-05-15T08:27:50.266Z&h=' +
          encode(JSON.stringify(params.h))
      )
    })

    test('should validate buildURL with URLSearchParams', () => {
      const url = 'http://www.baidu.com'
      const params = new URLSearchParams('a=1&b=2')
      const _url = buildURL(url, params)
      expect(_url).toBe('http://www.baidu.com?a=1&b=2')
    })

    test('should validate buildURL with custom serializer', () => {
      const url = 'http://www.baidu.com'
      const params = 'aaa=bbb'
      const fn = (x: any) => x as string
      const _url = buildURL(url, params, fn)
      expect(_url).toBe('http://www.baidu.com?aaa=bbb')
    })

    test('should directly return url with no params', () => {
      const url = 'http://www.baidu.com'
      const _url = buildURL(url)
      expect(_url).toBe(url)
    })
  })

  test('should validate isSameOrigin', () => {
    const corsOriginUrl = 'https://www.baidu.com'
    expect(isSameOrigin(window.location.href)).toBeTruthy()
    expect(isSameOrigin(corsOriginUrl)).toBeFalsy()
  })
})
