import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../../entity/user/User.controller';

export class UserRouter {
	private readonly userController = container.resolve(UserController);
	private readonly router = Router();

	init() {
		this.router.post('/register', (req: Request, res: Response) =>
			this.userController.register(req, res),
		);
		this.router.post('/login', (req: Request, res: Response) =>
			this.userController.login(req, res),
		);
		this.router.delete('/:id', (req: Request, res: Response) =>
			this.userController.delete(req, res),
		);
		this.router.get('/', (req: Request, res: Response) =>
			this.userController.showUsers(req, res),
		);
		return this.router;
	}
}
