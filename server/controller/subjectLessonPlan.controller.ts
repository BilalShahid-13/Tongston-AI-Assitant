import { Request, Response } from "express";
import { lessonPlanPrompt } from "../templates/prompts";
import { planSimilaritySearch } from "../utils/similaritySearch";

export async function getSubjectLessonPlan(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;

    const compulsoryFields = [
      "location",
      "curriculum",
      "yearClass",
      "schoolLevel",
      "subSchoolLevel",
      "studentAge",
      "term",
      "termTheme",
      "week",
      "topic",
      "subject",
      "subjectDiscipline",
      "bloomLevel",
      "classSize",
      "timeAvailable",
      "technologyAccess",
      "teachingAids"
    ];

    // ✅ Check missing fields BEFORE sending headers
    const missingFields = compulsoryFields.filter(field => {
      const value = body[field];
      if (field === "teachingAids") return !Array.isArray(value) || value.length === 0;
      return value === undefined || value === "";
    });

    if (missingFields.length > 0) {
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

    // await connectMongo();
    // ✅ Now start streaming
    // console.log(body)
    // res.end();
    await planSimilaritySearch(req, body, res, lessonPlanPrompt, "subjectLessonPlan", "Subject Lesson Plan");

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
