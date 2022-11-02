import { doRequest } from "../../utils/handlerCall";
import { CurrencyRequestInterface } from "../../src/interfaces/CurrencyRequestInterface";
import { ApiLayerResponseInterface } from "../../src/interfaces/ApiLayerResponseInterface";

const functionName = "currency";

const mockGetExchangeCurrency = jest.fn(
  (data: CurrencyRequestInterface): Promise<ApiLayerResponseInterface> =>
    new Promise((resolve, reject) => {
      if (
        (!data.amount && typeof data.amount !== "number") ||
        !data.from ||
        !data.to
      ) {
        reject("Test error with request");
      } else {
        resolve({
          date: "",
          info: {
            rate: 1,
            timestamp: new Date().getMilliseconds(),
          },
          query: {
            amount: data.amount,
            from: data.from,
            to: data.to,
          },
          result: data.amount,
          success: true,
        });
      }
    })
);

const mockSaveRequest = jest.fn(
  (
    currencyTo: string,
    currencyFrom: string,
    amount: number,
    createdAt: Date = new Date(),
    amountResult: number,
    username: string
  ) =>
    new Promise((resolve, reject) => {
      if (
        !currencyTo ||
        !currencyFrom ||
        (!amount && typeof amount !== "number") ||
        !createdAt ||
        !amountResult ||
        !username
      ) {
        reject(new Error("Test error without any data"));
      } else {
        resolve({});
      }
    })
);

process.env.TEST_ON = "1";

jest.mock("../../src/services/CurrencyApiService", () => ({
  getInstance: () => ({
    getExchangeCurrency: mockGetExchangeCurrency,
  }),
}));

jest.mock("../../src/services/DynamodbService", () => ({
  getInstance: () => ({
    saveRequest: mockSaveRequest,
  }),
}));

describe("Exchange - Basic", () => {
  test("Get exchange rate success", async () => {
    const body = {
      from: "USD",
      to: "EUR",
      amount: 2,
    };

    // const result = await doRequest(functionName, { body });

    // expect(result.statusCode).toBe(200);
    await expect(doRequest(functionName, { body })).resolves.toHaveProperty(
      "statusCode",
      200
    );
  });

  test("Request without currency from", async () => {
    const body = {
      to: "EUR",
      amount: 2,
    };

    const result = await doRequest(functionName, { body });

    expect(result.statusCode).toBe(500);
  });

  test("Good Request but don't save", async () => {
    const body = {
      to: "EUR",
      from: "VES",
      amount: 3,
    };

    mockSaveRequest.mockRejectedValueOnce(() => new Error("Test in save"));

    const result = await doRequest(functionName, { body });

    expect(result.statusCode).toBe(200);
  });
});
