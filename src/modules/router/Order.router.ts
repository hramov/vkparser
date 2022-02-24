import { Router } from 'express';
import { OrderController } from '../../entity/order/Order.controller';

export class OrderRouter {
	private readonly orderController: OrderController;
	private readonly router: Router;
	constructor() {
		this.orderController = new OrderController();
		this.router = Router();
	}

	init() {
		this.router.post('/', this.orderController.addOrder);
		return this.router;
	}
}
