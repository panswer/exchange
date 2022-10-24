import middy from "@middy/core";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export type MiddlewareInterface = middy.Request<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Error,
  Context
>;
