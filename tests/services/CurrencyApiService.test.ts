import CurrencyApiService from "../../src/services/CurrencyApiService";

import { apiServiceGoodRequestMock } from "../mocks/services/CurrencyApiService";

process.env.API_LAYER_KEY = "123";
process.env.API_LAYER_URL = "123";

const mockGetFn = jest.fn().mockResolvedValue({
  data: {},
});

jest.mock("axios", () => ({
  get: () => mockGetFn(),
}));

describe("CurrencyApiService - services", () => {
  describe("Should get and destroy an instance", () => {
    it("Should test to get an instance", () => {
      const currencyApiService = CurrencyApiService.getInstance();

      expect(currencyApiService).toBeInstanceOf(CurrencyApiService);
    });

    it("Should test to get twice the same instance", () => {
      const currencyApiService = CurrencyApiService.getInstance();
      const currencyApiService2 = CurrencyApiService.getInstance();

      expect(currencyApiService).toBe(currencyApiService2);
    });

    it("Should test to destroy and get a new instance", () => {
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

    it("Should get exchange currency success", () => {
      const currencyApiService = CurrencyApiService.getInstance();

      expect(
        currencyApiService.getExchangeCurrency(apiServiceGoodRequestMock)
      ).resolves.toStrictEqual({});
    });

    it("When the API didn't response", () => {
      mockGetFn.mockRejectedValueOnce(new Error("Test error"));
      const currencyApiService = CurrencyApiService.getInstance();

      expect(
        currencyApiService.getExchangeCurrency(apiServiceGoodRequestMock)
      ).rejects.toHaveProperty("message", "Test error");
    });
  });
});
