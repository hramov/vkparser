import puppeteer from 'puppeteer'
import express from 'express'
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const app = express();

    const browser = await puppeteer.launch({
        args: [
            "--unhandled-rejections=strict",
            "--disable-notifications",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ],
        headless: false,
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ["--disable-extensions"],
        slowMo: 50
    });

    const page = await signIn(browser, process.env.VK_ID);

    app.get('/:id', async (req, res) => {
        const id = req.params.id
        const result = await handler(page, id);
        res.json({
            count: result.length,
            data: result
        });
    })


    app.listen(5000, () => {
        console.log("Server started")
    });
}

async function signIn(browser, id) {
    const page = await browser.newPage();
    await page.setDefaultTimeout(10000);
    await page.goto(`https://vk.com/${id}`);
    await page.waitForTimeout(5000);

    const emailInput = await page.$('input#quick_email')
    await emailInput?.type(process.env.VK_EMAIL)

    await page.waitForTimeout(1000);
    const passwordInput = await page.$('input#quick_pass')
    await passwordInput?.type(process.env.VK_PASSWORD)

    await page.waitForTimeout(1000);
    const loginButton = await page.$('#quick_login_button')
    await loginButton?.click();
    await page.waitForTimeout(1000);
    return page;
}

async function handler(page, id) {
    const groups_list_eval = [];
    try {
        await page.goto(`https://vk.com/${id}`)
        await page.waitForTimeout(2000);


        const groups_counter_node = await page.$('#profile_idols > a > div > span.header_count.fl_l');
        const groups_counter = await page.evaluate((el) => el.textContent, groups_counter_node)

        const groups = await page.$('#profile_idols > a')
        if (!groups) {
            throw new Error("No groups here")
        }
        await groups?.click();
        await page.waitForTimeout(2000);
        const box = await page.$('#box_layer > div.popup_box_container > div > div.box_title_wrap.box_grey > div.box_title');
        await box.click();


        let groupsList = await page.$$('div > div.fans_idol_info > div.fans_idol_name > a');
        if (!groupsList && groupsList.length < 1) {
            throw new Error("No groups")
        }
        
        while (groupsList.length < groups_counter) {
            await page.$eval('#fans_more_linkidols', e => {
                e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
            });
            groupsList = await page.$$('div > div.fans_idol_info > div.fans_idol_name > a');
        }

        await page.waitForTimeout(2000);
        for (let i = 0; i < groupsList.length; i++) {
            if (!groupsList[i]) continue;
            const title = await page.evaluate((el) => el.textContent, groupsList[i])
            const href = await page.evaluate((el) => el.getAttribute('href'), groupsList[i])
            groups_list_eval.push({
                title: title, 
                href: `https://vk.com${href}`
            })
        }
    } catch (err) {
        console.log(err)
    }
    return groups_list_eval;
}

main();