import { APIGatewayProxyResult } from "aws-lambda";
import _ from "lodash";
import {
  httpRequestData,
  MiddlewareRequest,
  MiddlewareResponse,
} from "./interfaces/httpRequest";

const APP_ROOT = "../../src";

/**
 * Do request to lambda function
 *
 * @param functionName - function name
 * @param data - data on request
 *
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const doRequest = async (
  functionName: string,
  data: httpRequestData
): Promise<APIGatewayProxyResult> => {
  const handler = require(`${APP_ROOT}/controllers/${functionName}`).handler;

  const event = {
    body: data.body,
    headers: data.headers,
    requestContext: data.requestContext,
    queryStringParameters: data.queryStringParameters,
  };

  const callback = (err, res) => {
    if (err) {
      throw err;
    } else {
      const contentType = _.get(
        res,
        "headers.content-type",
        "application/json"
      );

      if (res.body && contentType === "application/json") {
        try {
          res.body = JSON.parse(res.body);
        } catch (error) {
          console.log(error);
        }
      }
    }

    return res;
  };

  const context = {
    done() {
      callback(undefined, { statusCode: 200 });
    },
    succeed() {
      callback(undefined, { statusCode: 200 });
    },
    fail() {
      callback(undefined, { statusCode: 200 });
    },
    functionName,
  };
  const res = await handler(event, context, callback);

  return res;
};

/**
 * Call a middlware
 *
 * @param middlewareName - middleware name
 * @param callMethod - method in middleware file
 * @param data - it's data to middleware
 *
 * @returns {Promise<MiddlewareResponse>}
 */
export const runMiddleware = async (
  middlewareName: string,
  callMethod: string,
  data?: MiddlewareRequest
): Promise<MiddlewareResponse> => {
  const middleware = require(`${APP_ROOT}/middlewares/${middlewareName}`);
  const dataRequest = {
    context: {
      functionName: middlewareName,
      ...data?.context,
    },
    ...data,
  };

  const middlewaresMethods = ["before", "onError", "after"];

  const result: MiddlewareResponse = {};

  await Promise.all(
    middlewaresMethods.map(async (methodName) => {
      const method = middleware[callMethod][methodName];
      if (typeof method === "function") {
        await method(dataRequest);

        result[methodName] = dataRequest.response;
      }
    })
  );

  return result;
};
