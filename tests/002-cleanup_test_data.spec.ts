import { test, expect } from '@playwright/test';
import { deleteArticleAPI, generateHash } from '../api-helpers/api-helpers';

let slugValue: string;
const hash = generateHash();

test('Create an article', async ({ page }) => {
	// open website
	await page.goto('https://conduit.bondaracademy.com/');
	await page.waitForLoadState('domcontentloaded', { timeout: 60000 });

	// publish an article
	await page.getByText('New Article').click();
	await page.getByRole('textbox', { name: 'Article Title' }).fill(`Test title ${hash}`);
	await page.getByRole('textbox', { name: "What's this article about?" }).fill(`Test about ${hash}`);
	await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill(`Test description ${hash}`);
	await page.getByRole('button', { name: 'Publish Article' }).click();
	const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
	const articleResponseBody = await articleResponse.json();
	slugValue = articleResponseBody.article.slug;
	await expect(page.locator('.article-page h1')).toContainText(`Test title ${hash}`);

	// navigate to the home page and validate an article has been created
	await page.getByText('Home').click();
	await page.getByText('Global Feed').click();
	await expect(page.locator('app-article-list h1').first()).toContainText(`Test title ${hash}`);
});

test.afterEach(async ({ page }) => {
	await page.close();

	// Delete test data
	deleteArticleAPI(slugValue);
});
