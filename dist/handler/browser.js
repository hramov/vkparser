"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserHandler = void 0;
const handlers_1 = require("./handlers");
const puppeteer_1 = __importDefault(require("puppeteer"));
class BrowserHandler {
    constructor() {
        this.options = {
            args: [
                '--unhandled-rejections=strict',
                '--disable-notifications',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox',
            ],
            headless: false,
            ignoreHTTPSErrors: true,
            slowMo: 50,
            ignoreDefaultArgs: ['--disable-extensions'],
        };
    }
    async init() {
        this.browser = await puppeteer_1.default.launch(this.options);
        this.page = await (0, handlers_1.signIn)(this.browser, process.env.VK_ID);
    }
    getPage() {
        return this.page;
    }
}
exports.BrowserHandler = BrowserHandler;
