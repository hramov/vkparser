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
		this.router.post('/', (req: Request, res: Response) => this.orderController.addOrder(req, res));
		return this.router;
	}
}
