"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../controller/faq.controller");
const faqRouter = (0, express_1.Router)();
faqRouter.get("/getFaq", faq_controller_1.getFaq);
faqRouter.post("/insertFaq", faq_controller_1.insertFaq);
exports.default = faqRouter;
