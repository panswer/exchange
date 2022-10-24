import AWS from "aws-sdk";
import {
  DocumentClient,
  PutItemOutput,
  QueryOutput,
} from "aws-sdk/clients/dynamodb";
import { v4 as getCurrencyRequestId } from "uuid";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import { NewCurrencyRequest } from "../interfaces/DynamodbService";
import Logger from "../utils/Logger";
import { SortBy } from "../enums/DynamoDBSortEnum";

export default class DynamodbService {
  private static dynamodbInstance: DynamodbService;

  private readonly DYNAMO_DB_TABLE_NAME: string =
    process.env.currencyRequestTableName!;

  private readonly DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX =
    process.env.currencyRequestTableCurrencyUserRequestIndex!;
  private dynamodb: DocumentClient;
  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
    });
  }

  /**
   * Get an instance
   *
   * @returns {DynamodbService}
   */
  static getInstance(): DynamodbService {
    let dynamodbInstance: DynamodbService = this.dynamodbInstance;

    if (!dynamodbInstance) {
      dynamodbInstance = new DynamodbService();
    }

    return dynamodbInstance;
  }

  /**
   * Parse amount from a currency to other currency
   *
   * @param currencyTo - The currency to
   * @param currencyFrom - The currency from
   * @param amount - amount to change
   * @param createdAt - when was the request
   * @param amountResult - total result
   *
   * @returns {Promise<PutItemOutput>}
   */
  async saveRequest(
    currencyTo: string,
    currencyFrom: string,
    amount: number,
    createdAt: Date = new Date(),
    amountResult: number,
    username: string
  ): Promise<PutItemOutput> {
    const newCurrencyRequestId: NewCurrencyRequest = {
      currencyRequestId: getCurrencyRequestId(),
      currencyFrom,
      currencyTo,
      amount,
      createdAt: createdAt.getTime(),
      amountResult,
      username,
    };

    const currencyRequest = await this.dynamodb
      .put({
        TableName: this.DYNAMO_DB_TABLE_NAME,
        Item: newCurrencyRequestId,
      })
      .promise();

    return currencyRequest;
  }

  /**
   * Get requests on table
   *
   * @param {string} username - username
   * @param {"1"|"0"} [sort] - sort the result by
   *
   * @returns {Promise<PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>>}
   */
  async getRequests(
    username: string,
    sort: SortBy = SortBy.asc
  ): Promise<QueryOutput> {
    const logger = Logger.getInstance();

    logger.writeLogger(
      "DynamodbService.getRequests",
      LoggerLevel.debug,
      "Start request",
      {
        username,
        table: this.DYNAMO_DB_TABLE_NAME,
        index: this.DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX,
      }
    );

    const query: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.DYNAMO_DB_TABLE_NAME,
      IndexName: this.DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX,
      KeyConditionExpression: "#username = :username",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":username": username,
      },
      ScanIndexForward: sort === "1",
    };

    const result = await this.dynamodb.query(query).promise();

    logger.writeLogger(
      "DynamodbService.getRequests",
      LoggerLevel.debug,
      "query result",
      result
    );
    return result;
  }
}
