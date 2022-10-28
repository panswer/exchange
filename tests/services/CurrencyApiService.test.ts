import axios from "axios";
import CurrencyApiService from "../../src/services/CurrencyApiService";

process.env.API_LAYER_KEY = "123";
process.env.API_LAYER_URL = "123";

jest.mock("axios", () => ({
  get: () => {
    return {
      data: {},
    };
  },
}));

describe("Api Layer", () => {
  test("Get an instance", () => {
    const currencyApiService = CurrencyApiService.getInstance();

    expect(typeof currencyApiService).toBe("object");
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

    expect(typeof result).toBe("object");
  });
});
