import {expect, Page, test} from "@playwright/test";
import {injectAxe, checkA11y} from "axe-playwright";
import { waitForCookieBubble } from "../utils";

export async function testPage(page: Page, expectedCode: number, expectedMessage: string, expectedExplainer?: string){
	await page.goto("/" + expectedCode +".html");
	await expect(page.locator("text="+expectedCode)).toBeVisible();
	await expect(page.locator("text="+expectedMessage)).toBeVisible();
	if(expectedExplainer){
		await expect(page.locator("text="+expectedExplainer)).toBeVisible();
	}
	await expect(page.locator("id=error_banner_image")).toBeVisible();
}

test.describe("Accessability", () => {

	async function Test(page: Page, mode: "light" | "dark") {
		await page.emulateMedia({colorScheme: mode});
		await page.goto("/404.html");
		await waitForCookieBubble(page);
		await injectAxe(page);
		await checkA11y(page);
	}

	test("Dark mode", async ({page}) => {
		await Test(page, "dark");
	});

	test("Light mode", async ({page}) => {
		await Test(page, "light");
	});
});
