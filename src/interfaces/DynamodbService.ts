export interface NewCurrencyRequest {
  currencyRequestId: string;
  currencyFrom: string;
  currencyTo: string;
  amount: number;
  createdAt: number;
  amountResult: number;
  username: string;
}
