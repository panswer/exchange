import {
  AdminCreateUserResponse,
  AdminInitiateAuthResponse,
  AdminSetUserPasswordResponse,
} from "aws-sdk/clients/cognitoidentityserviceprovider";

export const createAnUserSuccessMock: AdminCreateUserResponse = {
  User: {
    Username: "1",
    Attributes: [
      {
        Name: "sub",
        Value: "1",
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "email",
        Value: "aaa@aa.aa",
      },
    ],
    UserCreateDate: new Date("2022-10-11T14:05:38.233Z"),
    UserLastModifiedDate: new Date("2022-10-11T14:05:38.233Z"),
    Enabled: true,
    UserStatus: "FORCE_CHANGE_PASSWORD",
  },
};

export const setPasswordToUserSuccessMock: AdminSetUserPasswordResponse = {};
