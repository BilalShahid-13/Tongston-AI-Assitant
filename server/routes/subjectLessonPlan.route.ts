import { Router } from "express"
import { getSubjectLessonPlan } from "../controller/subjectLessonPlan.controller";
import { getAssessmentPlan } from "../controller/subjectAssessmentPlan.controller";

const subjectLessonRouter = Router();

subjectLessonRouter.post("/subject/lessonPlan", getSubjectLessonPlan)
subjectLessonRouter.post("/subject/assessmentPlan", getAssessmentPlan)

export default subjectLessonRouter