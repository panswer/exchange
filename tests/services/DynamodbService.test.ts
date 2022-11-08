import * as AWSMock from "aws-sdk-mock";
import { SortBy } from "../../src/enums/DynamoDBSortEnum";
import { NewCurrencyRequest } from "../../src/interfaces/DynamodbService";

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
    const query: NewCurrencyRequest = {
      amount: 10,
      amountResult: 10,
      createdAt: new Date().getTime(),
      currencyFrom: "USD",
      currencyRequestId: "1234",
      currencyTo: "EUR",
      username: "test@mftech.io",
    };

    const dynamodbService = DynamodbService.getInstance();

    const result = await dynamodbService.saveRequest(query);

    expect(typeof result).toBe("object");
  });

  test("Get requests", async () => {
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

    expect(typeof result).toBe("object");
  });
});
