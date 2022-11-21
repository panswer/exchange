import middy from "@middy/core";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export interface ValidatorCauseInterface {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Array<Object>;
  message: string;
}

export interface ValidatorErrorInterface {
  cause: Array<ValidatorCauseInterface>;
  name: string;
  statusCode: number;
  status: number;
  expose: boolean;
}

export type PersonalError = ValidatorErrorInterface & Error;

export type MiddlewareInterface = middy.Request<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  any,
  Context
>;
