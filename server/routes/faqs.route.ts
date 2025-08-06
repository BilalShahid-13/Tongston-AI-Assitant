import { Router } from "express";
import { getFaq, insertFaq } from "../controller/faq.controller";
const faqRouter = Router();

faqRouter.get("/getFaq", getFaq);
faqRouter.post("/insertFaq", insertFaq);

export default faqRouter;
