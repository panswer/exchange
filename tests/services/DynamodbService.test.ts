import * as AWSMock from "aws-sdk-mock";

import DynamodbService from "../../src/services/DynamodbService";

process.env.currencyRequestTableName = "123";
process.env.currencyRequestTableCurrencyUserRequestIndex = "123";
process.env.REGION = "123";

const dynamodbDocumentClient = "DynamoDB.DocumentClient";

AWSMock.mock(dynamodbDocumentClient, "put", (param, callback) => {
  callback(undefined, {});
});

AWSMock.mock(dynamodbDocumentClient, "query", (param, callback) => {
  callback(undefined, {});
});

describe("Dynamodb Services - Save request", () => {
  test("Get an instance", () => {
    const dynamodbService = DynamodbService.getInstance();

    expect(typeof dynamodbService).toBe("object");
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
    const dynamodbService = DynamodbService.getInstance();

    const result = await dynamodbService.saveRequest(
      "USD",
      "EUR",
      1,
      new Date(),
      1,
      "ricardo@mftech.io"
    );

    expect(typeof result).toBe("object");
  });

  test("Get requests", async () => {
    const dynamodbService = DynamodbService.getInstance();

    const result = await dynamodbService.getRequests("ricardo@mftech.io");

    expect(typeof result).toBe("object");
  });
});
