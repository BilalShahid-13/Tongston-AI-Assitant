import { Router } from "express";
import { getFaq, insertFaq } from "../controller/faq.controller";
import { fetchFaqChats } from "../controller/fetchFaqChats.controller";
import { getHelpFaqList, helpFaq,updateHelpFaq,deleteHelpFaq } from "../controller/helpFaq.controller";
const faqRouter = Router();

faqRouter.get("/getFaq", getFaq);
faqRouter.post("/insertFaq", insertFaq);
faqRouter.get("/fetchFaqChats", fetchFaqChats)
// add dynamic help faq
faqRouter.post("/add-help-faq", helpFaq)
faqRouter.patch("/update-help-faq", updateHelpFaq)
faqRouter.delete("/delete-help-faq", deleteHelpFaq)
faqRouter.post("/get-help-faq", getHelpFaqList)

export default faqRouter;
