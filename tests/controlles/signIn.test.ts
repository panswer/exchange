import { doRequest } from "../../utils/handlerCall";

import { signInSuccess } from "../mocks/signIn";

const functionName = 'signIn';

const mockSignInFlow = jest.fn(async (email, password) => {
  if (!email || !password) {
    throw new Error("Error test");
  } else {
    return signInSuccess;
  }
});

jest.mock("../../src/services/CognitoService", () => ({
  getInstance: () => ({
    getSessionToken: mockSignInFlow,
  }),
}));

describe("Auth - Sign in", () => {
  test("Sign in success", async () => {
    const body = {
      email: "ricardo@mftech.io",
      password: "Ricardo.1",
    };

    const result = await doRequest(functionName, {
      body,
    });

    expect(result.statusCode).toBe(202);

    const response = JSON.parse(result.body);

    expect(response.success).toBe(true);
  });

  test("Catch data without password", async () => {
    const body = {
      email: "ricardo@mftech.io",
    };

    const result = await doRequest(functionName, {
      body,
    });

    expect(result.statusCode).toBe(500);
  });
});
