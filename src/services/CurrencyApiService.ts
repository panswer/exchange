import axios from "axios";
import { ApiLayerPathEnum } from "../enums/ApiLayerPathEnum";
import { ApiLayerResponseInterface } from "../interfaces/ApiLayerResponseInterface";
import { CurrencyRequestInterface } from "../interfaces/CurrencyRequestInterface";
import Logger from "../utils/Logger";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
export default class CurrencyApiService {
  private static instance?: CurrencyApiService;
  private readonly API_LAYER_KEY: string = process.env.API_LAYER_KEY!;
  private readonly API_LAYER_URL: string = process.env.API_LAYER_URL!;

  private constructor() {}

  /**
   * Verify and create a new instance of Currency Api Service
   *
   * @returns {CurrencyApiService}
   */
  static getInstance(): CurrencyApiService {
    if (!CurrencyApiService.instance) {
      CurrencyApiService.instance = new CurrencyApiService();
    }

    return CurrencyApiService.instance;
  }

  /**
   * Destroy instance of Currency Api Service
   *
   * @returns {void}
   */
  static destroyInstance(): void {
    this.instance = undefined;
  }

  /**
   * Get change between currencies
   *
   * @param {CurrencyRequestInterface} request - Request object
   *
   * @returns {Promise<ApiLayerResponseInterface>}
   */
  async getExchangeCurrency(
    request: CurrencyRequestInterface
  ): Promise<ApiLayerResponseInterface> {
    const logger = Logger.getInstance();
    const path = ApiLayerPathEnum.FIXER_CONVERT;

    const preparedPath = path
      .replace("{to}", request.to)
      .replace("{from}", request.from)
      .replace("{amount}", request.amount.toString());

    const url = this.API_LAYER_URL + preparedPath;
    logger.writeLogger(
      "getExchangeCurrency",
      LoggerLevel.debug,
      "Path to API Layer",
      { url: preparedPath }
    );

    const response = await axios.get(url, {
      headers: {
        apikey: this.API_LAYER_KEY,
      },
      timeout: 30000,
    });

    return response.data;
  }
}
