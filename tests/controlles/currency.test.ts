import { doRequest } from "../../utils/handlerCall";
import { CurrencyRequestInterface } from "../../src/interfaces/CurrencyRequestInterface";
import { ApiLayerResponseInterface } from "../../src/interfaces/ApiLayerResponseInterface";
import { CurrencyRequest } from "../../src/interfaces/DynamodbService";

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

/* 

    currencyTo: string,
    currencyFrom: string,
    amount: number,
    createdAt: Date = new Date(),
    amountResult: number,
    username: string

*/
const mockSaveCurrencyRequest = jest.fn(
  (params: CurrencyRequest) =>
    new Promise((resolve, reject) => {
      if (
        !params.currencyTo ||
        !params.currencyFrom ||
        (!params.amount && typeof params.amount !== "number") ||
        !params.amountResult ||
        !params.username
      ) {
        console.log("#".repeat(50));
        console.log(params);
        console.log("#".repeat(50));

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

jest.mock("../../src/models/CurrencyRequestModel", () => ({
  getInstance: () => ({
    saveCurrencyRequest: mockSaveCurrencyRequest,
  }),
}));

describe("Exchange - Basic", () => {
  test("Get exchange rate success", async () => {
    const body = {
      from: "USD",
      to: "EUR",
      amount: 2,
    };

    let result = await doRequest(functionName, {
      body,
      requestContext: {
        authorizer: {
          claims: { username: "test@mftech.io" },
        },
      },
    });

    expect(result.statusCode).toBe(200);
    // await expect(
    //   doRequest(functionName, {
    //     body,
    //     requestContext: {
    //       authorizer: { claims: { username: "test@mftech.io" } },
    //     },
    //   })
    // ).resolves.toHaveProperty("statusCode", 200);
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

    mockSaveCurrencyRequest.mockRejectedValueOnce(
      () => new Error("Test in save")
    );

    const result = await doRequest(functionName, { body });

    expect(result.statusCode).toBe(500);
  });
});
