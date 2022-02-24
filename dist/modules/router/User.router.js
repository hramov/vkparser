"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const User_controller_1 = require("../../entity/user/User.controller");
class UserRouter {
    constructor() {
        this.userController = new User_controller_1.UserController();
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.post('/register', this.userController.register);
        this.router.post('/login', this.userController.login);
        this.router.delete('/:id', this.userController.delete);
        this.router.get('/', this.userController.showUsers);
        return this.router;
    }
}
exports.UserRouter = UserRouter;
