import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApiRouter } from './modules/router/api';
dotenv.config();

async function main() {
	const app = express();

	app.use(express.json());
	app.use(
		cors({
			origin: '*',
		}),
	);

	app.use('/api', new ApiRouter().init());

	app.listen(5000, () => {
		console.log('Server started');
	});
}

main();
