import { autoInjectable } from 'tsyringe';
import { Database } from '../../modules/database/database.connect';
import { OrderServiceReply } from './Order.interface';

@autoInjectable()
export class OrderService {
	constructor(private readonly database?: Database) {}

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
}
