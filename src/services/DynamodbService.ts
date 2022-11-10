import AWS from "aws-sdk";
import {
  DocumentClient,
  PutItemOutput,
  QueryOutput,
} from "aws-sdk/clients/dynamodb";
import { NewCurrencyRequestParam } from "../interfaces/DynamodbService";

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
    const result = await this.dynamodb.query(queryRequest).promise();

    return result;
  }
}
