import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";

import {
  currencyRequestSucessMock,
  getExchangeCurrencyResponseSuccessMock,
  saveCurrencyRequestSuccessMock,
  currencyRequestBadMock,
} from "../mocks/controllers/currencyMocks";

import { requestContextSuccessMock } from "../mocks/generic/request";

const functionName = "currency";

const mockGetExchangeCurrency = jest
  .fn()
  .mockResolvedValue(getExchangeCurrencyResponseSuccessMock);

const mockSaveCurrencyRequest = jest.fn();

const mockHttpJsonBodyParser = jest.fn();

const mockCatchErrorOnError = jest.fn(() => ({
  statusCode: 500,
}));

const mockLogUserBefore = jest.fn();

const mockValidatorBefore = jest.fn();

const mockCurrencyMiddlewareBefore = jest.fn();

const mockWriteLogger = jest.fn();

jest.mock("../../src/services/CurrencyApiService", () => ({
  getInstance: () => ({
    getExchangeCurrency: mockGetExchangeCurrency,
  }),
}));

jest.mock("../../src/models/CurrencyRequestModel", () => ({
  getInstance: () => ({
    saveCurrencyRequest: mockSaveCurrencyRequest,
  }),
}));

jest.mock("@middy/http-json-body-parser", () => () => ({
  before: mockHttpJsonBodyParser,
}));

jest.mock("../../src/middlewares/CatchError", () => ({
  onError: mockCatchErrorOnError,
}));

jest.mock("@middy/validator", () => () => ({
  before: mockValidatorBefore,
}));

jest.mock("../../src/middlewares/LogUser", () => ({
  LogUser: {
    before: mockLogUserBefore,
  },
}));

jest.mock("../../src/middlewares/CurrencyMiddleware", () => ({
  CurrencyMiddleware: {
    before: mockCurrencyMiddlewareBefore,
  },
}));

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("Exchange - Basic", () => {
  test("Get exchange rate success", async () => {
    mockSaveCurrencyRequest.mockImplementationOnce(
      () => saveCurrencyRequestSuccessMock
    );

    const body = currencyRequestSucessMock;

    const requestData: httpRequestData = {
      body,
      requestContext: requestContextSuccessMock,
    };

    let result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(200);

    const resultJSON = JSON.parse(result.body).amounts;

    expect(resultJSON.query.amount).toBe(currencyRequestSucessMock.amount);
    expect(resultJSON.query.from).toBe(currencyRequestSucessMock.from);
    expect(resultJSON.query.to).toBe(currencyRequestSucessMock.to);
  });

  test("Request without currency from", () => {
    mockGetExchangeCurrency.mockRejectedValueOnce(new Error("Test Error"));

    const body = currencyRequestBadMock;

    const requestData: httpRequestData = {
      body,
      requestContext: requestContextSuccessMock,
    };

    expect(doRequest(functionName, requestData)).resolves.toHaveProperty(
      "statusCode",
      500
    );
  });

  test("Good Request but don't save", () => {
    mockSaveCurrencyRequest.mockRejectedValueOnce(new Error("Test error"));

    const body = currencyRequestSucessMock;

    const requestData: httpRequestData = {
      body,
      requestContext: requestContextSuccessMock,
    };

    expect(doRequest(functionName, requestData)).resolves.toHaveProperty(
      "statusCode",
      500
    );
  });
});
