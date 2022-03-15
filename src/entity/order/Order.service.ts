import { autoInjectable } from 'tsyringe';
import { Database } from '../../modules/database/database.connect';
import { OrderServiceReply } from './Order.interface';

@autoInjectable()
export class OrderService {
	constructor(private readonly database?: Database) { }

	async addOrder(auth: string, vkid: string): Promise<OrderServiceReply> {
		const result = await this.database!.instance.query(
			`SELECT * FROM  add_to_queue(${Number(auth)}, '${vkid}') as status`,
		);

		return {
			status: true,
			data: result[0],
			error: null,
		};
	}

	async checkIntersection(auth: string, vkid: string, groups: string[]): Promise<OrderServiceReply> {
		const foundGroupsRow = await this.database!.instance.manyOrNone(
			`SELECT data FROM done where client_id = ${Number(auth)} and vkid = '${vkid}'`
		)

		const foundGroups: any[] = [];
		foundGroupsRow.forEach((data: any) => foundGroups.push(...data.groups))

		const result: any[] = []
		foundGroups.forEach((group: any) => groups.includes(group) ? result.push(group) : null);

		return {
			status: true,
			data: result,
			error: null,
		}
	}
}
