"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const order_service_1 = __importDefault(require("../modules/order/order.service"));
const orderStatusJob = cron_1.CronJob.from({
    cronTime: "0 0 0 * * *",
    onTick: order_service_1.default.makeUnConfirmedOrderToSpamStatus,
    timeZone: "America/Los_Angeles",
});
exports.default = orderStatusJob;
