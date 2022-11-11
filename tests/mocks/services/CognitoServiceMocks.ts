import { AWSError } from "aws-sdk";

export const cognitoError: AWSError = {
  code: "test",
  message: "test error",
  name: "unit test",
  time: new Date(),
};

export const getSessionTokenResponseSuccess = {
    AuthenticationResult: {
      AccessToken: "",
      ExpiresIn: 1000,
    },
  }