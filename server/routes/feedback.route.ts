import { Router } from "express";
import { insertFeedback } from "../controller/feedback.controller";
import cloudinaryUpload from "../middleware/upload";
const feedbackRouter = Router();

// feedbackRouter.post("/insertFeedback", upload.single("file"), insertFeedback);
feedbackRouter.post(
  "/insertFeedback",
  cloudinaryUpload.fields([
    { name: "issueScreenshot", maxCount: 5 },
    { name: "suggestionScreenshot", maxCount: 5 },
  ]),
  insertFeedback
);

export default feedbackRouter;
