"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const search_route_1 = __importDefault(require("./routes/search.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", (req, res) => {
    res.send("hello world!");
});
// insertAllData();
// parseExcelFile()
app.use("/api", search_route_1.default);
// app.post("/search/knowledgeBase", searchRouter);
app.listen(3000, () => {
    // connectMongo();
    console.log("server started at http://localhost:3000");
});
