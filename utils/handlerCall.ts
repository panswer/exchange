import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEvent,
} from "aws-lambda";
import _, { result } from "lodash";
import { httpMethods } from "./enums/httpMethod";
import {
  httpRequestData,
  MiddlewareRequest,
  MiddlewareResponse,
} from "./interfaces/httpRequest";

const APP_ROOT = "../src";

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

  const identity: any = {};
  const requestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext> =
    {
      accountId: "",
      apiId: "",
      authorizer: undefined,
      protocol: "",
      httpMethod: "",
      identity: identity,
      path: "",
      stage: "",
      requestId: "",
      requestTimeEpoch: 0,
      resourceId: "",
      resourcePath: "",
    };

  const event: APIGatewayProxyEvent = {
    body: JSON.stringify(data.body),
    headers: {
      "Content-Type": "application/json",
      ...data.headers,
    },
    httpMethod: "",
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: "",
    pathParameters: {},
    queryStringParameters: {},
    requestContext,
    resource: "",
    stageVariables: {},
  };

  return new Promise((resolve, reject) => {
    const callback = (err, res) => {
      if (err) {
        reject(err);
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

      resolve(res);
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

    const res = handler(event, context, callback);

    if (res ?? res instanceof Promise) {
      res
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });

  // const event: APIGatewayEvent = {
  //   body: JSON.stringify(body),
  //   headers: {
  //     "Content-Type": "application/json",
  //     ...config.headers,
  //   },
  //   httpMethod: method,
  //   isBase64Encoded: false,
  //   multiValueHeaders: {},
  //   multiValueQueryStringParameters: {},
  //   path: "",
  //   pathParameters: config.pathParameters,
  //   queryStringParameters: config.queryStringParameters,
  //   requestContext,
  //   resource: "",
  //   stageVariables: {},
  // };
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
        result[methodName] = await method(dataRequest);
      }
    })
  );

  return result;
};
