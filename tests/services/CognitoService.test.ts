import CognitoService from "../../src/services/CognitoService";
import AWSMock from "aws-sdk-mock";

import {
  getSessionTokenResponseSuccess,
} from "../mocks/services/CognitoServiceMocks";

process.env.REGION = "123";
process.env.COGNITO_USER_POOL_ID = "123";
process.env.COGNITO_CLIENT_ID = "123";
process.env.authFlow = "123";

describe("CognitoService - services", () => {
  describe("Should test to get and reset the class", () => {
    test("Should test to get a new instance", () => {
      const cognitoService = CognitoService.getInstance();

      expect(cognitoService).toBeInstanceOf(CognitoService);
    });

    test("Should test to get two times the same instance of class", () => {
      const cognitoService = CognitoService.getInstance();
      const cognitoService2 = CognitoService.getInstance();

      expect(cognitoService).toBe(cognitoService2);
    });

    test("Shoud test to destroy the instance", () => {
      const cognitoService = CognitoService.getInstance();

      CognitoService.destroyInstance();

      const cognitoService2 = CognitoService.getInstance();

      expect(cognitoService).not.toBe(cognitoService2);
    });
  });

  describe("Test about methods of class", () => {
    beforeEach(() => {
      CognitoService.destroyInstance();
    });
    afterEach(() => {
      AWSMock.restore("CognitoIdentityServiceProvider");
    });

    test("Should test to get an user from cognito", () => {
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminGetUser",
        (param, callback) => {
          callback(undefined, {
            Username: param.Username,
          });
        }
      );

      const cognitoService = CognitoService.getInstance();
      const username = "ricardo@mftech.io";

      expect(cognitoService.getUser(username)).resolves.toHaveProperty(
        "Username",
        username
      );
    });

    test("Should test to create a new user", () => {
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminCreateUser",
        (param, callback) => {
          callback(undefined, {
            User: {
              Username: param.Username,
            },
          });
        }
      );

      const cognitoService = CognitoService.getInstance();
      const username = "ricardo@mftech.io";
      expect(cognitoService.createAnUser(username)).resolves.toHaveProperty(
        "User.Username",
        username
      );
    });

    test("Should test to set a new password to user by username", () => {
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminSetUserPassword",
        (_param, callback) => {
          callback(undefined, {});
        }
      );

      const cognitoService = CognitoService.getInstance();
      const username = "ricardo@mftech.io";
      const password = "ricardo";

      expect(
        cognitoService.setPasswordToUser(username, password)
      ).resolves.toStrictEqual({});
    });

    test("Should test to get a session token", () => {
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminInitiateAuth",
        (param, callback) => {
          callback(undefined, getSessionTokenResponseSuccess);
        }
      );

      const cognitoService = CognitoService.getInstance();
      const username = "ricardo@mftech.io";
      const password = "ricardo";

      expect(
        cognitoService.getSessionToken(username, password)
      ).resolves.toHaveProperty("AuthenticationResult.AccessToken");
    });
  });
});
