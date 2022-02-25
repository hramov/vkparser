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
exports.UserService = void 0;
const tsyringe_1 = require("tsyringe");
const database_connect_1 = require("../../modules/database/database.connect");
const bcrypt_1 = require("bcrypt");
let UserService = class UserService {
    constructor(database) {
        this.database = database;
    }
    showUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.database.instance.manyOrNone('SELECT * FROM CLIENT');
        });
    }
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield this.database.instance.oneOrNone(`select * from client where email = '${email}'`);
            if (candidate) {
                return {
                    status: false,
                    data: null,
                    error: new Error('User is already registered!'),
                };
            }
            else {
                const id = yield this.database.instance.query(`insert into client (email, password) values ('${email}', '${yield (0, bcrypt_1.hash)(password, yield (0, bcrypt_1.genSalt)(10))}') returning id`);
                if (id[0].id) {
                    return {
                        status: true,
                        data: id[0].id,
                        error: null,
                    };
                }
                else {
                    return {
                        status: false,
                        data: null,
                        error: new Error('Some problems'),
                    };
                }
            }
        });
    }
};
UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [database_connect_1.Database])
], UserService);
exports.UserService = UserService;
