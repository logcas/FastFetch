import FastFetch from './core/FastFetch';
import { FastFetchInstance, FastFetchConfig } from './types';
import { extend } from './helpers/util';
import { isCancel } from './cancel/cancel';
import CancelToken from './cancel';

function createInstance(config?: FastFetchConfig): FastFetchInstance {
  const context = new FastFetch(config);
  const instance = FastFetch.prototype.request.bind(context);
  extend(instance, context);
  (instance as FastFetchInstance).create = function(config?: FastFetchConfig) {
    return createInstance(config);
  };
  return instance as FastFetchInstance;
}

const fastFetch = createInstance();

fastFetch.isCancel = isCancel;
fastFetch.CancelToken = CancelToken;

export default fastFetch;