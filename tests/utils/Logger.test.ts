import { LoggerLevel, LoggerStage } from "../../src/enums/LoggerLevelEnum";
import Logger from "../../src/utils/Logger";

describe("Logger methods", () => {
  test("Get an instance", () => {
    const logger = Logger.getInstance();

    expect(typeof logger).toBe("object");
  });

  test("Get twice the same instance", () => {
    const logger = Logger.getInstance();
    const logger2 = Logger.getInstance();

    expect(logger).toBe(logger2);
  });

  test("Destroy the instance", () => {
    const logger = Logger.getInstance();
    Logger.destroyInstance();
    const logger2 = Logger.getInstance();

    expect(logger).not.toBe(logger2);
  });

  test("Write log - dev", () => {
    Logger.destroyInstance();
    process.env.stage = LoggerStage.DEV;
    const logger = Logger.getInstance();

    let hasError = false;

    try {
      logger.writeLogger("test", LoggerLevel.info, 'logger - dev');
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  test("Write log - pre-sta", () => {
    Logger.destroyInstance();
    process.env.stage = LoggerStage.PRE_STA;
    const logger = Logger.getInstance();

    let hasError = false;
    try {
      logger.writeLogger("test", LoggerLevel.info, 'logger - pre sta');
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  test("Write log - sta", () => {
    Logger.destroyInstance();
    process.env.stage = LoggerStage.STA;
    const logger = Logger.getInstance();

    let hasError = false;

    try {
      logger.writeLogger("test", LoggerLevel.info, "logger - sta");
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  test("Logger with data", () => {
    const logger = Logger.getInstance();

    let hasError = false;

    try {
      logger.writeLogger("test", LoggerLevel.info, "logger - with info", {
        info: process.env.stage,
      });
    } catch (error) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });
});
