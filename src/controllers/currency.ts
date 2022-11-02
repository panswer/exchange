import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { CurrencyEventRequestInterface } from "../interfaces/CurrencyRequestInterface";
import CurrencyApiService from "../services/CurrencyApiService";
import Logger from "../utils/Logger";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import CatchError from "../middlewares/CatchError";
import validator from "@middy/validator";
import { LogUser } from "../middlewares/LogUser";
import { CurrencyMiddleware } from "../middlewares/CurrencyMiddleware";
import DynamodbService from "../services/DynamodbService";

const lambdaHandler = async (
  event: APIGatewayProxyEvent & CurrencyEventRequestInterface,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const logger = Logger.getInstance();
  logger.writeLogger(
    context.functionName,
    LoggerLevel.debug,
    "Start lambda function (currency)",
    { user: event.requestContext.authorizer!.claims.username }
  );
  const request = event.body;

  const currencyApiService = CurrencyApiService.getInstance();

  const amounts = await currencyApiService.getExchangeCurrency(request);

  const dynamodbService = DynamodbService.getInstance();

  dynamodbService
    .saveRequest({
      currencyTo: event.body.to,
      currencyFrom: event.body.from,
      amount: amounts.query.amount,
      amountResult: amounts.result,
      username: event.requestContext.authorizer!.claims.username,
    })
    .then((res) => {
      logger.writeLogger(
        context.functionName,
        LoggerLevel.info,
        "Currency status successful",
        {
          currencyFrom: amounts.query.from,
          currencyTo: amounts.query.to,
          amount: amounts.query.amount,
          total: amounts.result,
          username: event.requestContext.authorizer!.claims.username,
        }
      );
    })
    .catch((err) => {
      logger.writeLogger(
        context.functionName,
        LoggerLevel.info,
        "Currency status failed",
        {
          currencyFrom: amounts.query.from,
          currencyTo: amounts.query.to,
          amount: amounts.query.amount,
          total: amounts.result,
          message: err.message,
          username: event.requestContext.authorizer!.claims.username,
        }
      );
    });

  logger.writeLogger(
    context.functionName,
    LoggerLevel.debug,
    "Finished lambda function (currency)",
    event.body
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      amounts,
    }),
  };
};

const inputSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: {
      type: "object",
      required: ["from", "to", "amount"],
      properties: {
        from: {
          type: "string",
        },
        to: {
          type: "string",
        },
        amount: {
          type: "number",
        },
      },
    },
  },
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(CatchError)
  .use(
    validator({
      inputSchema,
    })
  )
  .use(LogUser)
  .use(CurrencyMiddleware);
