import CurrencyApiService from "../../src/services/CurrencyApiService";

process.env.API_LAYER_KEY = "123";
process.env.API_LAYER_URL = "123";

const mockGetFn = jest.fn().mockResolvedValue({
  data: {},
});

jest.mock("axios", () => ({
  get: () => mockGetFn(),
}));

describe("Api Layer", () => {
  describe("Test about instance of class", () => {
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
  });

  describe("Test about methods of class", () => {
    beforeEach(() => {
      CurrencyApiService.destroyInstance();
    });
    test("Get exchange currency ", () => {
      const currencyApiService = CurrencyApiService.getInstance();

      expect(
        currencyApiService.getExchangeCurrency({
          amount: 1,
          from: "USD",
          to: "EUR",
        })
      ).resolves.toStrictEqual({});
    });

    test("Throw an error from API", () => {
      mockGetFn.mockRejectedValueOnce(new Error("Test error"));
      const currencyApiService = CurrencyApiService.getInstance();

      expect(
        currencyApiService.getExchangeCurrency({
          amount: 1,
          from: "USD",
          to: "EUR",
        })
      ).rejects.toHaveProperty("message", "Test error");
    });
  });
});
