import { MiddlewareInterface } from "../interfaces/globalInterface";

export const CurrencyMiddleware = {
  /**
   * Validation of currency lambda
   *
   * @param request - request
   *
   * @returns {void}
   */
  before: (request: MiddlewareInterface): void => {
    const body: any = request.event.body!;

    /**
     * Key string without data and required
     *
     * @type {Array<string>}
     */
    const withoutStringData = ["from", "to"].filter((key) => {
      return !Boolean(body[key]) || typeof body[key] !== "string";
    });

    const withoutNumberData = ["amount"].filter((key) => {
      return !Boolean(body[key]) || body[key] < 0;
    });

    if (withoutStringData.length > 0 || withoutNumberData.length > 0) {
      throw new Error(
        `${withoutStringData.concat(withoutNumberData).join(", ")} without data`
      );
    }
  },
};
