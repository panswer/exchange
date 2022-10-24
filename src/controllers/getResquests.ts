import middy from "@middy/core";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import { LogUser } from "../middlewares/LogUser";
import CatchError from "../middlewares/CatchError";
import Logger from "../utils/Logger";
import DynamodbService from "../services/DynamodbService";
import { SortBy } from "../enums/DynamoDBSortEnum";

const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const sort =
    event.queryStringParameters?.sort === SortBy.asc ? SortBy.asc : SortBy.desc;
  const logger = Logger.getInstance();
  const dynamodbService = DynamodbService.getInstance();

  logger.writeLogger(
    context.functionName,
    LoggerLevel.info,
    "Get history request start",
    { user: event.requestContext.authorizer!.claims.username, sort }
  );

  logger.writeLogger(context.functionName, LoggerLevel.debug, "Query String", {
    query: event.queryStringParameters,
  });
  const result = await dynamodbService.getRequests(
    event.requestContext.authorizer!.claims.username,
    sort
  );

  logger.writeLogger(
    context.functionName,
    LoggerLevel.info,
    "Get history request success"
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

export const handler = middy(lambdaHandler).use(LogUser).use(CatchError);
