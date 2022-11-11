import CurrencyApiService from "../../src/services/CurrencyApiService";

import { apiServiceGoodRequest } from "../mocks/services/CurrencyApiService";

process.env.API_LAYER_KEY = "123";
process.env.API_LAYER_URL = "123";

const mockGetFn = jest.fn().mockResolvedValue({
  data: {},
});

jest.mock("axios", () => ({
  get: () => mockGetFn(),
}));

describe("CurrencyApiService - services", () => {
  describe("Should test to get and destroy an instance", () => {
    test("Should test to get an instance", () => {
      const currencyApiService = CurrencyApiService.getInstance();

      expect(currencyApiService).toBeInstanceOf(CurrencyApiService);
    });

    test("Should test to get twice the same instance", () => {
      const currencyApiService = CurrencyApiService.getInstance();
      const currencyApiService2 = CurrencyApiService.getInstance();

      expect(currencyApiService).toBe(currencyApiService2);
    });

    test("Should test to destroy and get a new instance", () => {
      const currencyApiService = CurrencyApiService.getInstance();

      CurrencyApiService.destroyInstance();

      const currencyApiService2 = CurrencyApiService.getInstance();

      expect(currencyApiService).not.toBe(currencyApiService2);
    });
  });

  describe("Should test the methods on the class", () => {
    beforeEach(() => {
      CurrencyApiService.destroyInstance();
    });

    test("Should test to get exchange currency success", () => {
      const currencyApiService = CurrencyApiService.getInstance();

      expect(
        currencyApiService.getExchangeCurrency(apiServiceGoodRequest)
      ).resolves.toStrictEqual({});
    });

    test("Should test to get an error from the api", () => {
      mockGetFn.mockRejectedValueOnce(new Error("Test error"));
      const currencyApiService = CurrencyApiService.getInstance();

      expect(
        currencyApiService.getExchangeCurrency(apiServiceGoodRequest)
      ).rejects.toHaveProperty("message", "Test error");
    });
  });
});
