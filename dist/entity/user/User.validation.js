"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterValidation = void 0;
function RegisterValidation(client) {
    if (!client || !client.email || !client.password) {
        return false;
    }
    return true;
}
exports.RegisterValidation = RegisterValidation;
