import { runMiddleware } from "../helpers/handlerRequest";

import {
  requestWithBody,
  requestWithoutBody,
} from "../mocks/middlewares/CatchError";

const middlewareName = "CatchError";

const mockWriteLogger = jest.fn();

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("CatchError - middleware", () => {
  test("Should test to verify error with body on event", async () => {
    const result = await runMiddleware(
      middlewareName,
      "CatchError",
      requestWithBody
    );

    expect(result).toHaveProperty("onError");
    expect(result.onError?.statusCode).toBe(500);
    
    const body = JSON.parse(result.onError!.body);

    expect(body.message).toBe(requestWithBody.error.message)
  });

  test("Should test to verify error without body on event", async () => {
    const result = await runMiddleware(
      middlewareName,
      "CatchError",
      requestWithoutBody
    );

    expect(result).toHaveProperty("onError");
    expect(result.onError?.statusCode).toBe(500);

    const body = JSON.parse(result.onError!.body);

    expect(body.message).toBe(requestWithoutBody.error.message);
  });
});
