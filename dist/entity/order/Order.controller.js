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
exports.OrderController = void 0;
const tsyringe_1 = require("tsyringe");
const Order_service_1 = require("./Order.service");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    addOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = req.headers.authorization;
            if (!auth) {
                res.status(401).end('Unauthorized!');
                return;
            }
            const vkid = req.body.vkid;
            if (!vkid) {
                res.json({
                    status: false,
                    message: 'Data is empty',
                });
                return;
            }
            const result = yield this.orderService.addOrder(auth, vkid);
            if (result.status) {
                res.json({
                    status: 'Added to queue',
                });
            }
            else {
                res.json({
                    status: 'Some problems',
                });
            }
        });
    }
};
OrderController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [Order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
