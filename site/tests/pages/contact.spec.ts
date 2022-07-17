import {expect, Page, test} from "@playwright/test";
import {injectAxe, checkA11y} from "axe-playwright";
import fc from "fast-check";

test.describe("Page accessability", () => {
	async function Test(page: Page, mode: "dark" | "light") {
		await page.emulateMedia({ colorScheme: mode });
		await page.goto("/");

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

async function FillForm(page: Page, message = true, subject = true, name = true, email = true) {
	
	if(name) {
		// Click input[name="name"]
		await page.locator("input[name=\"name\"]").click();
		// Fill input[name="name"]
		await page.locator("input[name=\"name\"]").fill("Bob Example");
	}
	
	if(email) {
		// Click input[name="email"]
		await page.locator("input[name=\"email\"]").click();
		// Fill input[name="email"]
		await page.locator("input[name=\"email\"]").fill("bob@example.com");
	}

	if(subject) {
		// Click input[name="subject"]
		await page.locator("input[name=\"subject\"]").click();
		// Fill input[name="subject"]
		await page.locator("input[name=\"subject\"]").fill("This is a subject from a E2E test");
	}
	
	if(message) {
		// Click textarea[name="message"]
		await page.locator("textarea[name=\"message\"]").click();
		// Fill textarea[name="message"]
		await page.locator("textarea[name=\"message\"]").fill("This is a longer message generated in a playwright test for end to end system testing and visual browser testing.");
	}
}

test("Form generates expected request", async ({page, context}) => {
	
	await context.route("**/api/contact", async (route, request) => {		
		await route.fulfill({
			status: 200,
			body: JSON.stringify({
				status: "success"
			}),
		});

		expect(request.isNavigationRequest()).not.toBeTruthy();
		expect(await request.headerValue("Content-Type")).toContain("application/x-www-form-urlencoded");
		const data = new URLSearchParams(request.postData() ?? "");
		const obj = Object.fromEntries(data);
		expect(obj).toStrictEqual({
			name: "Bob Example",
			email: "bob@example.com",
			subject: "This is a subject from a E2E test",
			message: "This is a longer message generated in a playwright test for end to end system testing and visual browser testing."
		});
	});

	// Go to https://127.0.0.1:4280/contact.html
	await page.goto("https://127.0.0.1:4280/contact.html");

	await FillForm(page);

	await page.locator("text=Send").click();
});

test.describe("Browser side validation conforms to expected schemas", () => {
	fc.assert(
		fc.property(fc.tuple(fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean()), (inputs) => {
			const [fillName, fillEmail, fillSubject, fillMessage] = inputs;
			test(`Name: ${fillName}, E-Mail: ${fillEmail}, Subject: ${fillSubject}, Message: ${fillMessage}`, async ({page}) => {
				await page.goto("https://127.0.0.1:4280/contact.html");
			
				await FillForm(page, fillMessage, fillSubject, fillName, fillEmail);

				const formValid = await page.evaluate<boolean>(() => {
					return (document.getElementById("contactForm") as HTMLFormElement).reportValidity();
				});

				if(fillEmail && fillName && fillSubject){
					expect(formValid).toBeTruthy();
				}
				else{
					expect(formValid).toBeFalsy();
				}
			});
		})
		, {ignoreEqualValues: true});
});

test("Success notification shown", async ({page}) => {

	await page.route("**/api/contact", async (route) => {		
		await route.fulfill({
			status: 200,
			body: JSON.stringify({
				status: "success"
			}),
		});
	});

	await page.goto("https://127.0.0.1:4280/contact.html");
			
	await FillForm(page, true, true, true, true);
	await page.locator("text=Send").click();

	await expect(page.locator("text='Your query has been submitted successfully!'")).toBeVisible();
	await expect(page.locator("text='There was a problem submitting your query. Please try again in a few minutes'")).not.toBeVisible();
});

test("Failure notification shown", async ({page}) => {

	await page.route("**/api/contact", async (route) => {		
		await route.fulfill({
			status: 400,
			body: JSON.stringify({
				status: "send-error"
			}),
		});
	});

	await page.goto("https://127.0.0.1:4280/contact.html");
			
	await FillForm(page, true, true, true, true);
	await page.locator("text=Send").click();

	await expect(page.locator("text='There was a problem submitting your query. Please try again in a few minutes'")).toBeVisible();
	await expect(page.locator("text='Your query has been submitted successfully!'")).not.toBeVisible();
});

test.describe("Notification accessability", () => {
	async function baseTest(page: Page) {
		await page.goto("https://127.0.0.1:4280/contact.html");
				
		await FillForm(page, true, true, true, true);
		await page.locator("text=Send").click();
		await injectAxe(page);
		await checkA11y(page);
	}
	
	async function successTest(page: Page) {
		await page.route("**/api/contact", async (route) => {		
			await route.fulfill({
				status: 200,
				body: JSON.stringify({
					status: "success"
				}),
			});
		});
	
		await baseTest(page);
	}

	async function failTest(page: Page) {
		await page.route("**/api/contact", async (route) => {		
			await route.fulfill({
				status: 400,
				body: JSON.stringify({
					status: "send-error"
				}),
			});
		});
	
		await baseTest(page);
	}
	
	test.describe("Success notification", () => {
		test("Dark Mode", async ({page}) => {
			await page.emulateMedia({colorScheme: "dark"});

			await successTest(page);
		});

		test("Light Mode", async ({page}) => {
			await page.emulateMedia({colorScheme: "light"});

			await successTest(page);
		});
	});

	test.describe("Fail notification", () => {
		test("Dark Mode", async ({page}) => {
			await page.emulateMedia({colorScheme: "dark"});

			await failTest(page);
		});

		test("Light Mode", async ({page}) => {
			await page.emulateMedia({colorScheme: "light"});

			await failTest(page);
		});
	});
});
