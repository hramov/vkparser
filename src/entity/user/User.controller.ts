import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { UserServiceReply } from './User.interface';
import { UserService } from './User.service';
import { RegisterValidation } from './User.validation';

@autoInjectable()
export class UserController {
	constructor(private readonly userService: UserService) {}

	public async showUsers(req: Request, res: Response) {
		const result = this.userService.showUsers();
		res.json(result);
	}

	async register(req: Request, res: Response) {
		let result: UserServiceReply;
		if (RegisterValidation(req.body.client)) {
			const { email, password } = req.body.client;
			result = await this.userService.register(email, password);
		} else {
			result = {
				status: false,
				data: null,
				error: new Error('Data is incorrect'),
			};
		}
		res.json(result);
	}

	async login(req: Request, res: Response) {
		let result: UserServiceReply;
		if (RegisterValidation(req.body.client)) {
			const { email, password } = req.body.client;
			result = await this.userService.login(email, password);
		} else {
			result = {
				status: false,
				data: null,
				error: new Error('Data is incorrect'),
			};
		}
		res.json(result);
	}

	async delete(req: Request, res: Response) {
		// 	const id = Number(req.params.id);
		// 	const deleted = await db.oneOrNone(
		// 		`delete from client where id = ${id}`,
		// 	);
		// 	res.status(200).json(deleted);
	}

	async results(req: Request, res: Response) {
		// app.get('/', async (req, res) => {
		// 	const client_id = req.headers.authorization;
		// 	if (!client_id) res.status(401).end('Unauthorized!');
		// 	else {
		// 		const data = await db.manyOrNone(
		// 			`SELECT data FROM done WHERE client_id = ${Number(client_id)}`,
		// 		);
		// 		res.status(200).json(data);
		// 	}
		// });
	}
}
