import pgPromise from 'pg-promise';
import axios from 'axios';
import { page } from './handler/browser.js';
import { handler } from './handler/handlers.js';
import dotenv from 'dotenv';
dotenv.config();

export const db = pgPromise({})(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);
const p = await page();
await proceed();

async function proceed() {
    let isGo = true;
    setInterval(async () => {
        if (isGo) {
            isGo = false;
            const data = await db.oneOrNone('select * from queue limit 1');
            if (data) {
                const groups = await handler(p, data.vkid);
                if (groups) {
                    console.log(groups);
                    console.log(JSON.stringify(groups));
                    const client_id = await db.oneOrNone(`select client_id from orders where parse_id = (select id from parse where vkid = '${data.vkid}')`);
                    console.log(client_id);
                    await db.query(`SELECT * FROM add_to_done(${client_id.client_id}, '${JSON.stringify({
                        groups: groups
                    })}')`);
                }
            }
            isGo = true;
        }
    }, 10000)
}