import CurrencyApiService from "../../src/services/CurrencyApiService";

process.env.API_LAYER_KEY = "123";
process.env.API_LAYER_URL = "123";

// const mockGetFn = jest.fn(() => ({
//   data: {},
// }));

jest.mock("axios", () => ({
  get: () => ({
    data: {},
  }),
}));

describe("Api Layer", () => {
  beforeEach(() => {
    CurrencyApiService.destroyInstance();
  });

  test("Get an instance", () => {
    const currencyApiService = CurrencyApiService.getInstance();

    expect(currencyApiService).toBeInstanceOf(CurrencyApiService);
  });

  test("Get twice the same instance", () => {
    const currencyApiService = CurrencyApiService.getInstance();
    const currencyApiService2 = CurrencyApiService.getInstance();

    expect(currencyApiService).toBe(currencyApiService2);
  });

  test("Destroy an instance", () => {
    const currencyApiService = CurrencyApiService.getInstance();

    CurrencyApiService.destroyInstance();

    const currencyApiService2 = CurrencyApiService.getInstance();

    expect(currencyApiService).not.toBe(currencyApiService2);
  });

  test("Get exchange currency ", async () => {
    const currencyApiService = CurrencyApiService.getInstance();

    const result = await currencyApiService.getExchangeCurrency({
      amount: 1,
      from: "",
      to: "",
    });

    expect(result).toStrictEqual({});
  });
});
