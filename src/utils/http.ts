import { API_URL } from 'src/constants';
import { joinURL, withQuery, type QueryObject } from 'ufo';
import {getSession, flushStorage} from '../sections/auth/session/session';


export interface RequestInitClient extends Omit<RequestInit, 'body'> {
  data?: Record<string, unknown> | FormData;
  params?: QueryObject;
  baseURL?: string;
  accessToken?: string | null;
}

interface HttpResponseError {
  error: string;
  message:string;
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  public status: number;

  public info: unknown;

  constructor(status: number, message?: string, info?: unknown) {
    super(message ?? 'Internal Server Error');
    this.name = 'HttpError';
    this.status = status;
    this.info = info ?? {};
  }
}

function getHeaders({
  data,
  accessToken,
  headers: customHeaders,
}: Pick<RequestInitClient, 'data' | 'headers' | 'accessToken'>) {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...customHeaders,
  });

  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  if (data instanceof FormData) {
    headers.delete('Content-Type');
  }

  return headers;
}

function getBody(data: RequestInitClient['data']) {
  if (data instanceof FormData) {
    return data;
  }

  if (data) {
    return JSON.stringify(data);
  }

  return undefined;
}

/**
 * HTTP request with several thing already configured
 */
export function http<TData = any>(
  endpoint: string,
  requestInit: RequestInitClient = {}
) {
  const { signal, abort } = new AbortController();
  const {
    baseURL,
    data,
    params = {},
    headers: customHeaders,
    accessToken = getSession(),
    ...customConfig
  } = requestInit ?? {};

  const baseUrl = baseURL ?? API_URL;
  const url = baseUrl ? joinURL(baseUrl, endpoint) : endpoint;
  const urlWithQuery = withQuery(url, params);

  const config = {
    signal,
    method: data ? 'POST' : 'GET',
    body: getBody(requestInit.data),
    headers: getHeaders({ ...requestInit, accessToken }),
    ...customConfig,
  };

  const fetcher = window.fetch(urlWithQuery, config).then(async (response) => {
    const responseData = (await response.json()) as unknown;

    if (response.ok) {
      return responseData as TData;
    }

    if (response.status === 401 && !response.url.includes('login')) {
      flushStorage();
      window.location.href= "/"
      // window.location.reload();
    }

    const reason = (responseData as HttpResponseError).message;
    const subReason = (responseData as HttpResponseError).error;
    throw new HttpError(response.status, `${reason} ~ ${subReason}`, responseData);
  });

  return Object.assign(fetcher, { cancel: abort });
}
