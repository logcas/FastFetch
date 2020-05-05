import { isPlainObject, deepMerge } from "./util";
import { HttpMethod } from "../types";

function normalizeHeader(headers: any, normailizedName: string): void {
  Object.keys(headers).forEach(name => {
    if (name !== normailizedName && name.toUpperCase() === normailizedName.toUpperCase()) {
      headers[normailizedName] = headers[name];
      delete headers[name];
    }
  });
}

export function processHeaders(headers: any, data: any): any {
  const CONTENT_TYPE = 'Content-Type';

  normalizeHeader(headers, CONTENT_TYPE);
  if (isPlainObject(data)) {
    if (headers && !headers[CONTENT_TYPE]) {
      headers[CONTENT_TYPE] = 'application/json; charset=utf-8';
    }
  }

  return headers;
}

export function parseHeaders(headers: string) {
  const ret = Object.create(null);
  
  headers.split('\r\n').forEach(headerString => {
    let [name, value] = headerString.split(':');
    if (name && value) {
      name = name.trim();
      value = value.trim();
      ret[name] = value;
    }
  });

  return ret;
}

export function flattenHeaders(headers: any, method: HttpMethod) {
  headers = headers || {};
  const commonHeaders = headers['common'];
  const methodHeaders = headers[method] || {};
  headers = deepMerge(commonHeaders, methodHeaders, headers);
  
  const removeHeadersKey = ['get', 'post', 'put', 'patch', 'head', 'options', 'delete', 'common'];
  removeHeadersKey.forEach(key => {
    delete headers[key];
  });

  return headers;
}