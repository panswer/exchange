import { runMiddleware } from "../helpers/handlerRequest";
import {
  middlewareGoodRequestMock,
  middlewareBadRequestMock,
} from "../mocks/middlewares/CurrencyMiddleware";

const middlewareName = "CurrencyMiddleware";

describe("CurrencyMiddleware - CurrencyMiddleware", () => {
  test("Should test about body with all data in request", () => {
    expect(
      runMiddleware(
        middlewareName,
        "CurrencyMiddleware",
        middlewareGoodRequestMock
      )
    ).resolves.toHaveProperty("before");
  });

  test("Should test about body without amount in request", () => {
    expect(
      runMiddleware(
        middlewareName,
        "CurrencyMiddleware",
        middlewareBadRequestMock
      )
    ).rejects.toHaveProperty("message");
  });
});
