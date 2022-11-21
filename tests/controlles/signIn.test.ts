import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";

import {
  signInResponseSuccess,
  signInRequestSuccess,
  signInRequestBad,
} from "../mocks/controllers/signInMocks";

const functionName = "signIn";

const mockSignInFlow = jest.fn().mockResolvedValue(signInResponseSuccess);

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
    const body = signInRequestSuccess;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(202);

    const response = JSON.parse(result.body);

    expect(response.success).toBe(true);
  });

  test("When it missed the password", async () => {
    mockValidator.mockRejectedValueOnce(new Error("Test error"));
    const body = signInRequestBad;
    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(500);
  });
});
