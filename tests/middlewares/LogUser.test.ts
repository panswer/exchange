import { runMiddleware } from "../helpers/handlerRequest";
import { UserAttributesEnum } from "../../src/enums/AuthServiceEnum";

import {
  middlewareGoodRequest,
  middlewareBadRequest,
} from "../mocks/middlewares/LogUser";

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

describe("LogUser - middleware", () => {
  test("Should test log success", () => {
    expect(
      runMiddleware(middlewareName, "LogUser", middlewareGoodRequest)
    ).resolves.toHaveProperty("before");
  });

  test("When it missed the email", async () => {
    expect(
      runMiddleware(middlewareName, "LogUser", middlewareBadRequest)
    ).rejects.toHaveProperty("message", "Unauthoriced");
  });
});
