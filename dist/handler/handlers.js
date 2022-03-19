"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersGroup = exports.checkIfUserInGroups = exports.checkIfUserInGroup = exports.signIn = void 0;
async function signIn(browser, id) {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.goto(`https://vk.com/${id}`);
    await page.waitForTimeout(2000);
    const emailInput = await page.$('input#quick_email');
    await (emailInput === null || emailInput === void 0 ? void 0 : emailInput.type(process.env.VK_EMAIL));
    await page.waitForTimeout(1000);
    const passwordInput = await page.$('input#quick_pass');
    await (passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.type(process.env.VK_PASSWORD));
    await page.waitForTimeout(1000);
    const loginButton = await page.$('#quick_login_button');
    await (loginButton === null || loginButton === void 0 ? void 0 : loginButton.click());
    await page.waitForTimeout(1000);
    console.log('Parser signed in');
    return page;
}
exports.signIn = signIn;
async function checkIfUserInGroup(page, vkid, url) {
    await page.goto(url);
    await page.waitForTimeout(2000);
    const folowers = await page.$('#public_followers > a > div > span.header_label.fl_l');
    folowers === null || folowers === void 0 ? void 0 : folowers.click();
    await page.waitForTimeout(2000);
    const search = await page.$('div > h2 > ul > a');
    if (!search)
        console.log('No search found');
    search === null || search === void 0 ? void 0 : search.click();
    await page.waitForTimeout(2000);
    const input = await page.$('#search_query');
    await (input === null || input === void 0 ? void 0 : input.type(vkid));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    const user = await page.$$('#results > div');
    if (user && user.length > 0) {
        return url;
    }
    return null;
}
exports.checkIfUserInGroup = checkIfUserInGroup;
async function checkIfUserInGroups(page, vkid, groups) {
    const result = [];
    for (let i = 0; i < groups.length; i++) {
        result.push(await checkIfUserInGroup(page, vkid, groups[i]));
    }
    return result.filter((group) => group);
}
exports.checkIfUserInGroups = checkIfUserInGroups;
async function getUsersGroup(page, vkid) {
    const groups_list_eval = [];
    try {
        await page.goto(`https://vk.com/${vkid}`);
        await page.waitForTimeout(2000);
        const groups_counter_node = await page.$('#profile_idols > a > div > span.header_count.fl_l');
        const groups_counter = await page.evaluate((el) => el.textContent, groups_counter_node);
        const groups = await page.$('#profile_idols > a');
        if (!groups) {
            throw new Error('No groups here');
        }
        await (groups === null || groups === void 0 ? void 0 : groups.click());
        await page.waitForTimeout(2000);
        const box = await page.$('#box_layer > div.popup_box_container > div > div.box_title_wrap.box_grey > div.box_title');
        await box.click();
        await page.waitForTimeout(2000);
        let groupsList = await page.$$('#fans_rowsidols > div > div.fans_idol_info > div.fans_idol_name > a');
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
            groupsList = await page.$$('div > div.fans_idol_info > div.fans_idol_name > a');
        }
        await page.waitForTimeout(2000);
        for (let i = 0; i < groupsList.length; i++) {
            if (!groupsList[i])
                continue;
            const title = await page.evaluate((el) => el.textContent, groupsList[i]);
            const href = await page.evaluate((el) => el.getAttribute('href'), groupsList[i]);
            groups_list_eval.push(`https://vk.com${href}`);
        }
    }
    catch (err) {
        console.log(err);
    }
    return groups_list_eval;
}
exports.getUsersGroup = getUsersGroup;
