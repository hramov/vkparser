import { autoInjectable, inject, injectable } from 'tsyringe';
import { Database } from '../../modules/database/database.connect';
import { UserServiceReply } from './User.interface';
import { compare, genSalt, hash } from 'bcrypt';
import { UserDto } from './User.dto';
import { validateSync } from 'class-validator';

@autoInjectable()
export class UserService {
	constructor(private readonly database: Database) {}

	public async showUsers() {
		return this.database.instance.manyOrNone('SELECT * FROM CLIENT');
	}

	async register(user: UserDto): Promise<UserServiceReply> {
		const errors = validateSync(user);
		if (errors.length) {
			return {
				status: false,
				data: null,
				error: errors,
			};
		}
		const candidate = await this.database.instance.oneOrNone(
			`select * from client where email = '${user.email}'`,
		);
		if (candidate) {
			return {
				status: false,
				data: null,
				error: new Error('User is already registered!'),
			};
		} else {
			const id = await this.database.instance.query(
				`insert into client (email, password) values ('${
					user.email
				}', '${await hash(
					user.password,
					await genSalt(10),
				)}') returning id`,
			);
			if (id[0].id) {
				return {
					status: true,
					data: id[0].id,
					error: null,
				};
			} else {
				return {
					status: false,
					data: null,
					error: new Error('Some problems'),
				};
			}
		}
	}

	async login(user: UserDto): Promise<UserServiceReply> {
		const errors = validateSync(user);
		if (errors.length) {
			return {
				status: false,
				data: null,
				error: errors,
			};
		}
		const candidate = await this.database.instance.oneOrNone(
			`select id, password from client where email = '${user.email}'`,
		);
		const validPassword = await compare(user.password, candidate.password);
		if (validPassword) {
			return {
				status: true,
				data: candidate.id,
				error: null,
			};
		}
		return {
			status: false,
			data: null,
			error: new Error('Unauthorized'),
		};
	}
}
