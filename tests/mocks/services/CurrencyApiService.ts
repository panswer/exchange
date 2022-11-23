import { ApiLayerResponseInterface } from "../../../src/interfaces/ApiLayerResponseInterface";

export const apiServiceGoodRequestMock = {
  amount: 1,
  from: "USD",
  to: "EUR",
};

export const getExchangeCurrencyResponseSuccessMock: ApiLayerResponseInterface =
  {
    date: "",
    info: {
      rate: 1.5,
      timestamp: new Date().getMilliseconds(),
    },
    query: {
      amount: 2,
      from: "USD",
      to: "EUR",
    },
    result: 3,
    success: true,
  };
