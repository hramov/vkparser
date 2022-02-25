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
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const User_service_1 = require("./User.service");
const User_validation_1 = require("./User.validation");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    showUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.userService.showUsers();
            res.json(result);
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if ((0, User_validation_1.RegisterValidation)(req.body.client)) {
                const { email, password } = req.body.client;
                result = yield this.userService.register(email, password);
                res.json(result);
            }
            else {
                result = {
                    status: false,
                    data: null,
                    error: new Error('Data is incorrect'),
                };
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.client ||
                !req.body.client.email ||
                !req.body.client.password) {
                res.json({
                    status: false,
                    message: 'Client data is undefined',
                });
            }
            else {
                const { email, password } = req.body.client;
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    results(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
UserController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [User_service_1.UserService])
], UserController);
exports.UserController = UserController;
