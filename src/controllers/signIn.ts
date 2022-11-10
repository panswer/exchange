import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { SignInRequestEvent } from "../interfaces/SignInRequestInterface";
import Logger from "../utils/Logger";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import { CatchError } from "../middlewares/CatchError";
import validator from "@middy/validator";
import CognitoService from "../services/CognitoService";

const inputSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
  },
};

const lambdaHandler = async (
  event: APIGatewayProxyEvent & SignInRequestEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const logger = Logger.getInstance();

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.debug,
    message: "Init lambda function",
    data: { user: event.body.email },
  });
  const cognitoService = CognitoService.getInstance();
  const result = await cognitoService.getSessionToken(
    event.body.email,
    event.body.password
  );

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.debug,
    message: "Finished the lambda function (sign in)",
    data: { user: event.body.email },
  });

  return {
    statusCode: 202,
    body: JSON.stringify({
      success: true,
      result,
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
  );
