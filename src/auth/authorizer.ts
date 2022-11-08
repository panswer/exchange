import middy from "@middy/core";
import validator from "@middy/validator";
import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import jwt from "jsonwebtoken";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import Logger from "../utils/Logger";

const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayAuthorizerResult> => {
  const logger = Logger.getInstance();
  logger.writeLogger(context.functionName, LoggerLevel.info, "Authorizer", {
    header: event.headers,
  });
  const bearerToken = event.headers.Authorization!;
  const token = bearerToken.split(" ").pop()!;

  const decode: string | jwt.JwtPayload | null = jwt.decode(token);

  if (typeof decode === "object" && decode?.sub) {
    return {
      principalId: decode["sub"],
      policyDocument: {
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
        Version: "2012-10-17",
      },
    };
  }

  logger.writeLogger(context.functionName, LoggerLevel.error, "Worst token");

  throw new Error("Authorizer error");
};

const schema = {
  type: "object",
  required: ["headers"],
  properties: {
    headers: {
      type: "object",
      required: ["Authorization"],
      properties: {
        Authorization: {
          type: "string",
        },
      },
    },
  },
};

export const handler = middy(lambdaHandler).use(
  validator({
    inputSchema: schema,
  })
);
