import {expect, test} from "@playwright/test";

test("Consent shown", async ({page}) => {
	await page.goto("/");
	await page.locator("button:has-text('Cookie settings')").waitFor({state: "visible"});
	await expect(page.locator("button:has-text('Cookie settings')")).toBeVisible();
	await expect(page.locator("button:has-text('Allow all cookies')")).toBeVisible();
	await expect(page.locator("text=About cookies on this siteWe use cookies to collect and analyse information on s >> a")).toBeVisible();
});
