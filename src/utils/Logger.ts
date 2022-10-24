import {
  LoggerLevel,
  LoggerTemplate,
  LoggerStage,
} from "../enums/LoggerLevelEnum";
import { LoggerParam } from "../interfaces/LoggerParamsInterface";

export default class Logger {
  private static loggerInterface?: Logger;
  private showLogs: any[] = [];

  constructor(params: LoggerParam) {
    Object.keys(params).forEach((key) => {
      this.showLogs.push(key);
    });
  }

  /**
   * Get an instance of logger
   *
   * @returns {Logger}
   */
  static getInstance(): Logger {
    const defaultValue: LoggerParam = this.getObtionLogger();

    if (!Logger.loggerInterface) {
      Logger.loggerInterface = new Logger(defaultValue);
    }

    return Logger.loggerInterface;
  }

  /**
   * Delete instance of logger
   *
   * @returns {void}
   */
  static destroyInstance(): void {
    delete Logger.loggerInterface;
  }

  /**
   * Get which log will be showing
   *
   * @returns {LoggerParam}
   */
  static getObtionLogger(): LoggerParam {
    let config: LoggerParam = {};

    switch (process.env.stage) {
      case LoggerStage.DEV:
        config = {
          debug: true,
          error: true,
          info: true,
          warning: true,
        };
        break;
      case LoggerStage.PRE_STA:
        config = {
          debug: true,
          error: true,
          info: true,
          warning: true,
        };
      case LoggerStage.STA:
        config = {
          debug: true,
          error: true,
          info: true,
        };
      default:
        config = {
          error: true,
          info: true,
        };
        break;
    }

    return config;
  }

  writeLogger(
    functionName: string,
    level: LoggerLevel,
    message: string,
    data?: object
  ) {
    if (this.showLogs.includes(level)) {
      this.showLog(functionName, new Date().toUTCString(), level, message, data);
    }
  }

  private showLog(
    functionName: string,
    file: string,
    level: LoggerLevel,
    message: string,
    data?: object
  ) {
    let logTemplate;

    data
      ? (logTemplate = LoggerTemplate.DEFAULT)
      : (logTemplate = LoggerTemplate.DEFAULT_WITHOUT_DATA);

    const logMessage = logTemplate
      .replace("{level}", level)
      .replace("{functionName}", functionName)
      .replace("{file}", file)
      .replace("{message}", message)
      .replace("{data}", JSON.stringify(data));

    console.log(logMessage);
  }
}
