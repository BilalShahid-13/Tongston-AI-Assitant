import { Router } from "express";
import { getFaq, insertFaq } from "../controller/faq.controller";
// import { insertFeedback } from "../controller/feedback.controller";
// import { upload } from "../middleware/upload";
const faqRouter = Router();

faqRouter.get("/getFaq", getFaq);
faqRouter.post("/insertFaq", insertFaq);

export default faqRouter;
