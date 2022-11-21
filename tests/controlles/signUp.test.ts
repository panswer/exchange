import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";
import {
  createAnUserSuccessMock,
  setPasswordToUserSuccessMock,
  signInRequestSuccess,
  signInRequestWithoutPassword,
  signInRequestWithoutEmail,
} from "../mocks/controllers/signUpMocks";

const functionName = "signUp";

const mockCreateAnUser = jest.fn().mockResolvedValue(createAnUserSuccessMock);

const mockSetPasswordToUser = jest
  .fn()
  .mockResolvedValue(setPasswordToUserSuccessMock);

const mockHttpJsonBodyParser = jest.fn();

const mockCarchErrorOnError = jest.fn(() => ({
  statusCode: 500,
}));

const mockValidator = jest.fn();

const mockWriteLogger = jest.fn();

jest.mock("../../src/services/CognitoService", () => ({
  getInstance: () => ({
    createAnUser: mockCreateAnUser,
    setPasswordToUser: mockSetPasswordToUser,
  }),
}));

jest.mock("@middy/http-json-body-parser", () => () => ({
  before: mockHttpJsonBodyParser,
}));

jest.mock("../../src/middlewares/CatchError", () => ({
  CatchError: {
    onError: mockCarchErrorOnError,
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

describe("signUp - function lambda", () => {
  test("Should test to save a new user success", async () => {
    const body = signInRequestSuccess;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(201);
  });

  test("When it missed the password", async () => {
    mockCreateAnUser.mockRejectedValueOnce(new Error("Test error"));

    const body = signInRequestWithoutPassword;
    signInRequestWithoutEmail;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(500);
  });

  test("When it missed the email", async () => {
    mockCreateAnUser.mockRejectedValueOnce(new Error("Test error"));

    const body = signInRequestWithoutEmail;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(500);
  });
});
