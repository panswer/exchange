import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";
import {
  signInRequestSuccessMock,
  signInRequestWithoutPasswordMock,
  signInRequestWithoutEmailMock,
} from "../mocks/controllers/signUpMocks";
import { createAnUserSuccessMock } from "../mocks/services/CognitoServiceMocks";

const functionName = "signUp";

const mockCreateAnUser = jest.fn().mockResolvedValue(createAnUserSuccessMock);

const mockSetPasswordToUser = jest.fn().mockResolvedValue({});

const mockHttpJsonBodyParser = jest.fn();

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

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("signUp - function lambda", () => {
  it("Should test to save a new user success", async () => {
    const body = signInRequestSuccessMock;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(201);
  });

  it("When it missed the password", async () => {
    mockCreateAnUser.mockRejectedValueOnce(new Error("Test error"));

    const body = signInRequestWithoutPasswordMock;
    signInRequestWithoutEmailMock;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(400);

    const bodyJSON = JSON.parse(result.body);

    expect(bodyJSON.message).toBe("must have required property password");
  });

  it("When it missed the email", async () => {
    mockCreateAnUser.mockRejectedValueOnce(new Error("Test error"));

    const body = signInRequestWithoutEmailMock;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(400);

    const bodyJSON = JSON.parse(result.body);

    expect(bodyJSON.message).toBe("must have required property email");
  });
});
