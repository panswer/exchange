export interface ApiLayerQueryInterface {
  from: string;
  to: string;
  amount: number;
}

export interface ApiLayerInfoInterface {
  timestamp: number;
  rate: number;
}

export interface ApiLayerResponseInterface {
  success: boolean;
  query: ApiLayerQueryInterface;
  info: ApiLayerInfoInterface;
  date: string;
  result: number;
}
