import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
	// mock and modify entire response
	await page.route('*/**/api/tags', async (route) => {
		await route.fulfill({
			body: JSON.stringify(tags),
		});
	});

	// mock and modify a part of response
	await page.route('*/**/api/articles*', async (route) => {
		const response = await route.fetch();
		const responseBody = await response.json();
		responseBody.articles[0].title = 'This is a modified title';
		responseBody.articles[0].description = 'This is a modified description';

		await route.fulfill({
			body: JSON.stringify(responseBody),
		});
	});

	// go to website to trigger requests
	await page.goto('/');
	await page.waitForLoadState('networkidle', { timeout: 60000 });
});

test('Validate modified data on UI', async ({ page }) => {
	// validate tags
	const tagsOnUi = await page.locator('.sidebar .tag-list a').allTextContents();
	const cleanedTagsOnUi = tagsOnUi.map((tag) => tag.trim());
	expect(cleanedTagsOnUi).toEqual(tags.tags);

	// validate articles
	await expect(page.locator('app-article-preview h1').first()).toContainText('This is a modified title');
	await expect(page.locator('app-article-preview p').first()).toContainText('This is a modified description');

	await page.unrouteAll({ behavior: 'ignoreErrors' }); // optional line, might be useful to clean up active routes for the next tests (if any added)
});
