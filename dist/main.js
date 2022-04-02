"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
require("reflect-metadata");
const handlers_1 = require("./handler/handlers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const browser_1 = require("./handler/browser");
const database_1 = require("./modules/database");
const tsyringe_1 = require("tsyringe");
let Parser = class Parser {
    constructor(database) {
        this.database = database;
    }
    async init() {
        const browser = new browser_1.BrowserHandler();
        await browser.init();
        this.page = browser.getPage();
    }
    async storeGroups(groups) {
        for (let i = 0; i < groups.length; i++) {
            try {
                await this.database.instance.query(`insert into groups (title, href) values ('${groups[i].title}', '${groups[i].href}') on conflict do nothing`);
            }
            catch (err) {
                console.log(`Group ${groups[i].title} is already in the list`);
            }
        }
    }
    async proceedGroups(data, taken, groups, error) {
        console.log('Storing results');
        try {
            const done_id = await this.database.instance.query(`SELECT * FROM add_to_done(${data.order_id}, current_timestamp, '${JSON.stringify({
                groups: groups,
            })}')`);
            await this.database.instance.query(`
				UPDATE done SET error = '${error === null || error === void 0 ? void 0 : error.message}' WHERE id = '${done_id}'
			`);
            const stored = await this.database.instance.oneOrNone(`SELECT * FROM done WHERE order_id = ${data.order_id}`);
            console.table({
                id: stored.id,
                vkid: stored.vkid,
                client_id: stored.client_id,
                order_id: stored.order_id,
                data: stored.data.groups,
            });
            if (stored.order_id != data.order_id) {
                console.log('Order ids are incompatible');
            }
            console.log('Complete ' +
                stored.vkid +
                ' Found ' +
                stored.data.groups.length +
                ' groups');
        }
        catch (_err) {
            const err = _err;
            console.log(err.message);
        }
    }
    async getGroups(id, vkid) {
        let groups = [];
        try {
            groups = await (0, handlers_1.getUsersGroup)(this.page, vkid);
            if (groups instanceof Error) {
                throw groups;
            }
        }
        catch (_err) {
            const err = _err;
            console.log(err.message);
        }
        return groups;
    }
    async getUserInGroups(id, vkid, groups) {
        let result = [];
        try {
            result = await (0, handlers_1.checkIfUserInGroups)(this.page, vkid, groups);
            if (result instanceof Error) {
                throw result;
            }
        }
        catch (_err) {
            const err = _err;
            console.log(err.message);
        }
        return result;
    }
    async proceed() {
        let isGo = true;
        setInterval(async () => {
            if (isGo) {
                isGo = false;
                if (this.page) {
                    const data = await this.database.instance.oneOrNone('select * from queue where taken = false limit 1');
                    if (data && data.id) {
                        console.log(`Start parsing ${data.vkid}`);
                        const taken = new Date();
                        await this.database.instance.query(`update queue set taken = true where id = ${data.id}`);
                        const groups = await this.getGroups(data.id, data.vkid);
                        if (groups instanceof Error) {
                            await this.proceedGroups(data, taken, [], groups);
                        }
                        else {
                            const userInGroups = await this.getUserInGroups(data.id, data.vkid, data.groups);
                            if (userInGroups instanceof Error) {
                                await this.proceedGroups(data, taken, [], userInGroups);
                            }
                            else {
                                console.log(userInGroups);
                                const result = groups.filter((group) => userInGroups.includes(group));
                                console.log(result);
                                await this.proceedGroups(data, taken, result, null);
                            }
                        }
                    }
                }
                isGo = true;
            }
        }, 5000);
    }
};
Parser = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [database_1.Database])
], Parser);
exports.Parser = Parser;
const parser = tsyringe_1.container.resolve(Parser);
parser.init();
parser.proceed();
