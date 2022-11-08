import { runMiddleware } from "../../utils/handlerCall";
import { MiddlewareResponse } from "../../utils/interfaces/httpRequest";

const middlewareName = "CurrencyMiddleware";

describe("Verify - CurrencyMiddleware", () => {
  test("Body with all data", async () => {
    const body = {
      from: "USD",
      to: "EUR",
      amount: 10,
    };

    const event = {
      body,
    };

    let hasError = false;
    let result: MiddlewareResponse = {};

    try {
      result = await runMiddleware(middlewareName, "CurrencyMiddleware", {
        event,
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);

    const calledMethod = Object.keys(result).includes("before");

    expect(calledMethod).toBe(true);
  });

  test("Body without amount", async () => {
    const body = {
      from: "USD",
      to: "EUR",
    };

    const event = {
      body,
    };

    let hasError = false;

    try {
      await runMiddleware(middlewareName, "CurrencyMiddleware", {
        event,
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(true);
  });
});
