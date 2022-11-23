import { CurrencyRequestInterface } from "../../../src/interfaces/CurrencyRequestInterface";

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
