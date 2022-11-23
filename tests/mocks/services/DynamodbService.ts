import { AWSError } from "aws-sdk";
export const paramsGoodPutRequestMock = {
  data: {
    amount: 10,
    amountResult: 10,
    createdAt: new Date().getTime(),
    currencyFrom: "USD",
    currencyRequestId: "1234",
    currencyTo: "EUR",
    username: "test@mftech.io",
  },
  tableName: process.env.currencyRequestTableName!,
};

export const paramsGoodQueryRequestMock = {
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

export const dynamodbErrorMock: AWSError = {
  code: "test",
  message: "Error test",
  name: "Unit test",
  time: new Date(),
};
