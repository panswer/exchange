import { runMiddleware } from "../helpers/handlerRequest";
import {
  middlewareGoodRequest,
  middlewareBadRequest,
} from "../mocks/middlewares/CurrencyMiddleware";

const middlewareName = "CurrencyMiddleware";

describe("CurrencyMiddleware - CurrencyMiddleware", () => {
  test("Should test about body with all data in request", () => {
    expect(
      runMiddleware(middlewareName, "CurrencyMiddleware", middlewareGoodRequest)
    ).resolves.toHaveProperty("before");
  });

  test("Should test about body without amount in request", () => {
    expect(
      runMiddleware(middlewareName, "CurrencyMiddleware", middlewareBadRequest)
    ).rejects.toHaveProperty("message");
  });
});
