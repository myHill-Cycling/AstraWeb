import {expect, Page, test} from "@playwright/test";
import {injectAxe, checkA11y} from "axe-playwright";
import navLinks from "../src/helpers/NavigationLinks";

const navList = "#mobile-menu-4";
const navToggle = "[data-collapse-toggle='mobile-menu-4']";
const mobileBreakpoint = 768;


test("Toggle is visible on mobile", async ({page}) => {
	const size = page.viewportSize();
	const skip = (size?.width ?? 0) >= mobileBreakpoint;
	test.skip(skip, "Skipped due to viewport size");
	
	await page.goto("/");
	await expect(page.locator(navToggle)).toBeVisible();
});

test("Mobile list does not start visible", async ({page}) => {
	const size = page.viewportSize();
	const skip = (size?.width ?? 0) >= mobileBreakpoint;
	test.skip(skip, "Skipped due to viewport size");
	
	await page.goto("/");
	await expect(page.locator(navList)).not.toBeVisible();
});

test("List is visible on mobile", async ({page}) => {
	const size = page.viewportSize();
	const skip = (size?.width ?? 0) >= mobileBreakpoint;
	test.skip(skip, "Skipped due to viewport size");
	
	await page.goto("/");
	await page.locator(navToggle).click();
	await expect(page.locator(navList)).toBeVisible();
});

test.describe("List is accessible on mobile", () => {
	async function Test(page: Page, mode: "light" | "dark") {
		const size = page.viewportSize();
		const skip = (size?.width ?? 0) >= mobileBreakpoint;
		test.skip(skip, "Skipped due to viewport size");
		await page.emulateMedia({ colorScheme: mode });

		await page.goto("/");
		// Wait for this to be visible so the transition doesn't throw off the accessability tests
		await page.locator("button:has-text('Cookie settings')").waitFor({state: "visible"});
		await injectAxe(page);
		await page.locator(navToggle).click();
		await page.locator(navList).waitFor({state: "visible"});
		await checkA11y(page);
	}

	test("Dark Mode", async ({page}) => {
		await Test(page, "dark");
	});

	test("Light Mode", async ({page}) => {
		await Test(page, "light");
	});
});

const navListItemsSelector = navList + " >> ul li a";

test("List contains correct URLs", async ({page}) => {	
	await page.goto("/");

	const locator = page.locator(navListItemsSelector);
	const html = [];
	
	const htmlCount = await locator.count();
	for (let y = 0; y < htmlCount; y++) {
		html.push(await locator.nth(y).getAttribute("href"));
	}

	const expected = navLinks.map(x => x.url);

	expect(html).toHaveLength(expected.length);
	for (let i = 0; i < expected.length; i++) {
		expect(html[i]).toMatch(expected[i]);
	}
});

test("List contains correct names", async ({page}) => {	
	await page.goto("/");
	const html = await page.locator(navListItemsSelector).allTextContents();
	const expected = navLinks.map(x => x.name);

	expect(html).toHaveLength(expected.length);
	for (let i = 0; i < expected.length; i++) {
		expect(html[i]).toMatch(expected[i]);
	}
});
