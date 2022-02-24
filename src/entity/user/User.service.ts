import { inject, injectable } from 'tsyringe';
import { Database } from '../../modules/database/database.connect';

@injectable()
export class UserService {
	constructor(@inject('Database') private readonly database?: Database) {}

	async showUsers() {
		return this.database?.instance.manyOrNone('SELECT * FROM CLIENT');
	}
}
