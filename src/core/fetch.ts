import { FastFetchConfig, FastFetchPromise, FastFetchResponse, Transformer } from '../types'
import xhr from './xhr'
import { buildURL, isAbsolutePath, combineURL } from '../helpers/url'
import { transformResponse } from '../helpers/data'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export function fetch(config: FastFetchConfig): FastFetchPromise {
  processConfig(config)
  throwIfCancelTokenUsed(config)
  return xhr(config).then(res => transformResponseData(res))
}

function processConfig(config: FastFetchConfig): void {
  config.url = transformURL(config)
  config.headers = config.headers || {}
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: FastFetchConfig): string {
  const { url, params, paramsSerializer, baseURL } = config
  let _url
  if (isAbsolutePath(url!)) {
    _url = url
  } else if (baseURL) {
    _url = combineURL(baseURL, url!)
  } else {
    _url = url
  }
  return buildURL(_url!, params, paramsSerializer)
}

function transformResponseData(res: FastFetchResponse): FastFetchResponse {
  res.data = transformResponse(res.data)
  return res
}

function throwIfCancelTokenUsed(config: FastFetchConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
