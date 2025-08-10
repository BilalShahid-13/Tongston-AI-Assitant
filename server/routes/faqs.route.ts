import { Router } from "express";
import { getFaq, insertFaq } from "../controller/faq.controller";
import { fetchFaqChats } from "../controller/fetchFaqChats.controller";
const faqRouter = Router();

faqRouter.get("/getFaq", getFaq);
faqRouter.post("/insertFaq", insertFaq);
faqRouter.get("/fetchFaqChats",fetchFaqChats)

export default faqRouter;
