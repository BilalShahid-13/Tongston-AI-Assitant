"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectTaskFacilitation_controller_1 = require("../controller/projectTaskFacilitation.controller");
const projectTaskPlan_controller_1 = require("../controller/projectTaskPlan.controller");
const projectTaskRouter = (0, express_1.Router)();
projectTaskRouter.post("/projectTask", projectTaskPlan_controller_1.getProjectTaskPlan);
projectTaskRouter.post("/project/Facilitation", projectTaskFacilitation_controller_1.getProjectTaskFacilitationPlan);
exports.default = projectTaskRouter;
