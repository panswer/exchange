import { runMiddleware } from "../helpers/handlerRequest";
import { UserAttributesEnum } from "../../src/enums/AuthServiceEnum";
import { requestContextSuccessMock } from "../mocks/generic/request";

const middlewareName = "LogUser";
const username = "aaa@aaa.aa";

const mockGetUser = jest.fn(() => ({
  UserAttributes: [
    {
      Name: UserAttributesEnum.EMAIL,
      Value: username,
    },
  ],
}));

const mockWriteLogger = jest.fn();

jest.mock("../../src/services/CognitoService", () => ({
  getInstance: () => ({
    getUser: mockGetUser,
  }),
}));

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("Auth - middleware", () => {
  test("Log success without test", async () => {
    const event = {
      requestContext: requestContextSuccessMock,
    };
    const context = {};

    const result = await runMiddleware(middlewareName, "LogUser", {
      event,
      context,
    });

    expect(result.before).toBe(undefined);
  });

  test("Log error without username", async () => {
    const event = {
      requestContext: {
        authorizer: {},
      },
    };
    const context = {};
    let catchError = false;

    try {
      await runMiddleware(middlewareName, "LogUser", {
        event,
        context,
      });
    } catch (error) {
      catchError = true;
    }

    expect(catchError).toBe(true);
  });
});
