import CognitoService from "../../src/services/CognitoService";
import AWSMock from "aws-sdk-mock";

import {
  getSessionTokenResponseSuccessMock,
} from "../mocks/services/CognitoServiceMocks";

process.env.REGION = "123";
process.env.COGNITO_USER_POOL_ID = "123";
process.env.COGNITO_CLIENT_ID = "123";
process.env.authFlow = "123";

describe("CognitoService - services", () => {
  describe("Should test to get and reset the class", () => {
    it("Should test to get a new instance", () => {
      const cognitoService = CognitoService.getInstance();

      expect(cognitoService).toBeInstanceOf(CognitoService);
    });

    it("Should test to get two times the same instance of class", () => {
      const cognitoService = CognitoService.getInstance();
      const cognitoService2 = CognitoService.getInstance();

      expect(cognitoService).toBe(cognitoService2);
    });

    it("Shoud test to destroy the instance", () => {
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

    it("Should get an user success", () => {
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

    it("Should create a new user success", () => {
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

    it("Should set a new password by username success", () => {
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

    it("Should get a session token success", () => {
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminInitiateAuth",
        (param, callback) => {
          callback(undefined, getSessionTokenResponseSuccessMock);
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
