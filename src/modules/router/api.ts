import { Router } from 'express';
import { OrderRouter } from './Order.router';
import { UserRouter } from './User.router';

export class ApiRouter {
	protected readonly router: Router;
	constructor() {
		this.router = Router();
	}

	init() {
		this.router.use('/user', new UserRouter().init());
		this.router.use('/order', new OrderRouter().init());
		return this.router;
	}
}
