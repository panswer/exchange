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
// import DynamodbService from "../services/DynamodbService";
import CurrencyRequestModel from "../models/CurrencyRequestModel";
import { SortBy } from "../enums/DynamoDBSortEnum";

const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const sort =
    event.queryStringParameters?.sort === SortBy.asc ? SortBy.asc : SortBy.desc;
  const logger = Logger.getInstance();
  const currencyRequestModel = CurrencyRequestModel.getInstance();
  // const dynamodbService = DynamodbService.getInstance();

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.info,
    message: "Get history request start",
    data: { user: event.requestContext.authorizer!.claims.username, sort },
  });

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.debug,
    message: "Query String",
    data: {
      query: event.queryStringParameters,
    },
  });
  const result = await currencyRequestModel.getRequestsByUsername(
    event.requestContext.authorizer!.claims.username,
    sort
  );
  // const result = await dynamodbService.getRequests(
  //   event.requestContext.authorizer!.claims.username,
  //   sort
  // );

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.info,
    message: "Get history request success",
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

export const handler = middy(lambdaHandler).use(LogUser).use(CatchError);
