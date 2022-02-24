import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../../entity/user/User.controller';

export class UserRouter {
	private readonly userController = container.resolve(UserController);
	private readonly router = Router();

	init() {
		this.router.post('/register', this.userController.register);
		this.router.post('/login', this.userController.login);
		this.router.delete('/:id', this.userController.delete);
		this.router.get('/', this.userController.showUsers);
		return this.router;
	}
}
