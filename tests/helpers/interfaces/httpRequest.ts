import {
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResult,
} from "aws-lambda";

export interface HttpRequestConfig {
  headers?: APIGatewayProxyEventHeaders;
  pathParameters: APIGatewayProxyEventPathParameters | null;
  queryStringParameters: APIGatewayProxyEventPathParameters | null;
}

export interface httpRequestData {
  body?: object;
  headers?: object;
  requestContext?: any;
  queryStringParameters?: object;
}

export interface MiddlewareRequest {
  context?: object;
  error?: any;
  event?: httpRequestData;
  internal?: any;
  response?: APIGatewayProxyResult;
}

export interface MiddlewareResponse {
  before?: APIGatewayProxyResult;
  onError?: APIGatewayProxyResult;
  after?: APIGatewayProxyResult;
}
