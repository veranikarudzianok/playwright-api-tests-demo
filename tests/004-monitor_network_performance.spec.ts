import { test } from '@playwright/test';

test('Get Time to First Byte (TTFB) for /api/articles', async ({ page }) => {
	// set up a listener
	page.on('response', async (response) => {
		if (response.url().includes('/api/articles')) {
			const request = response.request();
			const timing = request.timing();
			console.log(`Time to First Byte (TTFB): ${timing.responseStart - timing.requestStart} ms`);
		}
	});

	// visit the page
	await page.goto('https://conduit.bondaracademy.com/', { timeout: 60000 });

	// wait for the response explicitly
	await page.waitForResponse((response) => response.url().includes('/api/articles'));
});
