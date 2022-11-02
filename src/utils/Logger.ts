import {
  LoggerLevel,
  LoggerTemplate,
  LoggerStage,
} from "../enums/LoggerLevelEnum";
import {
  LoggerParam,
  WriteLoggerParam,
  ShowLogParam,
} from "../interfaces/LoggerParamsInterface";

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
        break;
      case LoggerStage.STA:
        config = {
          debug: true,
          error: true,
          info: true,
        };
        break;
    }

    return config;
  }

  /**
   * Request a log in console
   *
   * @param {object} loggerParam - logger parameters
   * @param {string} loggerParam.functionName - function name
   * @param {string} loggerParam.level - log level
   * @param {string} loggerParam.message - log message
   * @param {object} [loggerParam.data] - data for log
   */
  writeLogger(loggerParam: WriteLoggerParam) {
    if (this.showLogs.includes(loggerParam.level)) {
      this.showLog({
        functionName: loggerParam.functionName,
        time: new Date().toUTCString(),
        level: loggerParam.level,
        message: loggerParam.message,
        data: loggerParam.data,
      });
    }
  }

  /**
   * Print log
   *
   * @param {object} showLogParam - show log's parameters
   * @param {string} showLogParam.functionName - function name
   * @param {string} showLogParam.time - time
   * @param {import('../enums/LoggerLevelEnum').LoggerLevel} showLoglevel - log level
   * @param {string} message - log message
   * @param data - log data
   */
  private showLog(showLogParam: ShowLogParam) {
    let logTemplate: LoggerTemplate;

    showLogParam.data
      ? (logTemplate = LoggerTemplate.DEFAULT)
      : (logTemplate = LoggerTemplate.DEFAULT_WITHOUT_DATA);

    const logMessage = logTemplate
      .replace("{level}", showLogParam.level)
      .replace("{functionName}", showLogParam.functionName)
      .replace("{time}", showLogParam.time)
      .replace("{message}", showLogParam.message)
      .replace("{data}", JSON.stringify(showLogParam.data));

    console.log(logMessage);
  }
}
