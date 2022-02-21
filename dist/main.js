"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = require("bcrypt");
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = (0, pg_promise_1.default)({})(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({
            origin: '*'
        }));
        app.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            const result = yield db.query(`SELECT * FROM  add_to_queue(${Number(auth)}, '${vkid}') as status`);
            if (result[0].status) {
                res.json({
                    status: 'Added to queue'
                });
            }
            else {
                res.json({
                    status: 'Some problems'
                });
            }
        }));
        app.post('/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.client || !req.body.client.email || !req.body.client.password) {
                res.json({
                    status: false,
                    message: 'Client data is undefined'
                });
            }
            else {
                const { email, password } = req.body.client;
                const candidate = yield db.oneOrNone(`select * from client where email = '${email}'`);
                if (candidate) {
                    res.json({
                        status: false,
                        message: 'User is already registered!'
                    });
                }
                else {
                    const salt = yield (0, bcrypt_1.genSalt)(10);
                    const hPassword = yield (0, bcrypt_1.hash)(password, salt);
                    const id = yield db.query(`insert into client (email, password) values ('${email}', '${hPassword}') returning id`);
                    if (id[0].id) {
                        res.json({
                            status: true,
                            message: 'User successfully registered!'
                        });
                    }
                    else {
                        res.json({
                            status: false,
                            message: 'Some problems'
                        });
                    }
                }
            }
        }));
        app.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.client || !req.body.client.email || !req.body.client.password) {
                res.json({
                    status: false,
                    message: 'Client data is undefined'
                });
            }
            else {
                const { email, password } = req.body.client;
                const candidate = yield db.oneOrNone(`select id, password from client where email = '${email}'`);
                const validPassword = yield (0, bcrypt_1.compare)(password, candidate.password);
                if (validPassword) {
                    res.status(200).json({
                        id: candidate.id,
                        token: ''
                    });
                }
                else {
                    res.status(401).json({
                        status: false,
                        message: 'Unauthorized'
                    });
                }
            }
        }));
        app.get('/users', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield db.manyOrNone('select * from client');
            res.status(200).json(users);
        }));
        app.delete('/users/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const deleted = yield db.oneOrNone(`delete from client where id = ${id}`);
            res.status(200).json(deleted);
        }));
        app.get('/data', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield db.manyOrNone('select * from done');
            res.status(200).json(data);
        }));
        app.get('/orders', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const orders = yield db.manyOrNone('select * from orders');
            res.status(200).json(orders);
        }));
        app.get('/queue', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const queue = yield db.manyOrNone('select * from queue');
            res.status(200).json(queue);
        }));
        app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const client_id = req.headers.authorization;
            if (!client_id)
                res.status(401).end("Unauthorized!");
            else {
                const data = yield db.manyOrNone(`SELECT data FROM done WHERE client_id = ${Number(client_id)}`);
                res.status(200).json(data);
            }
        }));
        app.listen(5000, () => {
            console.log("Server started");
        });
    });
}
main();
