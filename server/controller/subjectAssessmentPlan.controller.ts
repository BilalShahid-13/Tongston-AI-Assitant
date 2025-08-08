import { Request, Response } from "express";
import { planSimilaritySearch } from "../utils/similaritySearch";
import { subjectAssessmentPrompt } from "../templates/prompts";

export async function getAssessmentPlan(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;

    const compulsoryAssessmentPlanFields = [
      "assessmentType",
      "location",
      "schoolCurriculum",
      "yearClass",
      "schoolLevel",
      "subSchoolLevel",
      "studentAge",
      "classesSocioEconoic",
      "term",
      "termTheme",
      "subject",
      "subjectDiscipline",
      "subjectUnitTopic",
      "bloom",
      "subjectLearning",
      "timeAvailable",
      "PreferredCommuniation",
      "totalQuesions",
      "questionTypes",
      // "cassessmentWeek"
      "assessmentWeek"
    ];

    // ✅ Check for missing required fields
    const missingFields = compulsoryAssessmentPlanFields.filter(field => {
      const value = body[field];
      if (Array.isArray(value)) return value.length === 0;
      return value === undefined || value === "";
    });

    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields); // ADD THIS
      res.status(400).json({
        error: "Missing compulsory fields",
        missingFields,
      });
      return;
    }

    // ✅ Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // ✅ Stream the generated assessment plan
    await planSimilaritySearch(req, body, res, subjectAssessmentPrompt, "subjectAssessmentPlan","Subject Assessment Plan");

  } catch (error: any) {
    console.error("❌ Error in getSubjectLessonPlan:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.write(error?.message);
      res.end();
    }
  }
}
