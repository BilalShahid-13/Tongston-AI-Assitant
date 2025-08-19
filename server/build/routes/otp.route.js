"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sendOtp_controller_1 = require("../controller/sendOtp.controller");
const verifyOtp_controller_1 = require("../controller/verifyOtp.controller");
const otpRouter = (0, express_1.Router)();
otpRouter.post("/verifyOtp", verifyOtp_controller_1.verifyOtp);
otpRouter.post("/sendOtp", sendOtp_controller_1.sendOtp);
exports.default = otpRouter;
