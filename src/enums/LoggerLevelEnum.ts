export enum LoggerLevel {
  info = "info",
  warning = "warning",
  debug = "debug",
  error = "error",
}

export enum LoggerTemplate {
  DEFAULT = "[{level}] : {functionName}({time})\n\t{message}\n\n\t{data}",
  DEFAULT_WITHOUT_DATA = "[{level}] : {functionName}({time})\n\t{message}",
}


export enum LoggerStage {
  DEV = "dev",
  STA = "sta",
  PRE_STA = "pre-sta",
}
