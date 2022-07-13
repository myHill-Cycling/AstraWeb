import {expect, test} from "@playwright/test";
import { waitForCookieBubble } from "./utils";

test("Consent shown", async ({page}) => {
	await page.goto("/");
	await waitForCookieBubble(page);
	await expect(page.locator("button:has-text('Cookie settings')")).toBeVisible();
	await expect(page.locator("button:has-text('Allow all cookies') >> nth=0")).toBeVisible();
	await expect(page.locator("text=About cookies on this siteWe use cookies to collect and analyse information on s >> a")).toBeVisible();
});
