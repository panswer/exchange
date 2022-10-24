import { LoggerLevel } from "../enums/LoggerLevelEnum";
import { MiddlewareInterface } from "../interfaces/globalInterface";
import CognitoService from "../services/CognitoService";
import { UserAttributesEnum } from "../enums/AuthServiceEnum";

import Logger from "../utils/Logger";

export const LogUser = {
  /**
   * Verify session token
   *
   * @param request - request of middy
   *
   * @returns {Promise<void>}
   */
  before: async (request: MiddlewareInterface): Promise<void> => {
    const logger = Logger.getInstance();

    const username: string =
      request.event.requestContext.authorizer?.claims?.username;

    if (!username) {
      throw new Error("Unauthoriced");
    }

    const cognito = CognitoService.getInstance();

    const userCognito = await cognito.getUser(username);

    let attributeEmail = userCognito.UserAttributes!.filter(
      (attribute) => attribute.Name === UserAttributesEnum.EMAIL
    ).pop();

    logger.writeLogger(
      request.context.functionName,
      LoggerLevel.info,
      "User on session",
      { email: attributeEmail!.Value }
    );
  },
};
