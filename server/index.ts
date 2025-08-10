import cors from "cors";
import express, { Request, Response } from "express";
import faqRouter from "./routes/faqs.route";
import projectTaskRouter from "./routes/projectTask.route";
import studentConductRouter from "./routes/studentPlan.route";
import subjectLessonRouter from "./routes/subjectLessonPlan.route";
import userRouter from "./routes/user.route";
import feedbackRouter from "./routes/feedback.route";
import KnowledgeBaseRouter from "./routes/insertKnowledgeBase.route";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));


app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

// insertAllData();
// parseExcelFile()

// app.use("/api", searchRouter);
// app.use("/api", feedbackRouter);
app.use("/api",KnowledgeBaseRouter)
app.use("/api", userRouter);
app.use("/api", faqRouter);
app.use("/api", feedbackRouter);
app.use("/api", subjectLessonRouter);
app.use("/api", studentConductRouter);
app.use("/api", projectTaskRouter)
// insertFaq();
// console.log(parseExcelLink('./public/AI Chatbot (K12) Knowledge base sort sheet.xlsx'))

// connectMongo().then(() => {
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
// });
