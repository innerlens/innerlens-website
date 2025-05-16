import { jest } from '@jest/globals';
/**
 * @jest-environment jsdom
 */
import Logger from "../../../js/util/logger.js";

describe("Logger", () => {
  let logger;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  test("sets global level by string", () => {
    Logger.setGlobalLevel("debug");
    expect(Logger.globalLevel).toBe(Logger.LEVELS.DEBUG);
  });

  test("sets global level by number", () => {
    Logger.setGlobalLevel(1);
    expect(Logger.globalLevel).toBe(Logger.LEVELS.WARN);
  });

  test("constructor applies defaults", () => {
    logger = new Logger();
    expect(logger.prefix).toBe("");
    expect(logger.useColors).toBe(true);
    expect(logger.level).toBe(Logger.globalLevel);
  });

  test("setLevel works with string and number", () => {
    logger = new Logger();
    logger.setLevel("trace");
    expect(logger.level).toBe(Logger.LEVELS.TRACE);

    logger.setLevel(2);
    expect(logger.level).toBe(Logger.LEVELS.INFO);
  });

  test("does not log if message level is above logger level", () => {
    logger = new Logger({ level: Logger.LEVELS.WARN });
    logger.info("This should not log");
    expect(console.info).not.toHaveBeenCalled();
  });

  test("logs with correct method and styles", () => {
    logger = new Logger({ level: Logger.LEVELS.TRACE, prefix: "TEST", useColors: true });
    logger.error("Error message");
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/ERROR.*TEST.*Error message/), expect.any(String));

    logger.warn("Warning");
    expect(console.warn).toHaveBeenCalled();

    logger.info("Info message");
    expect(console.info).toHaveBeenCalled();

    logger.debug("Debugging");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("DEBUG"), expect.any(String));

    logger.trace("Trace details");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("TRACE"), expect.any(String));
  });

  test("logs without color formatting if useColors = false", () => {
    logger = new Logger({ useColors: false, level: Logger.LEVELS.DEBUG });
    logger.info("Plain info");

    const callArgs = console.log.mock.calls[0];
    expect(callArgs[0]).toMatch(/INFO.*Plain info/);
  });


  test("formats messages with prefix", () => {
    logger = new Logger({ prefix: "ModuleX", useColors: false, level: Logger.LEVELS.INFO });
    logger.info("Prefixed log");

    const message = console.log.mock.calls[0][0]; 
    expect(message).toContain("ModuleX");
    expect(message).toContain("Prefixed log");
  });
});
