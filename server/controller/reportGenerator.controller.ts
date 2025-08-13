import { Request, Response } from "express";
import { reportGeneratorPrompt } from "../templates/prompts";
import { parseUploadedFile } from "../utils/fileParser";
import { planSimilaritySearch } from "../utils/similaritySearch";

export async function getReportGenerator(req: Request, res: Response): Promise<void> {
  try {
    const {
      classType,
      term,
      termTheme,
      submittedOnTime,
      submittedViaCorrectChannel,
      directedToCorrectAuthority,
      associatedPBLTask,
      teacherNameOrID
    } = req.body;

    // ✅ Basic field validation
    if (!req.file || !classType || !term || !termTheme) {
      res.status(400).json({ error: "Missing required fields or file" });
      return;
    }
    // ✅ Parse the uploaded file from memory buffer
    const fileText = await parseUploadedFile(req.file.buffer, req?.file?.originalname);

    // ✅ Stream GPT response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await planSimilaritySearch(
      req,
      {
        classType,
        term,
        termTheme,
        submittedOnTime,
        submittedViaCorrectChannel,
        directedToCorrectAuthority,
        associatedPBLTask,
        teacherNameOrID,
        fileText
      },
      res,
      reportGeneratorPrompt,
      "reportGeneratorPlan",
      "Report Generator Plan"
    );

  } catch (error: any) {
    console.error("❌ Error in getReportGenerator:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      res.end();
    }
  }
}
