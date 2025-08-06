"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapePdfs = void 0;
const textsplitters_1 = require("@langchain/textsplitters");
const loadPdf_1 = require("../lib/loadPdf");
const openai_1 = __importDefault(require("../lib/openai"));
const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});
const scrapePdfs = async (Link) => {
    const pdfContent = await (0, loadPdf_1.loadPdfText)(Link);
    const chunks = await splitter.splitText(pdfContent);
    const links = [];
    for (const chunk of chunks) {
        const embedding = await openai_1.default.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
            encoding_format: "float"
        });
        const vector = embedding.data[0].embedding;
        links.push({
            content: chunk,
            $vector: vector,
            createdAt: new Date()
        });
    }
    return links;
};
exports.scrapePdfs = scrapePdfs;
// await db.collection(COLLECTION_NAME).insertOne({
//   Discipline,
//   DisciplineDescription,
//   Subject,
//   SubjectDescription,
//   NationalCurriculumSubjectMapping,
//   NationalCurriculumSubjectMapping_1,
//   NationalCurriculumSubjectMapping_2,
//   NationalCurriculumSubjectMapping_3,
//   NationalCurriculumSubjectMapping_4,
//   YearClass,
//   TypeOfExternalKnowledgeBase,
//   Topic,
//   Source,
//   Link,
//   OtherExternalResources,
//   content: chunk,
//   $vector: vector,
//   createdAt: new Date(),
// });
