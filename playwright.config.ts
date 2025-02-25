import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: false,
	retries: 0,
	workers: 1,
	reporter: 'html',
	use: {
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
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'], storageState: '.auth/user.json' },
			dependencies: ['setup'],
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'], storageState: '.auth/user.json' },
			dependencies: ['setup'],
		},
	],
});
