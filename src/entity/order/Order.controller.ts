import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { OrderService } from './Order.service';

@autoInjectable()
export class OrderController {
	constructor(private readonly orderService?: OrderService) {}

	async checkIsDone(req: Request, res: Response): Promise<any> {
		const result = await this.orderService!.getResultsForOrder(
			req.body.order_id,
		);
		if (result && result.id) {
			res.status(200).json(result);
		}
		return res.status(200).end(null);
	}

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
		let groups = req.body.groups;
		if (!groups) groups = [];
		const result = await this.orderService!.addOrder(auth, vkid, groups);
		if (result.error) res.status(500).json(result);
		res.status(200).json({
			status: result.status,
			error: result.error,
			order_id: result.data.status,
		});
	}

	async checkGroups(req: Request, res: Response) {
		const auth = req.headers.authorization;
		if (!auth) {
			res.status(401).end('Unauthorized!');
			return;
		}
		const vkid = req.body.vkid;
		const groups = req.body.groups;

		if (!vkid) {
			res.json({
				status: false,
				message: 'VK id is empty',
			});
			return;
		}

		if (!groups.length) {
			res.json({
				status: false,
				message: 'Groups is empty',
			});
			return;
		}

		const result = await this.orderService!.checkIntersection(
			auth,
			vkid,
			groups,
		);
		res.json({
			status: result.status,
			data: result.data,
		});
	}

	async clear(req: Request, res: Response) {
		const result = await this.orderService!.clear();
		res.json({
			status: true,
		});
	}
}
