import { Request, Response, Router } from 'express';
import { OrderController } from '../../entity/order/Order.controller';

export class OrderRouter {
	private readonly orderController: OrderController;
	private readonly router: Router;
	constructor() {
		this.orderController = new OrderController();
		this.router = Router();
	}

	init() {
		this.router.post(
			'/',
			async (req: Request, res: Response) =>
				await this.orderController.addOrder(req, res),
		);
		this.router.post(
			'/check',
			async (req: Request, res: Response) =>
				await this.orderController.checkIsDone(req, res),
		);
		this.router.get(
			'/clear',
			async (req: Request, res: Response) =>
				await this.orderController.clear(req, res),
		);
		return this.router;
	}
}
