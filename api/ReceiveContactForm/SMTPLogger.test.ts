import { Logger } from "@azure/functions";
import { testProp, fc } from "@fast-check/jest";
import { SMTPLogger } from "./SMTPLogger";

function createLoggerMock() {
	return {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		verbose: jest.fn()
	};
}

testProp("Logs trace to context", [fc.fullUnicodeString(), fc.asciiString()], (logMsg, additionalData) => {
	const contextMock = createLoggerMock();
	const logger = new SMTPLogger(contextMock as unknown as Logger);

	logger.level("trace");
	logger.trace(logMsg, additionalData);
	expect(contextMock.verbose).toHaveBeenCalledWith([logMsg, additionalData]);
});

testProp("Logs debug to context", [fc.fullUnicodeString(), fc.asciiString()], (logMsg, additionalData) => {
	const contextMock = createLoggerMock();
	const logger = new SMTPLogger(contextMock as unknown as Logger);

	logger.level("debug");
	logger.debug(logMsg, additionalData);
	expect(contextMock.verbose).toHaveBeenCalledWith([logMsg, additionalData]);
});

testProp("Logs info to context", [fc.fullUnicodeString(), fc.asciiString()], (logMsg, additionalData) => {
	const contextMock = createLoggerMock();
	const logger = new SMTPLogger(contextMock as unknown as Logger);

	logger.level("info");
	logger.info(logMsg, additionalData);
	expect(contextMock.info).toHaveBeenCalledWith([logMsg, additionalData]);
});

testProp("Logs warn to context", [fc.fullUnicodeString(), fc.asciiString()], (logMsg, additionalData) => {
	const contextMock = createLoggerMock();
	const logger = new SMTPLogger(contextMock as unknown as Logger);

	logger.level("warn");
	logger.warn(logMsg, additionalData);
	expect(contextMock.warn).toHaveBeenCalledWith([logMsg, additionalData]);
});

testProp("Logs error to context", [fc.fullUnicodeString(), fc.asciiString()], (logMsg, additionalData) => {
	const contextMock = createLoggerMock();
	const logger = new SMTPLogger(contextMock as unknown as Logger);

	logger.level("error");
	logger.error(logMsg, additionalData);
	expect(contextMock.error).toHaveBeenCalledWith([logMsg, additionalData]);
});

testProp("Logs fatal to context", [fc.fullUnicodeString(), fc.asciiString()], (logMsg, additionalData) => {
	const contextMock = createLoggerMock();
	const logger = new SMTPLogger(contextMock as unknown as Logger);

	logger.level("fatal");
	logger.fatal(logMsg, additionalData);
	expect(contextMock.error).toHaveBeenCalledWith([logMsg, additionalData]);
});

describe("Does not log messages below the current level", () => {
	
	test("Trace", () => {
		const contextMock = createLoggerMock();
		const logger = new SMTPLogger(contextMock as unknown as Logger);

		logger.level("debug");
		logger.trace("Test Message");
		expect(contextMock.verbose).not.toHaveBeenCalled();
	});

	test("Debug", () => {
		const contextMock = createLoggerMock();
		const logger = new SMTPLogger(contextMock as unknown as Logger);

		logger.level("info");
		logger.debug("Test Message");
		expect(contextMock.verbose).not.toHaveBeenCalled();
	});

	test("Info", () => {
		const contextMock = createLoggerMock();
		const logger = new SMTPLogger(contextMock as unknown as Logger);

		logger.level("warn");
		logger.info("Test Message");
		expect(contextMock.info).not.toHaveBeenCalled();
	});

	test("Warn", () => {
		const contextMock = createLoggerMock();
		const logger = new SMTPLogger(contextMock as unknown as Logger);

		logger.level("error");
		logger.warn("Test Message");
		expect(contextMock.warn).not.toHaveBeenCalled();
	});

	test("Error", () => {
		const contextMock = createLoggerMock();
		const logger = new SMTPLogger(contextMock as unknown as Logger);

		logger.level("fatal");
		logger.error("Test Message");
		expect(contextMock.error).not.toHaveBeenCalled();
	});

	test("Fatal", () => {
		const contextMock = createLoggerMock();
		const logger = new SMTPLogger(contextMock as unknown as Logger);

		logger["_level"] = 1000;
		logger.fatal("Test Message");
		expect(contextMock.error).not.toHaveBeenCalled();
	});
});
