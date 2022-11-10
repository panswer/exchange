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
import CurrencyRequestModel from "../models/CurrencyRequestModel";

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

const lambdaHandler = async (
  event: APIGatewayProxyEvent & CurrencyEventRequestInterface,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const logger = Logger.getInstance();
  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.info,
    message: "Start lambda function (currency)",
    data: { user: event.requestContext.authorizer!.claims.username },
  });
  const request = event.body;

  const currencyApiService = CurrencyApiService.getInstance();

  const amounts = await currencyApiService.getExchangeCurrency(request);

  const currencyRequestModel = CurrencyRequestModel.getInstance();

  await currencyRequestModel.saveCurrencyRequest({
    amount: event.body.amount,
    amountResult: amounts.result,
    currencyFrom: event.body.from,
    currencyTo: event.body.to,
    username: event.requestContext.authorizer?.claims.username,
  });

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.info,
    message: "Finished lambda function (currency)",
    data: event.body,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      amounts,
    }),
  };
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
