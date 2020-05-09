import { isPlainObject, isDate } from './util'

interface URLParsingObject {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === null || typeof value === 'undefined') {
      return
    }
    let vals = []
    if (Array.isArray(value)) {
      vals = [...value]
      key += '[]'
    } else {
      vals = [value]
    }
    vals.forEach(val => {
      if (isPlainObject(val)) {
        val = JSON.stringify(val)
      } else if (isDate(val)) {
        val = val.toISOString()
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  const markIndex = url.indexOf('#')
  if (markIndex !== -1) {
    url = url.slice(0, markIndex)
  }

  if (serializedParams) {
    const quotIndex = url.indexOf('?')
    if (quotIndex === -1) {
      url += '?' + serializedParams
    } else {
      if (quotIndex !== url.length - 1) {
        url += '&'
      }
      url += serializedParams
    }
  }

  return url
}

export function isSameOrigin(requestURL: string): boolean {
  const { protocol, host } = parseURL(requestURL)
  const isSame =
    protocol === currentLocationURLObject.protocol && host === currentLocationURLObject.host
  console.log(isSame)
  return isSame
}

const aURLNode = document.createElement('a')
const currentLocationURLObject = parseURL(window.location.origin)

function parseURL(requestURL: string): URLParsingObject {
  aURLNode.href = requestURL
  const { protocol, host } = aURLNode
  return {
    protocol,
    host
  }
}
