export type StatusCode = 200 | 201 | 301 | 400 | 401 | 403 | 404 | 422 | 500 | 502 | 504;

export const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

export interface AsyncLambdaResponseHeaders {
  [name: string]: string | number | boolean;
}

export interface AsyncLambdaResponse {
  statusCode: StatusCode;
  body: string;
  headers?: AsyncLambdaResponseHeaders;
}

export interface ResponseBody<T> {
  [key: string]: T;
}

export interface JsonApiResourceRelation {
  id?: string;
  type?: string;
}

/**
 * https://jsonapi.org/format/#document-resource-objects
 * JSON Format v1.0
 *
 * {
 *  "id": "",
 *  "attributes": {},
 *  "type": {}
 *  "relationships":{}
 * }
 *
 */
export interface JsonApiResource<T> {
  id?: string;
  type?: string;
  attributes: T;
  relationships?: {
    [key: string]: {
      data: JsonApiResourceRelation | JsonApiResourceRelation[];
    };
  };
}

/**
 * Generates a standardized lambda response
 *
 * @param statusCode
 * @param body
 * @param headers
 */
export function createResponse<T>(
  statusCode: StatusCode,
  body: T,
  headers: AsyncLambdaResponseHeaders = {}
): AsyncLambdaResponse {
  return {
    body: JSON.stringify(body),
    headers: { ...DEFAULT_HEADERS, ...headers },
    statusCode
  };
}
