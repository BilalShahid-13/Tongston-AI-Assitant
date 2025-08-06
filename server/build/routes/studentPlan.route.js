"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentConductCharacterAssessmentPlan_controller_1 = require("../controller/studentConductCharacterAssessmentPlan.controller");
const studentConductCharacterPlan_controller_1 = require("../controller/studentConductCharacterPlan.controller");
const studentConductRouter = (0, express_1.Router)();
studentConductRouter.post("/student/ConductCharacter", studentConductCharacterPlan_controller_1.getStudentConductCharacterPlan);
studentConductRouter.post("/student/ConductCharacterAssessment", studentConductCharacterAssessmentPlan_controller_1.getStudentConductCharacterAssessmentPlan);
exports.default = studentConductRouter;
