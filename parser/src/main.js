import pgPromise from 'pg-promise';
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
            const data = await db.oneOrNone('select * from queue where taken = false limit 1');
            if (data && data.id) {
                const taken = new Date().toLocaleString(undefined, {
                    timeZone: 'Europe/London'
                });
                await db.query(`update queue set taken = true where id = ${data.id}`);
                const groups = await handler(p, data.vkid);
                if (groups) {
                    await db.query(`SELECT * FROM add_to_done(${data.order_id}, '${taken}', '${JSON.stringify({
                        groups: groups
                    })}')`);
                }
            }
            isGo = true;
        }
    }, 5000);
}