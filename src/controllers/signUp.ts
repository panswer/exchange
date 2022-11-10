import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { SignUpRequestEvent } from "../interfaces/SignUpRequestInterface";
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
  event: APIGatewayProxyEvent & SignUpRequestEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const logger = Logger.getInstance();

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.debug,
    message: "Start lambdafunction(Sign Up)",
    data: { user: event.body.email },
  });

  const cognitoService = CognitoService.getInstance();

  let result = await cognitoService.createAnUser(event.body.email);
  await cognitoService.setPasswordToUser(event.body.email, event.body.password);

  logger.writeLogger({
    functionName: context.functionName,
    level: LoggerLevel.debug,
    message: "Finished function lambda (Sign Up)",
    data: { result, data: event.body },
  });
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "success",
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
