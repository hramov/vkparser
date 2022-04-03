import { Browser, ElementHandle, Page } from 'puppeteer';
import { selectors } from './selector';

export async function signIn(browser: Browser, id: string) {
	try {
		const page = await browser.newPage();
		// page.setDefaultTimeout(15000);

		await page.goto(`https://vk.com/${id}`);
		await page.waitForTimeout(2000);
		const signInButton = await page.$(selectors.SIGNIN_BUTTON);
		await signInButton?.click();
		await page.waitForTimeout(2000);

		const emailInput = await page.$(selectors.EMAIL_INPUT);
		await emailInput?.type(process.env.VK_EMAIL!);
		console.log('Input email');
		const toPasswordButton = await page.$(selectors.TO_PASSWORD_BUTTON);
		toPasswordButton?.click();
		await page.waitForTimeout(2000);

		const passwordInput = await page.$(selectors.PASSWORD_INPUT);
		await passwordInput?.type(process.env.VK_PASSWORD!);
		console.log('Input password');
		await page.waitForTimeout(2000);
		const loginButton = await page.$(selectors.LOGIN_BUTTON);
		if (loginButton) {
			console.log("Logged in")
		}
		await loginButton?.click();
		await page.waitForTimeout(2000);
		console.log('Parser signed in');
		return page;
	} catch(err) {
		console.log(err);
		return null;
	}
}

export async function checkIfUserInGroup(
	page: Page,
	vkid: string,
	url: string,
) {
	try {
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
	} catch (err) {
		return new Error(err as string);
	}
	return null;
}

export async function checkIfUserInGroups(
	page: Page,
	vkid: string,
	groups: string[],
) {
	const result: (string | null)[] = [];
	try {
		for (let i = 0; i < groups.length; i++) {
			const res = await checkIfUserInGroup(page, vkid, groups[i]);
			if (res instanceof Error) {
				throw res;
			} else {
				result.push(res);
			}
		}
		return result.filter((group: string | null) => group);
	} catch (err) {
		return new Error(err as string);
	}
}

export async function getUsersGroup(
	page: Page,
	vkid: string,
): Promise<string[] | Error> {
	const groups_list_eval = [];
	try {
		await page.goto(`https://vk.com/${vkid}`);
		await page.waitForTimeout(2000);

		const groups = await page.$(selectors.GROUPS);
		if (!groups) {
			throw new Error('No groups here');
		}
		await groups?.click();
		await page.waitForTimeout(2000);
		const box = await page.$(selectors.GROUPS_BOX);
		await box!.click();

		await page.waitForTimeout(2000);

		const groups_counter_node = await page.$(selectors.USER_GROUPS);
		const groups_counter = await page.evaluate(
			(el) => el.textContent,
			groups_counter_node,
		);

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
			console.log(groupsList.length, groups_counter)
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
		return new Error(err as string);
	}
	return groups_list_eval;
}
