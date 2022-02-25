import { handler } from './handler/handlers.js';
import dotenv from 'dotenv';
import { ResultDto } from './dto/result.dto.js';
import { Browser, Page } from 'puppeteer';
dotenv.config();
import { BrowserHandler } from './handler/browser';
import { Database } from './modules/database/index.js';
import { autoInjectable, container } from 'tsyringe';

@autoInjectable()
export class Parser {
	private page: Page;
	private readonly browser: Browser;

	constructor(private readonly database: Database) {}
	async init() {
		const browser = new BrowserHandler();
		this.page = browser.getPage();
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
					try {
						groups = await handler(this.page, data.vkid);
					} catch (_err) {
						const err = _err as Error;
						console.log(err.message);
						await this.database.instance.query(
							`update queue set taken = false where id = ${data.id}`,
						);
					}
					if (groups.length > 0) {
						try {
							await this.database.instance.query(
								`SELECT * FROM add_to_done(${
									data.order_id
								}, '${taken}', '${JSON.stringify({
									groups: groups,
								})}')`,
							);

							for (let i = 0; i < groups.length; i++) {
								try {
									await this.database.instance.query(
										`insert into groups (title, href) values ('${groups[i].title}', '${groups[i].href}') on conflict do nothing`,
									);
								} catch (err) {
									console.log(
										`Group ${groups[i].title} is already in the list`,
									);
								}
							}
						} catch (_err) {
							const err = _err as Error;
							console.log(err.message);
							await this.database.instance.query(
								`update queue set taken = false where id = ${data.id}`,
							);
						}
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
