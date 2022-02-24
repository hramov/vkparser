import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { OrderService } from './Order.service';

@autoInjectable()
export class OrderController {
	constructor(private readonly orderService?: OrderService) {}

	async addOrder(req: Request, res: Response) {
		const auth = req.headers.authorization;
		if (!auth) {
			res.status(401).end('Unauthorized!');
			return;
		}
		const vkid = req.body.vkid;
		if (!vkid) {
			res.json({
				status: false,
				message: 'Data is empty',
			});
			return;
		}
		const result = await this.orderService!.addOrder(auth, vkid);
		if (result.status) {
			res.json({
				status: 'Added to queue',
			});
		} else {
			res.json({
				status: 'Some problems',
			});
		}
	}
}
