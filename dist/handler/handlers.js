"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersGroup = exports.checkIfUserInGroups = exports.checkIfUserInGroup = exports.signIn = void 0;
const selector_1 = require("./selector");
async function signIn(browser, id) {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.goto(`https://vk.com/${id}`);
    await page.waitForTimeout(2000);
    const signInButton = await page.$(selector_1.selectors.SIGNIN_BUTTON);
    await (signInButton === null || signInButton === void 0 ? void 0 : signInButton.click());
    await page.waitForTimeout(2000);
    const emailInput = await page.$(selector_1.selectors.EMAIL_INPUT);
    await (emailInput === null || emailInput === void 0 ? void 0 : emailInput.type(process.env.VK_EMAIL));
    const toPasswordButton = await page.$(selector_1.selectors.TO_PASSWORD_BUTTON);
    toPasswordButton === null || toPasswordButton === void 0 ? void 0 : toPasswordButton.click();
    await page.waitForTimeout(2000);
    const passwordInput = await page.$(selector_1.selectors.PASSWORD_INPUT);
    await (passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.type(process.env.VK_PASSWORD));
    await page.waitForTimeout(2000);
    const loginButton = await page.$(selector_1.selectors.LOGIN_BUTTON);
    await (loginButton === null || loginButton === void 0 ? void 0 : loginButton.click());
    await page.waitForTimeout(2000);
    if (await page.$(selector_1.selectors.CHECK_ELEMENT)) {
        console.log('Parser signed in');
        return page;
    }
    else {
        throw new Error('Cannot sign in!');
    }
}
exports.signIn = signIn;
async function checkIfUserInGroup(page, vkid, url) {
    await page.goto(url);
    await page.waitForTimeout(2000);
    const folowers = await page.$(selector_1.selectors.FOLLOWERS);
    folowers === null || folowers === void 0 ? void 0 : folowers.click();
    await page.waitForTimeout(2000);
    const search = await page.$(selector_1.selectors.SEARCH_ICON);
    if (!search)
        console.log('No search found');
    search === null || search === void 0 ? void 0 : search.click();
    await page.waitForTimeout(2000);
    const input = await page.$(selector_1.selectors.SEARCH_INPUT);
    await (input === null || input === void 0 ? void 0 : input.type(vkid));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    const user = await page.$$(selector_1.selectors.USERS_IN_GROUP);
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
        const groups_counter_node = await page.$(selector_1.selectors.USER_GROUPS);
        const groups_counter = await page.evaluate((el) => el.textContent, groups_counter_node);
        const groups = await page.$(selector_1.selectors.GROUPS);
        if (!groups) {
            throw new Error('No groups here');
        }
        await (groups === null || groups === void 0 ? void 0 : groups.click());
        await page.waitForTimeout(2000);
        const box = await page.$(selector_1.selectors.GROUPS_BOX);
        await box.click();
        await page.waitForTimeout(2000);
        let groupsList = await page.$$(selector_1.selectors.GROUPS_LINKS);
        if (!groupsList || groupsList.length < 1) {
            throw new Error('No groups');
        }
        while (groupsList.length < groups_counter) {
            await page.$eval(selector_1.selectors.MORE_GROUPS, (e) => {
                e.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'end',
                });
            });
            groupsList = await page.$$(selector_1.selectors.GROUPS_LINKS);
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
