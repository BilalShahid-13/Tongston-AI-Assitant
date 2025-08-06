"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportGenerator_controller_1 = require("../controller/reportGenerator.controller");
const reportRouter = (0, express_1.Router)();
reportRouter.post("/getReport", reportGenerator_controller_1.getReportGenerator);
exports.default = reportRouter;
