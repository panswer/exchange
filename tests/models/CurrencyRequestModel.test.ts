import CurrencyRequestModel from "../../src/models/CurrencyRequestModel";

import * as AWSMock from "aws-sdk-mock";

const dynamodbDocumentClient = "DynamoDB.DocumentClient";
const mockDynamodbClient = jest.fn(() => Promise.resolve({}));

// afterEach(() => {
//   AWSMock.restore(dynamodbDocumentClient);
// });

describe("Currency Request Model", () => {
  beforeEach(() => {
    AWSMock.restore(dynamodbDocumentClient);
  });
  afterEach(() => {
    CurrencyRequestModel.destroyInstance();
  });
  test("Get an instance", () => {
    const currencyRequestModel = CurrencyRequestModel.getInstance();

    expect(currencyRequestModel).toBeInstanceOf(CurrencyRequestModel);
  });

  test("Get the same instance two times", () => {
    const currencyRequestModel1 = CurrencyRequestModel.getInstance();
    const currencyRequestModel2 = CurrencyRequestModel.getInstance();

    expect(currencyRequestModel1).toBe(currencyRequestModel2);
  });

  test("Destroy an old instance", () => {
    const currencyRequest1 = CurrencyRequestModel.getInstance();

    CurrencyRequestModel.destroyInstance();

    const currencyRequest2 = CurrencyRequestModel.getInstance();

    expect(currencyRequest1).not.toBe(currencyRequest2);
  });

  test("Save a currency request", async () => {
    AWSMock.mock(dynamodbDocumentClient, "put", (param, callback) => {
      callback(undefined, {});
    });
    const currencyRequestModel = CurrencyRequestModel.getInstance();

    const result = await currencyRequestModel.saveCurrencyRequest({
      amount: 1,
      amountResult: 1,
      currencyFrom: "USD",
      currencyTo: "EUR",
      username: "ricardo@mftech.io",
    });

    expect(result).toStrictEqual({});
  });

  test("Get all currencies request by username", async () => {
    AWSMock.mock(dynamodbDocumentClient, "query", (param, callback) => {
      callback(undefined, {});
    });
    const currencyRequestModel = CurrencyRequestModel.getInstance();

    const result = await currencyRequestModel.getRequestsByUsername(
      "test@mftech.io"
    );

    expect(result).toStrictEqual({});
  });
});
