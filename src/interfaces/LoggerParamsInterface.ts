import { LoggerLevel } from "../enums/LoggerLevelEnum";

export interface LoggerParam {
  info?: boolean;
  warning?: boolean;
  debug?: boolean;
  error?: boolean;
}

export interface WriteLoggerParam {
  functionName: string;
  level: LoggerLevel;
  message: string;
  data?: object;
}

export interface ShowLogParam {
  functionName: string;
  time: string;
  level: LoggerLevel;
  message: string;
  data?: object;
}
