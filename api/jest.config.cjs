/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	// preset: "ts-jest",
	testEnvironment: "node",
	coverageProvider: "v8",
	testPathIgnorePatterns: ["../site"],
	transformIgnorePatterns: [],
	setupFilesAfterEnv: ["./setup.jest.cjs"],
	restoreMocks: true,
	reporters: ["default", "jest-github-reporter"]
};
