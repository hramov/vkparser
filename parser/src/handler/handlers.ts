import { Browser, ElementHandle, Page } from 'puppeteer';

export async function signIn(browser: Browser, id: string) {
	const page = await browser.newPage();
	page.setDefaultTimeout(10000);
	await page.goto(`https://vk.com/${id}`);
	await page.waitForTimeout(2000);
	const emailInput = await page.$('input#quick_email');
	await emailInput?.type(process.env.VK_EMAIL!);

	await page.waitForTimeout(1000);
	const passwordInput = await page.$('input#quick_pass');
	await passwordInput?.type(process.env.VK_PASSWORD!);

	await page.waitForTimeout(1000);
	const loginButton = await page.$('#quick_login_button');
	await loginButton?.click();
	await page.waitForTimeout(1000);
	console.log('Parser signed in');
	return page;
}

export async function checkIfUserInGroup(
	page: Page,
	vkid: string,
	url: string,
) {
	await page.goto(url);
	await page.waitForTimeout(2000);
	const folowers = await page.$(
		'#public_followers > a > div > span.header_label.fl_l',
	);
	folowers?.click();
	await page.waitForTimeout(2000);
	const search = await page.$('div > h2 > ul > a');
	if (!search) console.log('No search found');
	search?.click();
	await page.waitForTimeout(2000);
	const input = await page.$('#search_query');
	await input?.type(vkid);
	await page.keyboard.press('Enter');
	await page.waitForTimeout(2000);
	const user = await page.$$('#results > div');
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

	console.log(groups);
	for (let i = 0; i < groups.length; i++) {
		console.log(groups[i]);
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

		const groups_counter_node = await page.$(
			'#profile_idols > a > div > span.header_count.fl_l',
		);
		const groups_counter = await page.evaluate(
			(el) => el.textContent,
			groups_counter_node,
		);

		const groups = await page.$('#profile_idols > a');
		if (!groups) {
			throw new Error('No groups here');
		}
		await groups?.click();
		await page.waitForTimeout(2000);
		const box = await page.$(
			'#box_layer > div.popup_box_container > div > div.box_title_wrap.box_grey > div.box_title',
		);
		await box!.click();

		await page.waitForTimeout(2000);

		let groupsList: ElementHandle<Element>[] = await page.$$(
			'#fans_rowsidols > div > div.fans_idol_info > div.fans_idol_name > a',
		);
		if (!groupsList || groupsList.length < 1) {
			throw new Error('No groups');
		}

		while (groupsList.length < groups_counter) {
			await page.$eval('#fans_more_linkidols', (e) => {
				e.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
					inline: 'end',
				});
			});
			groupsList = await page.$$(
				'div > div.fans_idol_info > div.fans_idol_name > a',
			);
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
	console.log(
		'Complete ' + vkid + ' Found ' + groups_list_eval.length + ' groups',
	);
	return groups_list_eval;
}
