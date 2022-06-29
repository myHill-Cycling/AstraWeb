import { expect, Page, test } from "@playwright/test";

type modeType = "dark" | "light"

function Tests(mode: modeType) {
	async function setupPage(page: Page) {
		await page.emulateMedia({ colorScheme: mode});    
		await page.goto("/");
		await page.locator(toggleLocatorString).waitFor();
	}

	const toggleLocatorString = "#ToggleButton_DarkModeSwitch";
    
	test("Toggle should be visible", async ({ page }) => {        
		await setupPage(page);
		await expect(page.locator(toggleLocatorString)).toBeVisible();
	});

	test("Toggle should have appropriate ARIA label", async ({page}) => {
		await setupPage(page);
		await expect(page.locator(toggleLocatorString)).toHaveAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
	});

	test("Toggle should change aria", async ({page}) => {
		// await page.pause();
		await setupPage(page);
		await page.locator(toggleLocatorString).click();
		// await page.pause();
		await expect(page.locator(toggleLocatorString)).toHaveAttribute("aria-label", mode === "dark" ? "Switch to dark mode" : "Switch to light mode");
	});

	test("Toggle should change local storage", async ({page}) => {
		await setupPage(page);
		await page.locator(toggleLocatorString).click();

		const storedMode = await page.evaluate<string>(() => localStorage.getItem("color-theme") ?? "err");
		if(mode === "dark"){
			expect(storedMode).toBe("light");
		}
		else if (mode === "light") {
			expect(storedMode).toBe("dark");
		}
		else {
			throw "Local storage did not contain an acceptable value: " + storedMode;
		}
	});

	test("Toggle should change document class list", async ({page}) => {
		await setupPage(page);
		page.locator(toggleLocatorString).click();

		if(mode === "dark"){
			await expect(page.locator("html")).not.toHaveClass("dark");
		}
		else {
			await expect(page.locator("html")).toHaveClass("dark");
		}
	});
}

test.describe("Dark Mode", () => {    
	Tests("dark");
});

test.describe("Light Mode", () => {
	Tests("light");
});