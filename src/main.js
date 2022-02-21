import pgPromise from "pg-promise";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { hashPassword } from "./utils/utils.js";
dotenv.config();

async function main() {

    const db = pgPromise({})(
        `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );

    const app = express();
    app.use(cors);
    app.use(express.json());

    app.post('/', async (req, res) => {
        const auth = req.headers.authorization;
        if (!auth) {
            res.status(401).end("Unauthorized!");
            return;
        }
        const vkid = req.body.vkid;

        if (!vkid) {
            res.json({
                status: false,
                message: 'Data is empty'
            });
            return;
        }

        const result = await db.query(`SELECT * FROM  add_to_queue(${Number(auth)}, '${vkid}') as status`);
        if (result[0].status) {
            res.json({
                status: 'Added to queue'
            });
        } else {
            res.json({
                status: 'Some problems'
            });
        }
    });

    app.post('/register', async (req, res) => {
        if (!req.body.client || !req.body.client.email || !req.body.client.password) {
            res.json({
                status: false,
                message: 'Client data is undefined'
            });
        } else {
            const { email, password } = req.body.client;
            const candidate = await db.oneOrNone(`select * from client where email = '${email}'`);
            if (candidate) {
                res.json({
                    status: false,
                    message: 'User is already registered!'
                })
            } else {
                const id = await db.query(`insert into client (email, password) values ('${email}', '${await hashPassword(password)}') returning id`);
                if (id[0].id) {
                    res.json({
                        status: true,
                        message: 'User successfully registered!'
                    })
                } else {
                    res.json({
                        status: false,
                        message: 'Some problems'
                    })
                }
            }
        }
    });

    app.post('/login', async (req, res) => {
        if (!req.body.client || !req.body.client.email || !req.body.client.password) {
            res.json({
                status: false,
                message: 'Client data is undefined'
            });
        } else {
            const { email, password } = req.body.client;
            const candidate = await db.oneOrNone(`select id from client where email = '${email}' and password='${await hashPassword(password)}'`);
            if (candidate) {
                res.status(200).json({
                    id: candidate.id,
                    token: ''
                });
            } else {
                res.status(401).json({
                    status: false,
                    message: 'Unauthorized'
                });
            }
        }
    });

    app.get('/users', async (req, res) => {
        const users = await db.manyOrNone('select * from client');
        res.status(200).json(users);
    });

    app.delete('/users/:id', async (req, res) => {
        const id = Number(req.params.id);
        const deleted = await db.oneOrNone(`delete from client where id = ${id}`);
        res.status(200).json(deleted);
    });

    app.get('/data', async (req, res) => {
        const data = await db.manyOrNone('select * from done');
        res.status(200).json(data);
    });

    app.get('/orders', async (req, res) => {
        const orders = await db.manyOrNone('select * from orders');
        res.status(200).json(orders);
    });

    app.get('/queue', async (req, res) => {
        const queue = await db.manyOrNone('select * from queue');
        res.status(200).json(queue);
    });

    app.get('/', async (req, res) => {
        const client_id = req.headers.authorization;
        if (!client_id) res.status(401).end("Unauthorized!");
        else {
            const data = await db.manyOrNone(`SELECT data FROM done WHERE client_id = ${Number(client_id)}`);
            res.status(200).json(data);
        }
    });

    app.listen(5000, () => {
        console.log("Server started")
    });
}

main();