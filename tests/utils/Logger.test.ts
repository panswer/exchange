import { LoggerLevel, LoggerStage } from "../../src/enums/LoggerLevelEnum";
import Logger from "../../src/utils/Logger";

describe("Logger - utils", () => {
  beforeEach(() => {
    Logger.destroyInstance();
  });
  it("Should test to get an instance", () => {
    const logger = Logger.getInstance();

    expect(logger).toBeInstanceOf(Logger);
  });

  it("Should test to get twice the same instance", () => {
    const logger = Logger.getInstance();
    const logger2 = Logger.getInstance();

    expect(logger).toBe(logger2);
  });

  it("Should test to destroy the instance and get a new instance", () => {
    const logger = Logger.getInstance();
    Logger.destroyInstance();
    const logger2 = Logger.getInstance();

    expect(logger).not.toBe(logger2);
  });

  it("Should test to write log in dev stage", () => {
    process.env.stage = LoggerStage.DEV;
    const logger = Logger.getInstance();

    let hasError = false;

    try {
      logger.writeLogger({
        functionName: "test",
        level: LoggerLevel.info,
        message: "logger - dev",
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  it("Should test to write log in pre-sta stage", () => {
    process.env.stage = LoggerStage.PRE_STA;
    const logger = Logger.getInstance();

    let hasError = false;
    try {
      logger.writeLogger({
        functionName: "test",
        level: LoggerLevel.info,
        message: "logger - pre sta",
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  it("Should test to write log in sta stage", () => {
    process.env.stage = LoggerStage.STA;
    const logger = Logger.getInstance();

    let hasError = false;

    try {
      logger.writeLogger({
        functionName: "test",
        level: LoggerLevel.info,
        message: "logger - sta",
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  it("Should test to write log with data", () => {
    const logger = Logger.getInstance();

    let hasError = false;

    try {
      logger.writeLogger({
        functionName: "test",
        level: LoggerLevel.info,
        message: "logger - with info",
        data: {
          info: process.env.stage,
        },
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });
});
