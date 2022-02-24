"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = void 0;
const express_1 = require("express");
const Order_router_1 = require("./Order.router");
const User_router_1 = require("./User.router");
class ApiRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use('/user', new User_router_1.UserRouter().init());
        this.router.use('/order', new Order_router_1.OrderRouter().init());
        return this.router;
    }
}
exports.ApiRouter = ApiRouter;
