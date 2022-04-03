import 'reflect-metadata';
import { checkIfUserInGroups, getUsersGroup } from './handler/handlers';
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
		const browser = new BrowserHandler();
		await browser.init();
		this.page = browser.getPage();
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

	private async proceedGroups(data: any, taken: Date, groups: string[], error: Error | null) {
		console.log('Storing results: ', groups);
		try {
			const done_id = await this.database.instance.query(
				`SELECT * FROM add_to_done(${
					data.order_id
				}, ${taken.toISOString()}, '${JSON.stringify({
					groups: groups,
				})}')`,
			);

			await this.database.instance.query(`
				UPDATE done SET error = '${error?.message}' WHERE id = '${done_id[0].add_to_done}'
			`);
			
			const stored = await this.database.instance.oneOrNone(
				`SELECT * FROM done WHERE order_id = ${data.order_id}`,
			);
			console.table({
				id: stored.id,
				vkid: stored.vkid,
				client_id: stored.client_id,
				order_id: stored.order_id,
				data: stored.data.groups,
			});
			if (stored.order_id != data.order_id) {
				console.log('Order ids are incompatible');
			}
			console.log(
				'Complete ' +
					stored.vkid +
					' Found ' +
					stored.data.groups.length +
					' groups',
			);
		} catch (_err) {
			const err = _err as Error;
			console.log(err.message);
		}
	}

	private async getGroups(id: string, vkid: string) {
		let groups: string[] | Error = [];
		try {
			groups = await getUsersGroup(this.page, vkid);
			if (groups instanceof Error) {
				throw groups;
			}
		} catch (_err) {
			const err = _err as Error;
			console.log(err.message);
		}
		return groups;
	}

	private async getUserInGroups(id: string, vkid: string, groups: string[]) {
		let result: (string | null)[] | Error = [];
		try {
			result = await checkIfUserInGroups(this.page, vkid, groups);
			if (result instanceof Error) {
				throw result;
			}
		} catch (_err) {
			const err = _err as Error;
			console.log(err.message);
		}
		return result;
	}

	async proceed() {
		let isGo = true;
		setInterval(async () => {
			if (isGo) {
				isGo = false;
				if (this.page) {
					const data = await this.database.instance.oneOrNone(
						'select * from queue where taken = false limit 1',
					);
					if (data && data.id) {
						console.log(`Start parsing ${data.vkid}`);
						const taken = new Date();
						await this.database.instance.query(
							`update queue set taken = true where id = ${data.id}`,
						);

						const groups = await this.getGroups(data.id, data.vkid);

						if (groups instanceof Error) {
							await this.proceedGroups(data, taken, [], groups);
						} else {
							const intersection = data.groups.filter((group: string) => groups.includes(group));
							if (intersection.length != data.groups.length) {
								const userInGroups = await this.getUserInGroups(
									data.id,
									data.vkid,
									data.groups,
								);
								if (userInGroups instanceof Error) {
									await this.proceedGroups(data, taken, [], userInGroups);
								} else {
									const result = groups.filter((group: string) =>
										userInGroups.includes(group),
									);	
									await this.proceedGroups(data, taken, result, null);
								}
							} else {
								await this.proceedGroups(data, taken, intersection, null);
							}
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
