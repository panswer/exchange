import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";

import { signInSuccess } from "../mocks/controllers/signInMocks";

const functionName = "signIn";

const mockSignInFlow = jest.fn().mockResolvedValue(signInSuccess);

const mockHttpJsonBodyParser = jest.fn();

const mockCatchErrorOnError = jest.fn(() => ({
  statusCode: 500,
}));

const mockValidator = jest.fn();

const mockWriteLogger = jest.fn();

jest.mock("../../src/services/CognitoService", () => ({
  getInstance: () => ({
    getSessionToken: mockSignInFlow,
  }),
}));

jest.mock("@middy/http-json-body-parser", () => () => ({
  before: mockHttpJsonBodyParser,
}));

jest.mock("../../src/middlewares/CatchError", () => ({
  CatchError: {
    onError: mockCatchErrorOnError,
  },
}));

jest.mock("@middy/validator", () => () => ({
  before: mockValidator,
}));

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("signIn - function lambda", () => {
  test("Should test to get accesses token", async () => {
    const body = {
      email: "ricardo@mftech.io",
      password: "Ricardo.1",
    };

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(202);

    const response = JSON.parse(result.body);

    expect(response.success).toBe(true);
  });

  test("Should test to get an error by request without password", async () => {
    mockValidator.mockRejectedValueOnce(new Error("Test error"))
    const body = {
      email: "ricardo@mftech.io",
    };
    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(500);
  });
});
