import { FastFetchConfig, FastFetchPromise, FastFetchResponse, Transformer } from '../types';
import xhr from './xhr';
import { buildURL } from '../helpers/url';
import { transformResponse } from '../helpers/data';
import { flattenHeaders } from '../helpers/headers';
import transform from './transform';

export function fetch(config: FastFetchConfig): FastFetchPromise {
  processConfig(config);
  throwIfCancelTokenUsed(config);
  return xhr(config).then(res => transformResponseData(res));
}

function processConfig(config: FastFetchConfig): void {
  config.url = transformURL(config);
  config.data = transform(config.data, config.headers, config.transformRequest!);
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformURL(config: FastFetchConfig): string {
  const { url, params = {} } = config;
  return buildURL(url!, params);
}

function transformResponseData(res: FastFetchResponse): FastFetchResponse {
  res.data = transformResponse(res.data);
  return res;
}

function throwIfCancelTokenUsed(config: FastFetchConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}