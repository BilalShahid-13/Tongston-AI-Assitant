import { Request, Response } from "express";
import { planSimilaritySearch } from "../utils/similaritySearch";
import { studentConductCharacterPlanAssessmentPrompt, studentConductCharacterPlanPrompt } from "../templates/prompts";

export async function getStudentConductCharacterAssessmentPlan(
  req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;

    const requiredFields = [
      "typeofAssessments",
      "continuousAssessmentWeek",
      "location",
      "yearClass",
      "schoolLevel",
      "term",
      "week",
      "KPI",
      "bloomLevel",
      "technologyAccess",
      "studentConductLessonObjectives",
      "subject",
      "teachingAids",
      "classSize",
      "timeAvailable",
      "noQuestions",
      "questionTypes"
    ];

    const missingFields = requiredFields.filter(field => {
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

    await planSimilaritySearch(req, body, res, studentConductCharacterPlanAssessmentPrompt);

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