import { Router } from "express";
import { getReportGenerator } from "../controller/reportGenerator.controller";
import { upload } from "../middleware/upload";
const reportRouter = Router();

// reportRouter.post("/getReport", upload.single("lessonPlanFile"), getReportGenerator);
reportRouter.post(
  "/getReport",
  (req, res, next) => {
    upload.single("lessonPlanFile")(req, res, (err) => {
      if (err) {
        console.error("❌ Multer error:", err);
        return res.status(400).json({ error: "File upload failed", details: err.message });
      }
      next();
    });
  },
  getReportGenerator
);

export default reportRouter;
