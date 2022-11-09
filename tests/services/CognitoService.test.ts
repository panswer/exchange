import CognitoService from "../../src/services/CognitoService";
import { AWSError } from "aws-sdk";

import AWSMock from "aws-sdk-mock";

process.env.REGION = "123";
process.env.COGNITO_USER_POOL_ID = "123";
process.env.COGNITO_CLIENT_ID = "123";
process.env.authFlow = "123";

describe("Auth - Cognito service", () => {
  describe("Test about instance of class", () => {
    test("Get an instance", () => {
      const cognitoService = CognitoService.getInstance();

      expect(cognitoService).toBeInstanceOf(CognitoService);
    });

    test("Get twice the same instance", () => {
      const cognitoService = CognitoService.getInstance();
      const cognitoService2 = CognitoService.getInstance();

      expect(cognitoService).toBe(cognitoService2);
    });

    test("Destroy an instance", () => {
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
  
    test("Get an user", async () => {
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
  
      const user = await cognitoService.getUser(username);
  
      expect(user.Username).toBe(username);
    });
  
    test("Error to get an user", () => {
      const error: AWSError = {
        code: "test",
        message: "test error",
        name: "unit test",
        time: new Date(),
      };
  
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminGetUser",
        (_param, callback) => {
          callback(error);
        }
      );
  
      const cognitoService = CognitoService.getInstance();
  
      expect(cognitoService.getUser("test@mftech.io")).rejects.toHaveProperty(
        "message",
        error.message
      );
    });
  
    test("Create an user", async () => {
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
  
      const user = await cognitoService.createAnUser(username);
  
      expect(user.User?.Username).toBe(username);
    });
  
    test("Error to create an user", () => {
      const error: AWSError = {
        code: "test",
        message: "Error test",
        name: "Unit test",
        time: new Date(),
      };
  
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminCreateUser",
        (_param, callback) => {
          callback(error);
        }
      );
  
      const cognitoService = CognitoService.getInstance();
  
      expect(
        cognitoService.createAnUser("test@mftech.io")
      ).rejects.toHaveProperty("message", error.message);
    });
  
    test("Set new password", async () => {
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
  
      const user = await cognitoService.setPasswordToUser(username, password);
  
      expect(typeof user).toBe("object");
    });
  
    test("Error to set a password to user", () => {
      const error: AWSError = {
        code: "test",
        message: "Error test",
        name: "Unit test",
        time: new Date(),
      };
  
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminSetUserPassword",
        (_param, callback) => {
          callback(error);
        }
      );
  
      const cognitoService = CognitoService.getInstance();
  
      expect(
        cognitoService.setPasswordToUser("test@mftech.io", "password")
      ).rejects.toHaveProperty("message", error.message);
    });
  
    test("Get a session token", async () => {
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminInitiateAuth",
        (param, callback) => {
          callback(undefined, {
            AuthenticationResult: {
              AccessToken: "",
              ExpiresIn: 1000,
            },
          });
        }
      );
  
      const cognitoService = CognitoService.getInstance();
      const username = "ricardo@mftech.io";
      const password = "ricardo";
  
      const result = await cognitoService.getSessionToken(username, password);
  
      expect(typeof result.AuthenticationResult?.AccessToken).toBe("string");
    });
  
    test("Error to get a session token", () => {
      const error: AWSError = {
        code: "test",
        message: "Test error",
        name: "Unit test",
        time: new Date(),
      };
  
      AWSMock.mock(
        "CognitoIdentityServiceProvider",
        "adminInitiateAuth",
        (_param, callback) => {
          callback(error);
        }
      );
  
      const cognitoService = CognitoService.getInstance();
  
      expect(
        cognitoService.getSessionToken("test@mftech.io", "test")
      ).rejects.toHaveProperty("message", error.message);
    });
  });

  test("Error to get a session token", () => {
    const error: AWSError = {
      code: "test",
      message: "Test error",
      name: "Unit test",
      time: new Date(),
    };

    AWSMock.mock(
      "CognitoIdentityServiceProvider",
      "adminInitiateAuth",
      (_param, callback) => {
        callback(error);
      }
    );

    const cognitoService = CognitoService.getInstance();

    expect(
      cognitoService.getSessionToken("test@mftech.io", "test")
    ).rejects.toHaveProperty("message", error.message);
  });
});
