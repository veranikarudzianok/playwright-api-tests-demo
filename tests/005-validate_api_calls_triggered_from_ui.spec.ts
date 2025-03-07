import { test, expect } from '@playwright/test';
import { createArticleAPI, deleteArticleAPI } from '../api-helpers/api-helpers';
import articles from '../test-data/articles.json';

let slugValue: string;

test('Validate API call triggered by UI action', async ({ page }) => {
	// post a new article
	slugValue = await createArticleAPI(articles.article2);

	// open a website
	await page.goto('/');
	await page.waitForLoadState('domcontentloaded', { timeout: 60000 });

	// set up a listener for the expected request
	page.on('request', (request) => {
		if (request.url().includes('/favorite') && request.method() === 'POST') {
			console.log(`Request: ${request.url()} successfully catched`);
		}
	});

	// trigger an action - add an article to favorites
	await page.locator('app-favorite-button button').first().click();

	// validate expected response
	const articleResponse = await page.waitForResponse(/\/favorite/); 
	const articleResponseBody = await articleResponse.json();
	const favourited = articleResponseBody.article.favorited;
	expect(favourited).toBeTruthy();

	// make sure ui responded as expected
	await expect(page.locator('app-favorite-button button').first()).toHaveCSS('background-color', 'rgb(68, 157, 68)');
});

test.afterEach(async ({ page }) => {
	await page.close();

	// delete test data
	deleteArticleAPI(slugValue);
});
