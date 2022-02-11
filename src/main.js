import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import pgPromise from "pg-promise";

async function main() {
    const db = pgPromise({})(
        `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    const app = express();
    app.use(express.json());

    app.get('/:person_id', async (req, res) => {
        // const auth = req.headers.authorization;
        // const client_id = auth.id;
        const client_id = 1;
        const vkid = req.params.person_id;
        if (vkid == 'favicon.ico') return;
        const result = await db.query(`SELECT * FROM  add_to_queue(${client_id}, '${vkid}') as STATUS`);
        if (result.status) {
            res.json({
                status: 'Added to queue'
            });
        } else {
            res.json({
                status: 'Some problems'
            });
        }
    });

    app.get('/', async (req, res) => {
        // const client_id = req.headers.authorization.id;
        const client_id = 1;
        const data = await db.manyOrNone(`SELECT * FROM done WHERE client_id = ${client_id}`);
        res.status(200).json(data);
    });


    app.listen(5000, () => {
        console.log("Server started")
    });
}

main();