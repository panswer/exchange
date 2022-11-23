import { runMiddleware } from "../helpers/handlerRequest";

import {
  requestWithBodyMock,
  requestWithoutBodyMock,
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
    const loggerCalled = mockWriteLogger.mock.calls.length

    const result = await runMiddleware(
      middlewareName,
      "CatchError",
      requestWithBodyMock
    );

    expect(result).toHaveProperty("onError");
    expect(result.onError?.statusCode).toBe(500);
    
    const body = JSON.parse(result.onError!.body);

    expect(body.message).toBe(requestWithBodyMock.error.message);
    expect(loggerCalled).not.toBe(mockWriteLogger.mock.calls.length)
  });

  test("Should test to verify error without body on event", async () => {
    const loggerCalled = mockWriteLogger.mock.calls.length;

    const result = await runMiddleware(
      middlewareName,
      "CatchError",
      requestWithoutBodyMock
    );

    expect(result).toHaveProperty("onError");
    expect(result.onError?.statusCode).toBe(500);

    const body = JSON.parse(result.onError!.body);

    expect(body.message).toBe(requestWithoutBodyMock.error.message);
    expect(loggerCalled).not.toBe(mockWriteLogger.mock.calls.length)
  });
});
