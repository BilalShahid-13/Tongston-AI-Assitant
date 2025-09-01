"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../controller/faq.controller");
const fetchFaqChats_controller_1 = require("../controller/fetchFaqChats.controller");
const helpFaq_controller_1 = require("../controller/helpFaq.controller");
const faqRouter = (0, express_1.Router)();
faqRouter.get("/getFaq", faq_controller_1.getFaq);
faqRouter.post("/insertFaq", faq_controller_1.insertFaq);
faqRouter.get("/fetchFaqChats", fetchFaqChats_controller_1.fetchFaqChats);
// add dynamic help faq
faqRouter.post("/add-help-faq", helpFaq_controller_1.helpFaq);
faqRouter.patch("/update-help-faq", helpFaq_controller_1.updateHelpFaq);
faqRouter.delete("/delete-help-faq", helpFaq_controller_1.deleteHelpFaq);
faqRouter.post("/get-help-faq", helpFaq_controller_1.getHelpFaqList);
exports.default = faqRouter;
