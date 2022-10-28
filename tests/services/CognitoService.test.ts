import CognitoService from "../../src/services/CognitoService";

import AWSMock from "aws-sdk-mock";

process.env.REGION = "123";
process.env.COGNITO_USER_POOL_ID = "123";
process.env.COGNITO_CLIENT_ID = "123";
process.env.authFlow = "123";

AWSMock.mock(
  "CognitoIdentityServiceProvider",
  "adminGetUser",
  async (param, callback) => {
    callback(undefined, {
      Username: param.Username,
    });
  }
);

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

AWSMock.mock(
  "CognitoIdentityServiceProvider",
  "adminSetUserPassword",
  (_param, callback) => {
    callback(undefined, {});
  }
);

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

describe("Auth - Cognito service", () => {
  test("Get an instance", () => {
    const cognitoService = CognitoService.getInstance();

    expect(typeof cognitoService).toBe("object");
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

  test("Get an user", async () => {
    const cognitoService = CognitoService.getInstance();
    const username = "ricardo@mftech.io";

    const user = await cognitoService.getUser(username);

    expect(user.Username).toBe(username);
  });

  test("Create an user", async () => {
    const cognitoService = CognitoService.getInstance();
    const username = "ricardo@mftech.io";

    const user = await cognitoService.createAnUser(username);

    expect(user.User?.Username).toBe(username);
  });

  test("Set new password", async () => {
    const cognitoService = CognitoService.getInstance();
    const username = "ricardo@mftech.io";
    const password = "ricardo";

    const user = await cognitoService.setPasswordToUser(username, password);

    expect(typeof user).toBe("object");
  });

  test("Get a session token", async () => {
    const cognitoService = CognitoService.getInstance();
    const username = "ricardo@mftech.io";
    const password = "ricardo";

    const result = await cognitoService.getSessionToken(username, password);

    expect(typeof result.AuthenticationResult?.AccessToken).toBe("string");
  });
});
