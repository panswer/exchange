export interface CurrencyRequestInterface {
  from: string;
  to: string;
  amount: number;
}
export interface CurrencyEventRequestInterface {
  body: CurrencyRequestInterface;
}
