"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const Order_controller_1 = require("../../entity/order/Order.controller");
class OrderRouter {
    constructor() {
        this.orderController = new Order_controller_1.OrderController();
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.post('/', this.orderController.addOrder);
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
