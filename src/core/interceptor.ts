import { Interceptor, resolveInterceptor, rejectInterceptor } from '../types';

export interface InterceptorPair<T> {
  resolved: resolveInterceptor<T>,
  rejected?: rejectInterceptor
};

export class InterceptorManager<T> implements Interceptor<T> {
  private interceptors: Array<InterceptorPair<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  use(resolveFn: resolveInterceptor<T>, rejectFn?: rejectInterceptor) {
    this.interceptors.push({
      resolved: resolveFn,
      rejected: rejectFn
    });
    return this.interceptors.length - 1;
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  forEach(fn: <T>(pair: InterceptorPair<T>) => void) {
    this.interceptors.forEach(InterceptorPair => {
      if (InterceptorPair) {
        fn<T>(InterceptorPair);
      }
    });
  }
}