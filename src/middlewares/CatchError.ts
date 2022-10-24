import Logger from "../utils/Logger";
import { MiddlewareInterface } from "../interfaces/globalInterface";
import { LoggerLevel } from "../enums/LoggerLevelEnum";

export const CatchError = {
  /**
   * Show error in lambda and change response
   *
   * @param request - request
   *
   * @returns {void}
   */
  onError: (request: MiddlewareInterface): void => {
    if (request.error) {
      const logger = Logger.getInstance();

      if (request.event.body) {
        logger.writeLogger(
          request.context.functionName,
          LoggerLevel.error,
          request.error?.message,
          { data: request.event.body }
        );
      } else {
        logger.writeLogger(
          request.context.functionName,
          LoggerLevel.error,
          request.error.message
        );
      }

      request.response = {
        ...request.response,
        statusCode: 500,
        body: JSON.stringify({
          message: request.error.message,
        }),
      };
    }
  },
};

export default CatchError;
