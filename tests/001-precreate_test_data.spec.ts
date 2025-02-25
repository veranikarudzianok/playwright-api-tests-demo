import { test, expect } from '@playwright/test';
import { createArticleAPI } from '../api-helpers/api-helpers';
import articles from '../test-data/articles.json';

let slugValue: string;

test.beforeEach(async () => {
	// post a new article
	slugValue = await createArticleAPI(articles.article1);
});

test('Delete an article', async ({ page }) => {
	// open website
	await page.goto('https://conduit.bondaracademy.com/');
	await page.waitForLoadState('domcontentloaded', { timeout: 60000 });

	// delete article
	await page.getByText(articles.article1.article.title).click();
	await page.getByRole('button', { name: 'Delete Article' }).first().click();
	await expect(page.locator('app-article-preview h1').first()).not.toContainText(articles.article1.article.title);
});

test.afterEach(async ({ page }) => {
	await page.close();
});
