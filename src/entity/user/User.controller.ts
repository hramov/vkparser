import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { UserService } from './User.service';

export class UserController {
	constructor(
		@inject('UserService') private readonly userService?: UserService,
	) {}

	async showUsers(req: Request, res: Response) {
		const result = this.userService?.showUsers();
		res.json(result);
	}

	async register(req: Request, res: Response) {
		if (
			!req.body.client ||
			!req.body.client.email ||
			!req.body.client.password
		) {
			res.json({
				status: false,
				message: 'Client data is undefined',
			});
		} else {
			const { email, password } = req.body.client;

			// const candidate = await db.oneOrNone(`select * from client where email = '${email}'`);
			// if (candidate) {
			//     res.json({
			//         status: false,
			//         message: 'User is already registered!'
			//     })
			// } else {
			//     const salt = await genSalt(10);
			//     const hPassword = await hash(password, salt);
			//     const id = await db.query(`insert into client (email, password) values ('${email}', '${hPassword}') returning id`);
			//     if (id[0].id) {
			//         res.json({
			//             status: true,
			//             message: 'User successfully registered!'
			//         })
			//     } else {
			//         res.json({
			//             status: false,
			//             message: 'Some problems'
			//         })
			//     }
			// }
		}
	}

	async login(req: Request, res: Response) {
		if (
			!req.body.client ||
			!req.body.client.email ||
			!req.body.client.password
		) {
			res.json({
				status: false,
				message: 'Client data is undefined',
			});
		} else {
			const { email, password } = req.body.client;
			// const candidate = await db.oneOrNone(
			// 	`select id, password from client where email = '${email}'`,
			// );
			// const validPassword = await compare(password, candidate.password);
			// if (validPassword) {
			// 	res.status(200).json({
			// 		id: candidate.id,
			// 		token: '',
			// 	});
			// } else {
			// 	res.status(401).json({
			// 		status: false,
			// 		message: 'Unauthorized',
			// 	});
			// }
		}
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
