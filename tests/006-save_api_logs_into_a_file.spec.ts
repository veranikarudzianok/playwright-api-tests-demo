import { test } from '@playwright/test';
import * as fs from 'fs';

test('Save API logs to a file', async ({ page }) => {
	let apiLogs: any[] = [];

	page.on('response', async (response) => {
		if (response.url().includes('/api/')) {
			try {
				const jsonResponse = await response.json();
				apiLogs.push({
					url: response.url(),
					status: response.status(),
					response: jsonResponse,
				});
			} catch (e) {
				apiLogs.push({
					url: response.url(),
					status: response.status(),
					response: 'Non-JSON response',
				});
			}
		}
	});

	// open a website
	await page.goto('https://conduit.bondaracademy.com/');
	await page.waitForLoadState('networkidle', { timeout: 60000 });

	// save logs to a file
	fs.writeFileSync('./api-logs/api_logs.json', JSON.stringify(apiLogs, null, 2), 'utf-8');
});
