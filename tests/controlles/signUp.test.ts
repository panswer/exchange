import { reject } from "lodash";
import { doRequest } from "../../utils/handlerCall";
import {
  adminCreateUserSuccess,
  adminSetUserPasswordSuccess,
} from "../responses/Cognito";

const functionName = "signUp";

const mockCreateAnUser = jest.fn(
  (email) =>
    new Promise((resolve, reject) => {
      if (!email) {
        reject("Test error in create an user");
      } else {
        resolve(adminCreateUserSuccess);
      }
    })
);
const mockSetPasswordToUser = jest.fn(
  (email, password) =>
    new Promise((resolve) => {
      if (!email || !password) {
        reject("Test error in set a password to user");
      } else {
        resolve(adminSetUserPasswordSuccess);
      }
    })
);

jest.mock("../../src/services/CognitoService", () => ({
  getInstance: () => ({
    createAnUser: mockCreateAnUser,
    setPasswordToUser: mockSetPasswordToUser,
  }),
}));

describe("Auth - Sign up", () => {
  test("Sign up success", async () => {
    const body = {
      email: "ricardo@mftech.io",
      password: "Ricardo.1",
    };

    const result = await doRequest(functionName, {
      body,
    });

    expect(result.statusCode).toBe(201);
  });

  test("Sign up without email", async () => {
    const body = {
      password: "Ricardo.1",
    };

    const result = await doRequest(functionName, {
      body,
    });

    expect(result.statusCode).toBe(500);
  });

  test("Sign up without password", async () => {
    const body = {
      email: "ricardo@mftech.io",
    };

    const result = await doRequest(functionName, {
      body,
    });

    expect(result.statusCode).toBe(500);
  });
});
