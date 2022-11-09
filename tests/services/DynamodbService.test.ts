import { AWSError } from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import {
  NewCurrencyRequest,
  NewCurrencyRequestParam,
} from "../../src/interfaces/DynamodbService";

import DynamodbService from "../../src/services/DynamodbService";

process.env.currencyRequestTableName = "123";
process.env.currencyRequestTableCurrencyUserRequestIndex = "123";
process.env.REGION = "123";

const dynamodbDocumentClient = "DynamoDB.DocumentClient";

describe("Dynamodb Services - Save request", () => {
  beforeEach(() => {
    AWSMock.restore(dynamodbDocumentClient);
  });
  afterEach(() => {
    DynamodbService.destroyInstance();
  });

  test("Get an instance", () => {
    const dynamodbService = DynamodbService.getInstance();

    expect(dynamodbService).toBeInstanceOf(DynamodbService);
  });

  test("Get twice the same instance", () => {
    const dynamodbService = DynamodbService.getInstance();
    const dynamodbService2 = DynamodbService.getInstance();

    expect(dynamodbService).toBe(dynamodbService2);
  });

  test("Destroy instance", () => {
    const dynamodbService = DynamodbService.getInstance();

    DynamodbService.destroyInstance();

    const dynamodbService2 = DynamodbService.getInstance();

    expect(dynamodbService).not.toBe(dynamodbService2);
  });

  test("Save a request", async () => {
    AWSMock.mock(dynamodbDocumentClient, "put", (param, callback) => {
      callback(undefined, {});
    });

    const query: NewCurrencyRequest = {
      amount: 10,
      amountResult: 10,
      createdAt: new Date().getTime(),
      currencyFrom: "USD",
      currencyRequestId: "1234",
      currencyTo: "EUR",
      username: "test@mftech.io",
    };

    const param: NewCurrencyRequestParam = {
      data: query,
      tableName: process.env.currencyRequestTableName!,
    };

    const dynamodbService = DynamodbService.getInstance();

    const result = await dynamodbService.saveItem(param);

    expect(result).toStrictEqual({});
  });

  test("Error to save a request", () => {
    const error: AWSError = {
      code: "test",
      message: "Error test",
      name: "Unit test",
      time: new Date(),
    };
    AWSMock.mock(dynamodbDocumentClient, "put", (_param, callback) => {
      callback(error);
    });

    const query: NewCurrencyRequest = {
      amount: 10,
      amountResult: 10,
      createdAt: new Date().getTime(),
      currencyFrom: "USD",
      currencyRequestId: "1234",
      currencyTo: "EUR",
      username: "test@mftech.io",
    };

    const param: NewCurrencyRequestParam = {
      data: query,
      tableName: process.env.currencyRequestTableName!,
    };

    const dynamodbService = DynamodbService.getInstance();

    expect(dynamodbService.saveItem(param)).rejects.toHaveProperty(
      "message",
      error.message
    );
  });

  test("Get requests", async () => {
    AWSMock.mock(dynamodbDocumentClient, "query", (param, callback) => {
      callback(undefined, {});
    });

    const query: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: "123",
      IndexName: "123",
      KeyConditionExpression: "#username = :username",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":username": "test@mftech.io",
      },
      ScanIndexForward: true,
    };

    const dynamodbService = DynamodbService.getInstance();

    const result = await dynamodbService.doQuery(query);

    expect(result).toStrictEqual({});
  });

  test("Error to get requests", () => {
    const error: AWSError = {
      code: "test",
      message: "error test",
      name: "Unit test",
      time: new Date(),
    };

    AWSMock.mock(dynamodbDocumentClient, "query", (_param, callback) => {
      callback(error);
    });

    const query: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: "123",
      IndexName: "123",
      KeyConditionExpression: "#username = :username",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":username": "test@mftech.io",
      },
      ScanIndexForward: true,
    };

    const dynamodbService = DynamodbService.getInstance();

    expect(dynamodbService.doQuery(query)).rejects.toHaveProperty(
      "message",
      error.message
    );
  });
});
