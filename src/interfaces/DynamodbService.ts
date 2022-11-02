export interface CurrencyRequest {
  currencyTo: string;
  currencyFrom: string;
  amount: number;
  createdAt?: Date;
  amountResult: number;
  username: string;
}
export interface NewCurrencyRequest {
  currencyRequestId: string;
  currencyFrom: string;
  currencyTo: string;
  amount: number;
  createdAt: number;
  amountResult: number;
  username: string;
}
