import { Router } from "express";
import { getProjectTaskFacilitationPlan } from "../controller/projectTaskFacilitation.controller";
import { getProjectTaskPlan } from "../controller/projectTaskPlan.controller";
const projectTaskRouter = Router();

projectTaskRouter.post("/projectTask", getProjectTaskPlan);
projectTaskRouter.post("/project/Facilitation", getProjectTaskFacilitationPlan);

export default projectTaskRouter;
