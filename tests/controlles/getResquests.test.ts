import { doRequest } from "../helpers/handlerRequest";
import { SortBy } from "../../src/enums/DynamoDBSortEnum";
import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { requestContextSuccessMock } from "../mocks/generic/request";

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
  test("Should test to get the requests list success", () => {
    const requestData: httpRequestData = {
      requestContext: requestContextSuccessMock,
    };
    expect(doRequest(functionName, requestData)).resolves.toHaveProperty(
      "statusCode",
      200
    );
  });

  test("Should test to get the requests list sort by ascendent", () => {
    const requestData: httpRequestData = {
      queryStringParameters: {
        sort: SortBy.asc,
      },
      requestContext: requestContextSuccessMock,
    };
    expect(doRequest(functionName, requestData)).resolves.toHaveProperty(
      "statusCode",
      200
    );
  });
});
