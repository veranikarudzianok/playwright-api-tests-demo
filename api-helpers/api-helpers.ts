import { APIRequestContext, expect, request } from '@playwright/test';

export async function createArticleAPI(postdata: any) {
	const apiContext: APIRequestContext = await request.newContext();
	const options = {
		data: postdata,
	};
	const postResponse = await apiContext.post('https://conduit-api.bondaracademy.com/api/articles/', options);
	expect(postResponse.status()).toEqual(201);
	const postResponseBody = await postResponse.json();
	const slugValue = postResponseBody.article.slug;
	return slugValue;
}

export async function deleteArticleAPI(slugValue: string) {
	const apiContext: APIRequestContext = await request.newContext();
	const deleteResponse = await apiContext.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugValue}`);
	expect(deleteResponse.status()).toEqual(204);
}

// this is an example of the function that might be used to get SMS code from slack bot
export async function getSMSCodeAPI(stamp: string) {
	const apiContext: APIRequestContext = await request.newContext();
	const options = {
		headers: {
			Accept: '*/*',
			Authorization: `Bearer 1234567890qwertyuiopasdfghjklzxcvbnm`,
		},
	};
	const getSMSRequest = await apiContext.get(`https://slack.com/api/conversations.history?channel=1234567890&oldest=${stamp}`, options);
	expect(getSMSRequest.ok()).toBeTruthy();
	const body = JSON.parse(await getSMSRequest.text());
	return body.messages.filter((item: any) => item.subtype === 'bot_message')[0];
}

export const generateHash = (length = 8) => {
	let text = '';
	const allowedChars = 'abcdefghijklmnopqrstuvwxyz';
	for (var i = 0; i < length; i++) text += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
	return text;
};
