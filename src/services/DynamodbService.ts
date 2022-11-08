import AWS from "aws-sdk";
import {
  DocumentClient,
  PutItemOutput,
  QueryOutput,
} from "aws-sdk/clients/dynamodb";
// import { v4 as getCurrencyRequestId } from "uuid";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import {
  NewCurrencyRequest,
  CurrencyRequest,
} from "../interfaces/DynamodbService";
import Logger from "../utils/Logger";
import { SortBy } from "../enums/DynamoDBSortEnum";

export default class DynamodbService {
  private static dynamodbInstance?: DynamodbService;

  private readonly DYNAMO_DB_TABLE_NAME: string =
    process.env.currencyRequestTableName!;
  private readonly DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX =
    process.env.currencyRequestTableCurrencyUserRequestIndex!;
  private readonly REGION: string = process.env.REGION!;

  private dynamodb: DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
      region: this.REGION,
    });
  }

  /**
   * Get an instance
   *
   * @returns {DynamodbService}
   */
  static getInstance(): DynamodbService {
    if (!this.dynamodbInstance) {
      this.dynamodbInstance = new DynamodbService();
    }

    return this.dynamodbInstance;
  }

  static destroyInstance(): void {
    delete this.dynamodbInstance;
  }

  /**
   * Parse amount from a currency to other currency
   *
   * @param {object} currencyRequestParam - currency parameters
   * @param {string} currencyRequestParam.currencyTo - The currency to
   * @param {string} currencyRequestParam.currencyFrom - The currency from
   * @param {number} currencyRequestParam.amount - amount to change
   * @param {Date} [currencyRequestParam.createdAt] - when was the request
   * @param {number} currencyRequestParam.amountResult - total result
   *
   * @returns {Promise<PutItemOutput>}
   */
  async saveRequest(
    saveRequestParam: NewCurrencyRequest
  ): Promise<PutItemOutput> {
    // const createdAt = currencyRequestParam.createdAt || new Date();

    // const newCurrencyRequest: NewCurrencyRequest = {
    //   currencyRequestId: getCurrencyRequestId(),
    //   currencyFrom: currencyRequestParam.currencyFrom,
    //   currencyTo: currencyRequestParam.currencyTo,
    //   amount: currencyRequestParam.amount,
    //   createdAt: createdAt.getTime(),
    //   amountResult: currencyRequestParam.amountResult,
    //   username: currencyRequestParam.username,
    // };

    const currencyRequestDB = await this.dynamodb
      .put({
        TableName: this.DYNAMO_DB_TABLE_NAME,
        Item: saveRequestParam,
      })
      .promise();

    return currencyRequestDB;
  }

  /**
   * Get requests on table
   *
   * @param {string} username - username
   * @param {"1"|"0"} [sort] - sort the result by
   *
   * @returns {Promise<PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>>}
   */
  async doQuery(
    queryRequest: AWS.DynamoDB.DocumentClient.QueryInput
  ): Promise<QueryOutput> {
    // const logger = Logger.getInstance();

    // logger.writeLogger({
    //   functionName: "DynamodbService.getRequests",
    //   level: LoggerLevel.debug,
    //   message: "Start request",
    //   data: {
    //     username,
    //     table: this.DYNAMO_DB_TABLE_NAME,
    //     index: this.DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX,
    //   },
    // });

    // const query: AWS.DynamoDB.DocumentClient.QueryInput = {
    //   TableName: this.DYNAMO_DB_TABLE_NAME,
    //   IndexName: this.DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX,
    //   KeyConditionExpression: "#username = :username",
    //   ExpressionAttributeNames: {
    //     "#username": "username",
    //   },
    //   ExpressionAttributeValues: {
    //     ":username": username,
    //   },
    //   ScanIndexForward: sort === SortBy.asc,
    // };

    const result = await this.dynamodb.query(queryRequest).promise();

    // logger.writeLogger({
    //   functionName: "DynamodbService.getRequests",
    //   level: LoggerLevel.debug,
    //   message: "query result",
    //   data: result,
    // });
    return result;
  }

  getTableNameRequestCurrency(): string {
    return this.DYNAMO_DB_TABLE_NAME;
  }

  getIndexUsername(): string {
    return this.DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX;
  }
}
