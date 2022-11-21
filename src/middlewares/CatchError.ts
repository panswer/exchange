import Logger from "../utils/Logger";
import { MiddlewareInterface } from "../interfaces/globalInterface";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import { PersonalError } from "../interfaces/globalInterface";

export const CatchError = {
  /**
   * Show error in lambda and change response
   *
   * @param request - request
   *
   * @returns {void}
   */
  onError: (request: MiddlewareInterface): void => {
    const error: PersonalError = request.error;

    if (error) {
      const logger = Logger.getInstance();
      let message = error?.message;
      let statusCode = 500;

      if (request.event.body) {
        logger.writeLogger({
          functionName: request.context.functionName,
          level: LoggerLevel.error,
          message: error?.message,
          data: { body: request.event.body },
        });
      } else {
        logger.writeLogger({
          functionName: request.context.functionName,
          level: LoggerLevel.error,
          message: error?.message,
        });
      }

      if (
        error?.cause instanceof Array &&
        error?.cause.length > 0
      ) {
        const firstCause = error.cause.shift()!;

        message = firstCause.message;
        statusCode = error.statusCode;
      }

      request.response = {
        ...request.response,
        statusCode,
        body: JSON.stringify({
          message,
        }),
      };
    }
  },
};

export default CatchError;
