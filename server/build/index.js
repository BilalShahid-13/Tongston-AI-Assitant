"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const faqs_route_1 = __importDefault(require("./routes/faqs.route"));
const projectTask_route_1 = __importDefault(require("./routes/projectTask.route"));
const studentPlan_route_1 = __importDefault(require("./routes/studentPlan.route"));
const subjectLessonPlan_route_1 = __importDefault(require("./routes/subjectLessonPlan.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const feedback_route_1 = __importDefault(require("./routes/feedback.route"));
const insertKnowledgeBase_route_1 = __importDefault(require("./routes/insertKnowledgeBase.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", (req, res) => {
    res.send("hello world!");
});
// insertAllData();
// parseExcelFile()
// app.use("/api", searchRouter);
// app.use("/api", feedbackRouter);
app.use("/api", insertKnowledgeBase_route_1.default);
app.use("/api", user_route_1.default);
app.use("/api", faqs_route_1.default);
app.use("/api", feedback_route_1.default);
app.use("/api", subjectLessonPlan_route_1.default);
app.use("/api", studentPlan_route_1.default);
app.use("/api", projectTask_route_1.default);
// insertFaq();
// console.log(parseExcelLink('./public/AI Chatbot (K12) Knowledge base sort sheet.xlsx'))
// connectMongo().then(() => {
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
// });
