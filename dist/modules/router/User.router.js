"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const User_controller_1 = require("../../entity/user/User.controller");
class UserRouter {
    constructor() {
        this.userController = tsyringe_1.container.resolve(User_controller_1.UserController);
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.post('/register', (req, res) => this.userController.register(req, res));
        this.router.post('/login', (req, res) => this.userController.login(req, res));
        this.router.delete('/:id', (req, res) => this.userController.delete(req, res));
        this.router.get('/', (req, res) => this.userController.showUsers(req, res));
        return this.router;
    }
}
exports.UserRouter = UserRouter;
