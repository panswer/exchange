import AWS from "aws-sdk";
import {
  DocumentClient,
  PutItemOutput,
  QueryOutput,
} from "aws-sdk/clients/dynamodb";
import {
  NewCurrencyRequestParam,
} from "../interfaces/DynamodbService";

export default class DynamodbService {
  private static dynamodbInstance?: DynamodbService;

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
   * @param {NewCurrencyRequestParam} currencyRequestParam - currency parameters
   *
   * @returns {Promise<PutItemOutput>}
   */
  async saveItem(
    saveItemParam: NewCurrencyRequestParam
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
        TableName: saveItemParam.tableName,
        Item: saveItemParam,
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

  // getTableNameRequestCurrency(): string {
  //   return this.DYNAMO_DB_TABLE_NAME;
  // }

  // getIndexUsername(): string {
  //   return this.DYNAMO_DB_TABLE_CURRENCY_USER_REQUEST_INDEX;
  // }
}
