import { runMiddleware } from "../../utils/handlerCall";

const middlewareName = "CatchError";

const mockWriteLogger = jest.fn(() => true);

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("Catch Errors", () => {
  test("Verify error with body on event", async () => {
    const event = {
      body: {
        data: "test",
      },
    };
    const error = new Error("Test with body");
    const context = {};

    const result = await runMiddleware(middlewareName, "CatchError", {
      event,
      error,
      context,
    });

    const hasMethod = Object.keys(result).includes("onError");

    expect(hasMethod).toBe(true);
  });

  test("Verify error without body on event", async () => {
    const event = {};
    const error = new Error("Test without body");
    const context = {};

    const result = await runMiddleware(middlewareName, "CatchError", {
      error,
      event,
      context,
    });

    const hasMethod = Object.keys(result).includes("onError");

    expect(hasMethod).toBe(true);
  });
});
