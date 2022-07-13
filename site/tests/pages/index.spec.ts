import {expect, Page, test} from "@playwright/test";
import {injectAxe, checkA11y} from "axe-playwright";
import { waitForCookieBubble, testImg } from "../utils";

test.describe("Page accessability", () => {
	async function Test(page: Page, mode: "dark" | "light") {
		await page.emulateMedia({ colorScheme: mode });
		await page.goto("/");
		await waitForCookieBubble(page);

		await injectAxe(page);
		await checkA11y(page);
	}
	
	test("Dark mode", async ({page}) => {
		await Test(page, "dark");
	});

	test("Light mode", async ({page}) => {
		await Test(page, "dark");
	});
});

test.describe("Event listing", () => {
	test("Listing visible", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("section:has-text('Events 2022')")).toBeVisible();
	});

	test("Expected listing count",async ({page}) => {
		await page.goto("/");
		const eventCount = await page.locator("section:has-text('Events 2022') >> ul li").count();
		expect(eventCount).toBe(1);
	});

	test("Listings have expected alts", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("img[alt='Longstone Edge Hill Climb']")).toBeVisible();
	});

	test("Listings have expected urls", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("img[alt='Longstone Edge Hill Climb'] >> xpath=../..")).toHaveAttribute("href", "/hillclimb");
	});

	test("Listing image resolves correctly", async ({page, request}) => {		
		await page.goto("/");
		await testImg(page, request, "img[alt='Longstone Edge Hill Climb']");
	});
});

test.describe("Partner listing", () => {
	test("Listing visible", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("section:has-text('Our partners:')")).toBeVisible();
	});

	test("Expected listing count",async ({page}) => {
		await page.goto("/");
		const eventCount = await page.locator("section:has-text('Our partners:') >> ul li").count();
		expect(eventCount).toBe(2);
	});

	test("Listings have expected alts", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("img[alt='Brampton Brewery']")).toBeVisible();
		await expect(page.locator("img[alt='PILLAR']")).toBeVisible();
	});

	test("Listings have expected urls", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("img[alt='Brampton Brewery'] >> xpath=../..")).toHaveAttribute("href", "https://www.bramptonbrewery.co.uk/");
		await expect(page.locator("img[alt='PILLAR'] >> xpath=../..")).toHaveAttribute("href", "https://www.pillar-app.com/");
	});

	test("Listing image resolves correctly", async ({page, request}) => {		
		await page.goto("/");
		await testImg(page, request, "img[alt='Brampton Brewery']");
		await testImg(page, request, "img[alt='PILLAR']");
	});
});

test.describe("Welcome banner", () => {
	test("Welcome text visible", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("text=aspire:enjoy:inspire")).toBeVisible();
	});

	test("Banner image visible", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("id=welcome_banner_image")).toBeVisible();
	});

	test("Banner image loads", async ({page, request}) => {
		await page.goto("/");
		await testImg(page, request, "id=welcome_banner_image");
	});

	test("Quote text visible", async ({page}) => {
		await page.goto("/");
		await expect(page.locator("text=Nothing compares to the simple pleasure of riding a bike - John F Kennedy")).toBeVisible();
	});
});
