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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const tsyringe_1 = require("tsyringe");
const database_connect_1 = require("../../modules/database/database.connect");
let OrderService = class OrderService {
    constructor(database) {
        this.database = database;
    }
    addOrder(auth, vkid, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.database.instance.query(`SELECT * FROM  add_to_queue(${auth}, '${vkid}', '${JSON.stringify(groups)}') as status`);
            return {
                status: true,
                data: result[0],
                error: null,
            };
        });
    }
    checkIntersection(auth, vkid, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundGroupsRow = yield this.database.instance.manyOrNone(`SELECT data FROM done where client_id = ${Number(auth)} and vkid = '${vkid}'`);
            const foundGroups = [];
            foundGroupsRow.forEach((data) => foundGroups.push(...data.groups));
            const result = [];
            foundGroups.forEach((group) => groups.includes(group) ? result.push(group) : null);
            return {
                status: true,
                data: result,
                error: null,
            };
        });
    }
    getResultsForOrder(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.database.instance.oneOrNone(`SELECT * FROM done where order_id = ${order_id}`);
            return result;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.database.instance.query('DELETE FROM queue');
            yield this.database.instance.query('DELETE FROM orders');
            yield this.database.instance.query('DELETE FROM parse');
        });
    }
};
OrderService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [database_connect_1.Database])
], OrderService);
exports.OrderService = OrderService;
