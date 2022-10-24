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

    const withoutData = ["from", "to", "amount"].filter((key) => {
      return !Boolean(body[key]) && typeof body[key] === "string";
    });

    if (withoutData.length > 0) {
      throw new Error(`${withoutData.join(", ")} without data`);
    }
  },
};
