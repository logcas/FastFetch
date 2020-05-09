import { FastFetchConfig, FastFetchPromise, FastFetchResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import transform from './transform'
import { Cancel } from '../cancel/cancel'
import { isSameOrigin } from '../helpers/url'
import cookieManager from '../helpers/cookie'

export default function xhr(config: FastFetchConfig): FastFetchPromise {
  const {
    data,
    url,
    method = 'get',
    headers,
    responseType = 'json',
    timeout,
    transformResponse,
    cancelToken,
    withCredentials,
    xsrfCookieName,
    xsrfHeaderName
  } = config
  const request = new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    request.open(method.toUpperCase(), url!, true)

    request.responseType = responseType

    if (timeout) {
      request.timeout = timeout
    }

    if (cancelToken) {
      cancelToken.promise.then((reason: Cancel) => {
        request.abort()
        reject(reason)
      })
    }

    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    // set header after calling open
    setXHRHeaders(request, headers, data)

    // xsrf
    if (withCredentials || (isSameOrigin(url!) && xsrfCookieName)) {
      const cookie = cookieManager.read(xsrfCookieName!)
      if (cookie && xsrfHeaderName) {
        request.setRequestHeader(xsrfHeaderName, cookie)
      }
    }

    request.onerror = () => {
      reject(createError('Network Error', true, config, undefined, request, 'ECONNERROR'))
    }

    request.ontimeout = () => {
      reject(
        createError(`Timeout exceeds ${timeout}s`, true, config, undefined, request, 'TIMEOUT')
      )
    }

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }

      // 网络错误或超时错误时，status = 0
      // 交给 onerror 或者 ontimeout 处理
      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = request.responseType === 'text' ? request.responseText : request.response
      const statusText = request.statusText
      const status = request.status
      const response: FastFetchResponse = {
        headers: responseHeaders,
        data: responseData,
        status,
        statusText,
        request,
        config
      }

      handleResponse(response)
    }

    request.send(data)

    function handleResponse(res: FastFetchResponse) {
      if ((res.status >= 200 && res.status < 300) || res.status === 304) {
        res.data = transform(res.data, res.headers, transformResponse!)
        resolve(res)
      } else {
        reject(createError(`Request failed with status ${res.status}`, false, config, res, request))
      }
    }
  })
}

function setXHRHeaders(xhr: XMLHttpRequest, headers: any, data: any): void {
  Object.keys(headers).forEach(name => {
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      const content = headers[name]
      xhr.setRequestHeader(name, content)
    }
  })
}
