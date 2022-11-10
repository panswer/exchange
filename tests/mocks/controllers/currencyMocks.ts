import { ApiLayerResponseInterface } from "../../../src/interfaces/ApiLayerResponseInterface";
import { CurrencyRequestInterface } from "../../../src/interfaces/CurrencyRequestInterface";

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

export const currencyRequestSucessMock: CurrencyRequestInterface = {
  amount: 2,
  from: "USD",
  to: "EUR",
};

export const currencyRequestBadMock = {
  amount: 2,
  from: "USD",
};

export const saveCurrencyRequestSuccessMock = {};
