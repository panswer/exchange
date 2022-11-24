import CurrencyRequestModel from "../../src/models/CurrencyRequestModel";

import * as AWSMock from "aws-sdk-mock";

import { requestDataSuccessMock } from "../mocks/models/CurrencyRequestModel";

const dynamodbDocumentClient = "DynamoDB.DocumentClient";

describe("CurrencyRequestModel - models", () => {
  describe("Should test to get and reset the class", () => {
    it("Should test to get an instance of CurrencyRequestModel", () => {
      const currencyRequestModel = CurrencyRequestModel.getInstance();

      expect(currencyRequestModel).toBeInstanceOf(CurrencyRequestModel);
    });

    it("Should test to get the same instance two times", () => {
      const currencyRequestModel1 = CurrencyRequestModel.getInstance();
      const currencyRequestModel2 = CurrencyRequestModel.getInstance();

      expect(currencyRequestModel1).toBe(currencyRequestModel2);
    });

    it("Should test to get an instance and destroy it", () => {
      const currencyRequest1 = CurrencyRequestModel.getInstance();

      CurrencyRequestModel.destroyInstance();

      const currencyRequest2 = CurrencyRequestModel.getInstance();

      expect(currencyRequest1).not.toBe(currencyRequest2);
    });
  });

  describe("Test about methods of class", () => {
    beforeEach(() => {
      CurrencyRequestModel.destroyInstance();
    });
    afterEach(() => {
      AWSMock.restore(dynamodbDocumentClient);
    });

    it("Should save a new currency request", () => {
      AWSMock.mock(dynamodbDocumentClient, "put", (param, callback) => {
        callback(undefined, {});
      });

      const currencyRequestModel = CurrencyRequestModel.getInstance();

      expect(
        currencyRequestModel.saveCurrencyRequest(requestDataSuccessMock)
      ).resolves.toStrictEqual({});
    });

    it("Should get a list of currency request by username on session", () => {
      AWSMock.mock(dynamodbDocumentClient, "query", (param, callback) => {
        callback(undefined, {});
      });
      const currencyRequestModel = CurrencyRequestModel.getInstance();

      expect(
        currencyRequestModel.getRequestsByUsername("test@mftech.io")
      ).resolves.toStrictEqual({});
    });
  });
});
