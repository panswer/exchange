import AWS from "aws-sdk";
import {
  AdminCreateUserRequest,
  AdminCreateUserResponse,
  AdminGetUserRequest,
  AdminGetUserResponse,
  AdminInitiateAuthRequest,
  AdminInitiateAuthResponse,
  AdminSetUserPasswordRequest,
  AdminSetUserPasswordResponse,
  GetUserRequest,
  GetUserResponse,
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import {
  MessageActionEnum,
  UserAttributesEnum,
} from "../enums/AuthServiceEnum";
import { LoggerLevel } from "../enums/LoggerLevelEnum";
import Logger from "../utils/Logger";

export default class CognitoService {
  private static cognitoServiceInstance?: CognitoService;
  private cognitoService: AWS.CognitoIdentityServiceProvider;
  private readonly COGNITO_USER_POOL_ID: string =
    process.env.COGNITO_USER_POOL_ID!;
  private readonly COGNITO_CLIENT_ID: string = process.env.COGNITO_CLIENT_ID!;
  private readonly AWS_REGION: string = process.env.REGION!;
  private readonly authFlow: string = process.env.authFlow!;

  private constructor() {
    AWS.config.update({
      region: this.AWS_REGION,
    });

    this.cognitoService = new AWS.CognitoIdentityServiceProvider();
  }

  /**
   * Get an instance of Cognito Service
   *
   * @returns {CognitoService}
   */
  static getInstance(): CognitoService {
    if (!CognitoService.cognitoServiceInstance) {
      CognitoService.cognitoServiceInstance = new CognitoService();
    }

    return CognitoService.cognitoServiceInstance;
  }

  /**
   * Delete instance of Cognito Service
   *
   * @returns {void}
   */
  static destroyInstance(): void {
    delete this.cognitoServiceInstance;
  }

  /**
   * Get an user by username
   *
   * @param {string} username - username (uuid)
   *
   * @returns {Promise<AdminGetUserResponse>}
   */
  async getUser(username: string): Promise<AdminGetUserResponse> {
    const config: AdminGetUserRequest = {
      Username: username,
      UserPoolId: this.COGNITO_USER_POOL_ID,
    };

    const user = await this.cognitoService.adminGetUser(config).promise();

    return user;
  }

  /**
   * Save a new user in cognito
   *
   * @param email - the new user's email
   *
   * @returns {Promise<AdminCreateUserResponse>}
   */
  async createAnUser(email: string): Promise<AdminCreateUserResponse> {
    const config: AdminCreateUserRequest = {
      Username: email,
      UserPoolId: this.COGNITO_USER_POOL_ID,
      UserAttributes: [
        {
          Name: UserAttributesEnum.EMAIL,
          Value: email,
        },
        {
          Name: UserAttributesEnum.EMAIL_VERIFIED,
          Value: "true",
        },
      ],
      MessageAction: MessageActionEnum.SUPPRESS,
    };

    const newUser = await this.cognitoService.adminCreateUser(config).promise();

    return newUser;
  }

  /**
   * Set password to user by email
   *
   * @param email - user's email
   * @param password - user's password
   *
   * @returns {Promies<AdminSetUserPasswordResponse>}
   */
  async setPasswordToUser(
    email: string,
    password: string
  ): Promise<AdminSetUserPasswordResponse> {
    const config: AdminSetUserPasswordRequest = {
      Password: password,
      Username: email,
      UserPoolId: this.COGNITO_USER_POOL_ID,
      Permanent: true,
    };

    const result = await this.cognitoService
      .adminSetUserPassword(config)
      .promise();

    return result;
  }

  /**
   * Get session token by email and password
   *
   * @param email - user's email
   * @param password - user's password
   *
   * @returns {Promise<AdminInitiateAuthResponse>}
   */
  async getSessionToken(
    email: string,
    password: string
  ): Promise<AdminInitiateAuthResponse> {
    const config: AdminInitiateAuthRequest = {
      AuthFlow: this.authFlow,
      ClientId: this.COGNITO_CLIENT_ID,
      UserPoolId: this.COGNITO_USER_POOL_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const result = await this.cognitoService
      .adminInitiateAuth(config)
      .promise();

    return result;
  }
}
