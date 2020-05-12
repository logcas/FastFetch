import { InterceptorManager } from '../core/interceptor'

export type HttpMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface FastFetchConfig {
  url?: string
  method?: HttpMethod
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: Transformer | Transformer[]
  transformResponse?: Transformer | Transformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onUploadProgress?: (e: ProgressEvent) => any
  onDownloadProgress?: (e: ProgressEvent) => any
  auth?: BasicAuthorization
  paramsSerializer?: (params: any) => string
  baseURL?: string

  [propName: string]: any
}

export interface FastFetchResponse<T = any> {
  status: number
  data: T
  headers: any
  request: any
  statusText: string
  config: any
}

export interface FastFetchPromise<T = any> extends Promise<FastFetchResponse<T>> {}

export interface FastFetchError<T = any> extends Error {
  config: any
  code?: string
  response?: FastFetchResponse<T>
  request?: any
  isFastFetchError: boolean
}

export interface FastFetchRequest {
  request<T = any>(config: FastFetchConfig): FastFetchPromise<T>
  get<T = any>(url: string, config?: FastFetchConfig): FastFetchPromise<T>
  delete<T = any>(url: string, config?: FastFetchConfig): FastFetchPromise<T>
  options<T = any>(url: string, config?: FastFetchConfig): FastFetchPromise<T>
  head<T = any>(url: string, config?: FastFetchConfig): FastFetchPromise<T>
  patch<T = any>(url: string, config?: FastFetchConfig): FastFetchPromise<T>
  post<T = any>(url: string, data?: any, config?: FastFetchConfig): FastFetchPromise<T>
  put<T = any>(url: string, data?: any, config?: FastFetchConfig): FastFetchPromise<T>
}

export interface FastFetchInstance extends FastFetchRequest {
  <T = any>(config: FastFetchConfig): FastFetchPromise<T>
  <T = any>(url: string, config?: FastFetchConfig): FastFetchPromise<T>

  create(config?: FastFetchConfig): FastFetchInstance
  interceptors: {
    request: InterceptorManager<FastFetchConfig>
    response: InterceptorManager<FastFetchResponse>
  }
  defaults: FastFetchConfig
  CancelToken: CancelTokenStatic
  isCancel(cancel: any): boolean
}

export interface Interceptor<T = any> {
  use(resolveFn: resolveInterceptor<T>, rejectFn?: rejectInterceptor): number
  eject(id: number): void
}

export interface resolveInterceptor<T> {
  (x: T): T | Promise<T>
}

export interface rejectInterceptor {
  (x: any): any
}

export interface Transformer {
  (data: any, headers?: any): any
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: (reason: string) => void
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface CancelTokenFunc {
  (reason: string): void
}

export interface CancelExecutor {
  (c: CancelTokenFunc): void
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  reason?: string
}

export interface BasicAuthorization {
  username: string
  password: string
}
