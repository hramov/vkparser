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
    const isGo = true;
    setInterval(() => {
        if (isGo) {
            isGo = false;
            const data = await db.oneOrNone('select * from queue limit 1');
            if (data) {
                const groups = await handler(p, data.vkid);
                if (groups) {
                    await axios.post('http://localhost:5000', {
                        vkid: data.vkid,
                        data: groups,
                    })
                }
            }
            isGo = true;
        }
    }, 10000)
}