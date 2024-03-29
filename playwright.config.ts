import type { PlaywrightTestConfig, ReporterDescription } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

function createReporterList(): ReporterDescription[] {
	const list: ReporterDescription[] = [["list"], ["junit", {outputFile: "./playwright-report/results.xml"}]];

	if(process.env.CI) {
		list.push(["github"]);
	}

	return list;
}

const localServerUrl = process.env.CI ? process.env.TEST_URL : "https://127.0.0.1:4280";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: "./tests",
	/* Maximum time one test can run for. */
	timeout: 30 * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 8 * 1000
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: createReporterList(),
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: localServerUrl,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
		video: "on-first-retry"
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				serviceWorkers: "block"
			},
		},

		{
			name: "firefox",
			use: {
				...devices["Desktop Firefox"],
				ignoreHTTPSErrors: true,
				serviceWorkers: "block"
			},
		},

		{
			name: "webkit",
			use: {
				...devices["Desktop Safari"],
				serviceWorkers: "block"
			},
		},

		/* Test against mobile viewports. */
		{
			name: "Mobile Chrome",
			use: {
				...devices["Pixel 5"],
				serviceWorkers: "block"
			},
		},
		{
			name: "Mobile Safari",
			use: {
				...devices["iPhone 12"],
				serviceWorkers: "block"
			},
		},

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: {
		//     channel: 'msedge',
		//   },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: {
		//     channel: 'chrome',
		//   },
		// },
	],

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	outputDir: "test-results/"
};

if(!process.env.CI){
	/* Run your local dev server before starting the tests */
	config.webServer = {
		command: "yarn run start",
		url: localServerUrl,
		reuseExistingServer: !process.env.CI,
		ignoreHTTPSErrors: true
	};
}

export default config;
