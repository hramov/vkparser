import { signIn } from './handlers';
import puppeteer from 'puppeteer';

export class BrowserHandler {
	private readonly options: any = {
		args: [
			'--unhandled-rejections=strict',
			'--disable-notifications',
			'--disable-gpu',
			'--disable-dev-shm-usage',
			'--disable-setuid-sandbox',
			'--no-sandbox',
		],
		headless: true,
		ignoreHTTPSErrors: true,
		ignoreDefaultArgs: ['--disable-extensions'],
	};

	private browser: puppeteer.Browser;
	private page: puppeteer.Page;

	async init() {
		this.browser = await puppeteer.launch(this.options);
		this.page = await signIn(this.browser, process.env.VK_ID!);
	}

	getPage() {
		return this.page;
	}
}
