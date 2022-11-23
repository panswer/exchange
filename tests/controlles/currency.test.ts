import { httpRequestData } from "../helpers/interfaces/httpRequest";
import { doRequest } from "../helpers/handlerRequest";

import {
  currencyRequestSucessMock,
  saveCurrencyRequestSuccessMock,
  currencyRequestBadMock,
} from "../mocks/controllers/currencyMocks";
import { getExchangeCurrencyResponseSuccessMock } from "../mocks/services/CurrencyApiService";

import { requestContextSuccessMock } from "../mocks/generic/request";

const functionName = "currency";

const mockGetExchangeCurrency = jest
  .fn()
  .mockResolvedValue(getExchangeCurrencyResponseSuccessMock);

const mockSaveCurrencyRequest = jest.fn();

const mockHttpJsonBodyParser = jest.fn();

const mockLogUserBefore = jest.fn();

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

jest.mock("../../src/middlewares/LogUser", () => ({
  LogUser: {
    before: mockLogUserBefore,
  },
}));

jest.mock("../../src/utils/Logger", () => ({
  getInstance: () => ({
    writeLogger: mockWriteLogger,
  }),
}));

describe("currency - function lambda", () => {
  test("Should test to get exchange data rate success", async () => {
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

  test("When it missed the 'to' in body", async () => {
    const body = currencyRequestBadMock;

    const requestData: httpRequestData = {
      body,
      requestContext: requestContextSuccessMock,
    };

    const response = await doRequest(functionName, requestData);

    expect(response.statusCode).toBe(400);

    const bodyJSON = JSON.parse(response.body);

    expect(bodyJSON).toHaveProperty(
      "message",
      "must have required property to"
    );
  });

  test("When the database don't response on time", async () => {
    mockSaveCurrencyRequest.mockRejectedValueOnce(new Error("Test error"));

    const body = currencyRequestSucessMock;

    const requestData: httpRequestData = {
      body,
      requestContext: requestContextSuccessMock,
    };

    const result = await doRequest(functionName, requestData);

    expect(result.statusCode).toBe(500);

    const bodyJSON = JSON.parse(result.body);

    expect(bodyJSON.message).toBe("Test error");
  });
});
