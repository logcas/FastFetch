import { FastFetchConfig, FastFetchPromise, FastFetchRequest, HttpMethod, FastFetchResponse } from "../types";
import { fetch } from "./fetch";
import { InterceptorManager, InterceptorPair } from "./interceptor";
import mergeConfig from './mergeConfig';
import defaults from '../defaults';

export default class FastFetch implements FastFetchRequest {
  public config: FastFetchConfig = {};
  public interceptors = {
    request: new InterceptorManager<FastFetchConfig>(),
    response: new InterceptorManager<FastFetchResponse>()
  };
  public defaults: FastFetchConfig = defaults;
  
  constructor(
    config?: FastFetchConfig
  ) {
    if (config) {
      this.config = mergeConfig(this.config, config);
    }
  }

  private _mergeConfig(config?: FastFetchConfig) {
    return Object.assign({}, this.config, config || {});
  }

  request(url: any, config?: any): FastFetchPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }
    console.log(this.config);
    console.log(config);
    // config = mergeConfig(this.config, config || {});
    config = mergeConfig(this.defaults, config);
    console.log(config);

    const chain: Array<InterceptorPair<any>> = [
      {
        resolved: fetch
      }
    ];

    this.interceptors.request.forEach(interceptor => {
      interceptor && chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(interceptor => {
      interceptor && chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while(chain.length) {
      const interceptor = chain.shift()!;
      promise = promise.then(interceptor.resolved, interceptor.rejected);
    }

    return promise;
  }

  get(url: string, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithoutData('get', url, config);
  }

  head(url: string, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithoutData('head', url, config);
  }

  options(url: string, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithoutData('options', url, config);
  }

  patch(url: string, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithoutData('patch', url, config);
  }

  delete(url: string, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithoutData('delete', url, config);
  }

  post(url: string, data?: any, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithData('post', url, data, config);
  }

  put(url: string, data?: any, config?: FastFetchConfig): FastFetchPromise {
    return this._requestWithData('put', url, data, config);
  }

  _requestWithoutData(method: HttpMethod, url: string, config?: FastFetchConfig): FastFetchPromise {
    return this.request(Object.assign(config || {}, {
      method,
      url
    }));
  }

  _requestWithData(method: HttpMethod, url: string, data?: any, config?: FastFetchConfig): FastFetchPromise {
    return this.request(Object.assign(config || {}, {
      method,
      url,
      data
    }));
  }
}