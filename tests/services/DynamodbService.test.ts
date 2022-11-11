import * as AWSMock from "aws-sdk-mock";

import DynamodbService from "../../src/services/DynamodbService";

import {
  paramsGoodPutRequest,
  paramsGoodQueryRequest,
  dynamodbError,
} from "../mocks/services/DynamodbService";

process.env.currencyRequestTableName = "123";
process.env.currencyRequestTableCurrencyUserRequestIndex = "123";
process.env.REGION = "123";

const dynamodbDocumentClient = "DynamoDB.DocumentClient";

describe("DynamodbService - services", () => {
  describe("Should test to get an intance and destroy it", () => {
    test("Should test to get an instance", () => {
      const dynamodbService = DynamodbService.getInstance();

      expect(dynamodbService).toBeInstanceOf(DynamodbService);
    });

    test("Should test to get twice the same instance", () => {
      const dynamodbService = DynamodbService.getInstance();
      const dynamodbService2 = DynamodbService.getInstance();

      expect(dynamodbService).toBe(dynamodbService2);
    });

    test("Should test to destroy an instance and get new instance", () => {
      const dynamodbService = DynamodbService.getInstance();

      DynamodbService.destroyInstance();

      const dynamodbService2 = DynamodbService.getInstance();

      expect(dynamodbService).not.toBe(dynamodbService2);
    });
  });

  describe("Should test the methods on class", () => {
    beforeEach(() => {
      DynamodbService.destroyInstance();
    });
    afterEach(() => {
      AWSMock.restore(dynamodbDocumentClient);
    });

    test("Should test to save a request", () => {
      AWSMock.mock(dynamodbDocumentClient, "put", (_param, callback) => {
        callback(undefined, {});
      });
      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.saveItem(paramsGoodPutRequest)
      ).resolves.toStrictEqual({});
    });

    test("Error to save a request", () => {
      AWSMock.mock(dynamodbDocumentClient, "put", (_param, callback) => {
        callback(dynamodbError);
      });

      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.saveItem(paramsGoodPutRequest)
      ).rejects.toHaveProperty("message", dynamodbError.message);
    });

    test("Get requests", () => {
      AWSMock.mock(dynamodbDocumentClient, "query", (_param, callback) => {
        callback(undefined, {});
      });

      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.doQuery(paramsGoodQueryRequest)
      ).resolves.toStrictEqual({});
    });

    test("Error to get requests", () => {
      AWSMock.mock(dynamodbDocumentClient, "query", (_param, callback) => {
        callback(dynamodbError);
      });

      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.doQuery(paramsGoodQueryRequest)
      ).rejects.toHaveProperty("message", dynamodbError.message);
    });
  });
});
