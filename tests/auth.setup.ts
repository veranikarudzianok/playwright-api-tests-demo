import { test as setup } from '@playwright/test';
import user from '../.auth/user.json';
import fs from 'fs';

const authFile = '.auth/user.json';

setup('Authenticate', async ({ request }) => {
	// get access token using API
	const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
		data: {
			user: { email: 'veranika.rudzianok@gmail.com', password: 'Tester123@' },
		},
	});
	const loginResponseBody = await loginResponse.json();
	const accessToken = loginResponseBody.user.token;

	// save access token value into the process.env variable for using is extraHTTPHeaders configured in "playwright.config.ts"
	user.origins[0].localStorage[0].value = accessToken;
	fs.writeFileSync(authFile, JSON.stringify(user));
	process.env['ACCESS_TOKEN'] = accessToken;
});
