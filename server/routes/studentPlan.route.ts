import { Router } from "express";
import { getStudentConductCharacterAssessmentPlan } from "../controller/studentConductCharacterAssessmentPlan.controller";
import { getStudentConductCharacterPlan } from "../controller/studentConductCharacterPlan.controller";

const studentConductRouter = Router();

studentConductRouter.post("/student/ConductCharacter", getStudentConductCharacterPlan)
studentConductRouter.post("/student/ConductCharacterAssessment", getStudentConductCharacterAssessmentPlan)

export default studentConductRouter