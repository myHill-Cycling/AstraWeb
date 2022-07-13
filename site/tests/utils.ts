import { Page, APIRequestContext } from "@playwright/test";

export async function testImg(page: Page, request: APIRequestContext, loc: string) {
	const src = await page.locator(loc).getAttribute("src");
	if(!src){
		throw "Img element src null or undefined";
	}
	const resp = await request.get(src, {ignoreHTTPSErrors: true, failOnStatusCode: true});
	if(!resp.ok()){
		throw "Fetching img source failed";
	}				
}

export async function waitForCookieBubble(page: Page) {
	const selector = "body > section > div.ch2-container.ch2-theme-bubble.ch2-style-dark.ch2-ea > div.ch2-dialog.ch2-dialog-left.ch2-visible";

	const animationPromise = page.evaluate((bubbleSelector) => {
		return new Promise<void>((resolve, reject) => {
			const bubble = document.querySelector(bubbleSelector);

			if(!bubble){
				console.error("Unable to locate cookie bubble element");
				reject("Unable to locate cookie bubble element");
			}

			function animationEnd() {
				bubble?.removeEventListener("animationend", animationEnd);
				resolve();
			}

			bubble?.addEventListener("animationend", animationEnd, {
				passive: true
			});
			console.info("Bound animation event listener");
		});
	}, selector);

	const createTimeoutPromise = () => new Promise<void>((resolve) => {
		//If the animation does not transition after 3 seconds we assume that it already happened before we could attach.
		//The bubble not being present is an error the test should flag as the transition time is .3 seconds and anything longer than 3 seconds to transition indicates a performance fault
		setTimeout(resolve, 3 * 1000);
	});

	try {
		await Promise.race([
			animationPromise,
			createTimeoutPromise()
		]);
	} catch (error) {
		console.warn("An error occured while waiting for the cookie bubble. We will attempt to wait the timeout and continue the test");
		console.debug(error);
		await createTimeoutPromise();
	}
}
