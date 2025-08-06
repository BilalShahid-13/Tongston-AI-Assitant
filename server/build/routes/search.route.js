"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchKnowledgeBase_controller_1 = require("../controller/searchKnowledgeBase.controller");
const searchRouter = express_1.default.Router();
searchRouter.post("/search/lessonPlan", searchKnowledgeBase_controller_1.searchLessonPlanKnowledgeBase);
// searchRouter.post("/search/assessmentPlan", searchAssessmentPlanKnowledgeBase);
exports.default = searchRouter;
