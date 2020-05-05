import { FastFetchResponse } from "../types";

export class FastFetchError extends Error {
  config: any;
  code?: string;
  response?: FastFetchResponse;
  request?: any;
  isFastFetchError: boolean;

  constructor(
    message: string,
    isFastFetchError: boolean,
    config: any,
    response?: FastFetchResponse,
    request?: any,
    code?: string
  ) {
    super(message);
    this.isFastFetchError = isFastFetchError;
    this.config = config;
    this.response = response;
    this.request = request;
    this.code = code;

    Object.defineProperty(this, 'prototype', FastFetchError.prototype);
  }
}

export function createError(
  message: string,
  isFastFetchError: boolean,
  config: any,
  response?: FastFetchResponse,
  request?: any,
  code?: string
) {
  const error = new FastFetchError(
    message,
    isFastFetchError,
    config,
    response,
    request,
    code
  );

  return error;
}