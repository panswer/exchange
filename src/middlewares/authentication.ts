import middy from "@middy/core";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Callback,
} from "aws-lambda";

import CognitoService from "../services/CognitoService";

const lambdahandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  const accessToken: any =
    event.headers.Authorization || event.headers.authorization;

  if (!accessToken) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "unathorized",
      }),
    };
  }

  const cognitoService = CognitoService.getInstance();
  const userSession = await cognitoService.decodeSessionToken(accessToken);

  console.log("#".repeat(50));
  console.log(userSession);
  console.log("#".repeat(50));

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
    }),
  };
};

export const handler = middy(lambdahandler);
