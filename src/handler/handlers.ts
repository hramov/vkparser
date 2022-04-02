import { Browser, ElementHandle, Page } from 'puppeteer';
import { selectors } from './selector';

export async function signIn(browser: Browser, id: string) {
	const page = await browser.newPage();
	page.setDefaultTimeout(10000);

	await page.goto(`https://vk.com/${id}`);
	await page.waitForTimeout(2000);
	await page.screenshot({ path: './file.jpeg', fullPage: true, type: 'jpeg'});
	const signInButton = await page.$(selectors.SIGNIN_BUTTON);
	await signInButton?.click();
	await page.waitForTimeout(2000);
	await page.screenshot({ path: './file.jpeg', fullPage: true, type: 'jpeg'});

	const emailInput = await page.$(selectors.EMAIL_INPUT);
	await emailInput?.type(process.env.VK_EMAIL!);
	const toPasswordButton = await page.$(selectors.TO_PASSWORD_BUTTON);
	toPasswordButton?.click();
	await page.waitForTimeout(2000);

	await page.screenshot({ path: './file.jpeg', fullPage: true, type: 'jpeg'});

	const passwordInput = await page.$(selectors.PASSWORD_INPUT);
	await passwordInput?.type(process.env.VK_PASSWORD!);
	await page.waitForTimeout(2000);
	await page.screenshot({ path: './file.jpeg', fullPage: true, type: 'jpeg'});
	const loginButton = await page.$(selectors.LOGIN_BUTTON);
	await loginButton?.click();
	await page.waitForTimeout(4000);
	await page.screenshot({ path: './file.jpeg', fullPage: true, type: 'jpeg'});
	console.log('Parser signed in');
	// if (await page.$(selectors.CHECK_ELEMENT)) {
	// 	console.log('Parser signed in');
	// 	return page;
	// } else {
	// 	throw new Error('Cannot sign in!')
	// }
}

export async function checkIfUserInGroup(
	page: Page,
	vkid: string,
	url: string,
) {
	await page.goto(url);
	await page.waitForTimeout(2000);
	const folowers = await page.$(selectors.FOLLOWERS);
	folowers?.click();
	await page.waitForTimeout(2000);
	const search = await page.$(selectors.SEARCH_ICON);
	if (!search) console.log('No search found');
	search?.click();
	await page.waitForTimeout(2000);
	const input = await page.$(selectors.SEARCH_INPUT);
	await input?.type(vkid);
	await page.keyboard.press('Enter');
	await page.waitForTimeout(2000);
	const user = await page.$$(selectors.USERS_IN_GROUP);
	if (user && user.length > 0) {
		return url;
	}
	return null;
}

export async function checkIfUserInGroups(
	page: Page,
	vkid: string,
	groups: string[],
) {
	const result: (string | null)[] = [];

	for (let i = 0; i < groups.length; i++) {
		result.push(await checkIfUserInGroup(page, vkid, groups[i]));
	}
	return result.filter((group: string | null) => group);
}

export async function getUsersGroup(
	page: Page,
	vkid: string,
): Promise<string[]> {
	const groups_list_eval = [];
	try {
		await page.goto(`https://vk.com/${vkid}`);
		await page.waitForTimeout(2000);

		const groups_counter_node = await page.$(selectors.USER_GROUPS);
		const groups_counter = await page.evaluate(
			(el) => el.textContent,
			groups_counter_node,
		);

		const groups = await page.$(selectors.GROUPS);
		if (!groups) {
			throw new Error('No groups here');
		}
		await groups?.click();
		await page.waitForTimeout(2000);
		const box = await page.$(selectors.GROUPS_BOX);
		await box!.click();

		await page.waitForTimeout(2000);

		let groupsList: ElementHandle<Element>[] = await page.$$(selectors.GROUPS_LINKS);
		if (!groupsList || groupsList.length < 1) {
			throw new Error('No groups');
		}

		while (groupsList.length < groups_counter) {
			await page.$eval(selectors.MORE_GROUPS, (e) => {
				e.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
					inline: 'end',
				});
			});
			groupsList = await page.$$(selectors.GROUPS_LINKS);
		}

		await page.waitForTimeout(2000);
		for (let i = 0; i < groupsList.length; i++) {
			if (!groupsList[i]) continue;
			const title = await page.evaluate(
				(el) => el.textContent,
				groupsList[i],
			);
			const href = await page.evaluate(
				(el) => el.getAttribute('href'),
				groupsList[i],
			);
			groups_list_eval.push(`https://vk.com${href}`);
		}
	} catch (err) {
		console.log(err);
	}
	return groups_list_eval;
}
