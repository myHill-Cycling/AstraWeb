import {expect, test} from "@playwright/test";
import { testPage } from "./error_template.spec";


test.describe("404", () => {
	test("Unknown page returns 404", async ({page}) => {
		await page.goto("unknown_page.html");
		expect(new URL(page.url()).pathname).toBe("/unknown_page.html"); //The URL should not have changed
		await testPage(page, 404, "Not Found");
	});

	test("Provides expected text", async ({page}) => {
		await testPage(page, 404, "Not Found");
	});
});

test("401", async ({page}) => {
	await testPage(page, 401, "Unauthorized");
});

test("403", async ({page}) => {
	await testPage(page, 403, "Forbidden");
});

test("400", async ({page}) => {
	await testPage(page, 400, "Bad Request");
});
