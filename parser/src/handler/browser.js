import { signIn } from "./handlers.js";
import puppeteer from 'puppeteer';

export const browser = await puppeteer.launch({
    args: [
        "--unhandled-rejections=strict",
        "--disable-notifications",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
    ],
    headless: true,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    slowMo: 50,
});

export const page = async () => await signIn(browser, process.env.VK_ID);