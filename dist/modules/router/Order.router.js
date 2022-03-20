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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const Order_controller_1 = require("../../entity/order/Order.controller");
class OrderRouter {
    constructor() {
        this.orderController = tsyringe_1.container.resolve(Order_controller_1.OrderController);
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return yield this.orderController.addOrder(req, res); }));
        this.router.post('/check', (req, res) => __awaiter(this, void 0, void 0, function* () { return yield this.orderController.checkIsDone(req, res); }));
        this.router.get('/clear', (req, res) => __awaiter(this, void 0, void 0, function* () { return yield this.orderController.clear(req, res); }));
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
