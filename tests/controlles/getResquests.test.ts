import { doRequest } from "../helpers/handlerRequest";
import {
  getRequestsSuccessMock,
  getRequestsSortAscendSuccessMock,
} from "../mocks/controllers/getRequestsMock";

const mockGetRequestsByUsername = jest.fn().mockResolvedValue({});

const mockLogUser = jest.fn();

const mockWriteLogger = jest.fn();

jest.mock("../../src/models/CurrencyRequestModel", () => ({
  getInstance: () => ({
    getRequestsByUsername: mockGetRequestsByUsername,
  }),
}));

jest.mock("../../src/middlewares/LogUser", () => ({
  LogUser: {
    before: mockLogUser,
  },
}));

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

const functionName = "getResquests";

describe("getRequests - function lambda", () => {
  it("Should test to get the requests list success", () => {
    expect(
      doRequest(functionName, getRequestsSuccessMock)
    ).resolves.toHaveProperty("statusCode", 200);
  });

  it("Should test to get the requests list sort by ascendent", () => {
    expect(
      doRequest(functionName, getRequestsSortAscendSuccessMock)
    ).resolves.toHaveProperty("statusCode", 200);
  });
});
