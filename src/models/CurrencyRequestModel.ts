import {
  CurrencyRequest,
  NewCurrencyRequest,
} from "../interfaces/DynamodbService";
import DynamodbService from "../services/DynamodbService";
import { v4 as getCurrencyRequestId } from "uuid";
import { PutItemOutput, QueryOutput } from "aws-sdk/clients/dynamodb";
import { SortBy } from "../enums/DynamoDBSortEnum";

export default class CurrencyRequestModel extends DynamodbService {
  private static currencyRequestModelInstance?: CurrencyRequestModel;

  /**
   * Get an instance
   *
   * @returns {CurrencyRequestModel}
   */
  static getInstance(): CurrencyRequestModel {
    let currencyRequestModelInstance = this.currencyRequestModelInstance;
    if (!currencyRequestModelInstance) {
      currencyRequestModelInstance = new CurrencyRequestModel();
    }

    return currencyRequestModelInstance;
  }

  /**
   * Destroy an instance
   *
   * @returns {void}
   */
  static destroyInstance(): void {
    delete this.currencyRequestModelInstance;
  }

  /**
   * Save currency request (Build request)
   *
   * @param {CurrencyRequest} currencyRequestParam
   *
   * @returns {Promise<PutItemOutput>}
   */
  async saveCurrencyRequest(
    currencyRequestParam: CurrencyRequest
  ): Promise<PutItemOutput> {
    const createdAt = currencyRequestParam.createdAt || new Date();

    const newCurrencyRequest: NewCurrencyRequest = {
      currencyRequestId: getCurrencyRequestId(),
      currencyFrom: currencyRequestParam.currencyFrom,
      currencyTo: currencyRequestParam.currencyTo,
      amount: currencyRequestParam.amount,
      createdAt: createdAt.getTime(),
      amountResult: currencyRequestParam.amountResult,
      username: currencyRequestParam.username,
    };

    const currencyRequestDB = await this.saveRequest(newCurrencyRequest);

    return currencyRequestDB;
  }

  /**
   * List requests by username (build request)
   *
   * @param {string} username
   * @param {SortBy} sort
   *
   * @returns {Promise<QueryOutput>}
   */
  async getRequestsByUsername(
    username: string,
    sort: SortBy = SortBy.asc
  ): Promise<QueryOutput> {
    const query: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.getTableNameRequestCurrency(),
      IndexName: this.getIndexUsername(),
      KeyConditionExpression: "#username = :username",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":username": username,
      },
      ScanIndexForward: sort === SortBy.asc,
    };

    const requestDb = await this.doQuery(query);

    return requestDb;
  }
}
