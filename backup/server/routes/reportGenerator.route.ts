import { Router } from "express";
import { getReportGenerator } from "../controller/reportGenerator.controller";
const reportRouter = Router();

reportRouter.post("/getReport", getReportGenerator);
export default reportRouter;
