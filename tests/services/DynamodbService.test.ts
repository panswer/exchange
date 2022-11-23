import * as AWSMock from "aws-sdk-mock";

import DynamodbService from "../../src/services/DynamodbService";

import {
  paramsGoodPutRequestMock,
  paramsGoodQueryRequestMock,
  dynamodbErrorMock,
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

    test("Should save a request", () => {
      AWSMock.mock(dynamodbDocumentClient, "put", (_param, callback) => {
        callback(undefined, {});
      });
      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.saveItem(paramsGoodPutRequestMock)
      ).resolves.toStrictEqual({});
    });

    test("When there's an error to save", () => {
      AWSMock.mock(dynamodbDocumentClient, "put", (_param, callback) => {
        callback(dynamodbErrorMock);
      });

      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.saveItem(paramsGoodPutRequestMock)
      ).rejects.toHaveProperty("message", dynamodbErrorMock.message);
    });

    test("Should get a list of request", () => {
      AWSMock.mock(dynamodbDocumentClient, "query", (_param, callback) => {
        callback(undefined, []);
      });

      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.doQuery(paramsGoodQueryRequestMock)
      ).resolves.toStrictEqual([]);
    });

    test("When there's an error to get requests", () => {
      AWSMock.mock(dynamodbDocumentClient, "query", (_param, callback) => {
        callback(dynamodbErrorMock);
      });

      const dynamodbService = DynamodbService.getInstance();

      expect(
        dynamodbService.doQuery(paramsGoodQueryRequestMock)
      ).rejects.toHaveProperty("message", dynamodbErrorMock.message);
    });
  });
});
