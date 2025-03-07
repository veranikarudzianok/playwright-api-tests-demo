import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

export default defineConfig({
	testDir: './tests',
	fullyParallel: false,
	retries: 0,
	workers: 1,
	reporter: 'html',
	use: {
		baseURL: 'https://conduit.bondaracademy.com',
		trace: 'on-first-retry',
		extraHTTPHeaders: {
			Authorization: `Token ${process.env.ACCESS_TOKEN}`,
		},
	},

	projects: [
		{
			name: 'setup',
			testMatch: 'auth.setup.ts',
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
			dependencies: ['setup'],
		}
	],
});
