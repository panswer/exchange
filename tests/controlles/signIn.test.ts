import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";

import {
  signInRequestSuccessMock,
  signInRequestBadMock,
} from "../mocks/controllers/signInMocks";

import { getSessionTokenResponseSuccessMock } from "../mocks/services/CognitoServiceMocks";

const functionName = "signIn";

const mockSignInFlow = jest
  .fn()
  .mockResolvedValue(getSessionTokenResponseSuccessMock);

const mockHttpJsonBodyParser = jest.fn();

const mockWriteLogger = jest.fn();

jest.mock("../../src/services/CognitoService", () => ({
  getInstance: () => ({
    getSessionToken: mockSignInFlow,
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

describe("signIn - function lambda", () => {
  test("Should test to get accesses token", async () => {
    const body = signInRequestSuccessMock;

    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(202);

    const response = JSON.parse(result.body);

    expect(response.success).toBe(true);
  });

  test("When it missed the password", async () => {
    const body = signInRequestBadMock;
    const requestData: httpRequestData = {
      body,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(400);

    const bodyJSON = JSON.parse(result.body);

    expect(bodyJSON.message).toBe("must have required property password");
  });
});
