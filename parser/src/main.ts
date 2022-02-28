import 'reflect-metadata';
import { handler } from './handler/handlers';
import dotenv from 'dotenv';
import { ResultDto } from './dto/result.dto';
import { Browser, Page } from 'puppeteer';
dotenv.config();
import { BrowserHandler } from './handler/browser';
import { Database } from './modules/database';
import { autoInjectable, container } from 'tsyringe';

@autoInjectable()
export class Parser {
	private page: Page;
	private readonly browser: Browser;

	constructor(private readonly database: Database) {}
	async init() {
		console.log('Start init');
		const browser = new BrowserHandler();
		await browser.init();
		this.page = browser.getPage();
		console.log('Init page');
	}

	private async storeGroups(groups: ResultDto[]) {
		for (let i = 0; i < groups.length; i++) {
			try {
				await this.database.instance.query(
					`insert into groups (title, href) values ('${groups[i].title}', '${groups[i].href}') on conflict do nothing`,
				);
			} catch (err) {
				console.log(`Group ${groups[i].title} is already in the list`);
			}
		}
	}

	private async proceedGroups(data: any, taken: string, groups: ResultDto[]) {
		try {
			await this.database.instance.query(
				`SELECT * FROM add_to_done(${
					data.order_id
				}, '${taken}', '${JSON.stringify({
					groups: groups,
				})}')`,
			);

			await this.storeGroups(groups);
		} catch (_err) {
			const err = _err as Error;
			console.log(err.message);
			await this.database.instance.query(
				`update queue set taken = false where id = ${data.id}`,
			);
		}
	}

	private async getGroups(id: string, vkid: string) {
		let groups: ResultDto[];
		try {
			groups = await handler(this.page, vkid);
		} catch (_err) {
			const err = _err as Error;
			console.log(err.message);
			await this.database.instance.query(
				`update queue set taken = false where id = ${id}`,
			);
		}
	}

	async proceed() {
		let isGo = true;
		setInterval(async () => {
			if (isGo) {
				isGo = false;
				const data = await this.database.instance.oneOrNone(
					'select * from queue where taken = false limit 1',
				);
				if (data && data.id) {
					const taken = new Date().toLocaleString(undefined, {
						timeZone: 'Europe/London',
					});
					await this.database.instance.query(
						`update queue set taken = true where id = ${data.id}`,
					);
					let groups: ResultDto[] = [];
					await this.getGroups(data.id, data.vkid);
					if (groups.length > 0) {
						this.proceedGroups(data, taken, groups);
					}
				}
				isGo = true;
			}
		}, 5000);
	}
}

const parser = container.resolve(Parser);
parser.init();
parser.proceed();
