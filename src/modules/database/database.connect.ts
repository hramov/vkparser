import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export class Database {
	public instance: pgPromise.IDatabase<{}, pg.IClient>;

	constructor() {
		this.instance = pgPromise({})(
			`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
		);
	}
}
