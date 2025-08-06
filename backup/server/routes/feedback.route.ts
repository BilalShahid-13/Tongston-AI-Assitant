import { Router } from "express";
import { insertFeedback } from "../controller/feedback.controller";
import { upload } from "../middleware/upload";
const feedbackRouter = Router();

feedbackRouter.post("/insertFeedback", upload.single("file"), insertFeedback);

export default feedbackRouter;
