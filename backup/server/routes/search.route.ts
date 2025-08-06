import express from "express";
import { searchLessonPlanKnowledgeBase } from "../controller/searchKnowledgeBase.controller";
const searchRouter = express.Router();

searchRouter.post("/search/lessonPlan", searchLessonPlanKnowledgeBase);
// searchRouter.post("/search/assessmentPlan", searchAssessmentPlanKnowledgeBase);


export default searchRouter;
