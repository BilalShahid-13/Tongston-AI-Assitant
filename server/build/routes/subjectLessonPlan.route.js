"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectLessonPlan_controller_1 = require("../controller/subjectLessonPlan.controller");
const subjectAssessmentPlan_controller_1 = require("../controller/subjectAssessmentPlan.controller");
const subjectLessonRouter = (0, express_1.Router)();
subjectLessonRouter.post("/subject/lessonPlan", subjectLessonPlan_controller_1.getSubjectLessonPlan);
subjectLessonRouter.post("/subject/assessmentPlan", subjectAssessmentPlan_controller_1.getAssessmentPlan);
exports.default = subjectLessonRouter;
