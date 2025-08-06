"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertKnowledgeBase = void 0;
const textsplitters_1 = require("@langchain/textsplitters");
const fetchFolderId_1 = require("../utils/fetchFolderId");
const fetchPdfs_1 = require("../utils/fetchPdfs");
const parseExcelFile_1 = require("../utils/parseExcelFile");
const connectDb_1 = require("./connectDb");
const loadPdf_1 = require("./loadPdf");
const openai_1 = __importDefault(require("./openai"));
const insertKnowledgeBase = async (path) => {
    const COLLECTION_NAME = process.env.COLLECTION_NAME;
    const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
        chunkSize: 512,
        chunkOverlap: 100
    });
    try {
        const db = await (0, connectDb_1.connectMongo)();
        if (!db)
            throw new Error("Failed to connect to MongoDB");
        const data = (0, parseExcelFile_1.parseExcelFile)(path);
        // const data: KnowledgeBaseEntry[] = parseExcelFile(path);
        if (!data || data.length === 0)
            throw new Error("No valid data found in Excel file");
        for (const row of data) {
            const { Discipline, DisciplineDescription, Subject, SubjectDescription, NationalCurriculumSubjectMapping, NationalCurriculumSubjectMapping_1, NationalCurriculumSubjectMapping_2, NationalCurriculumSubjectMapping_3, NationalCurriculumSubjectMapping_4, YearClass, TypeOfExternalKnowledgeBase, Topic, Source, Link, OtherExternalResources } = row;
            const trimmedLink = Link?.trim(); // 🧼 Trim whitespace
            if (!Link || // empty or undefined
                Link.trim() === "" || Link === "") {
                // Store metadata only
                await db.collection(COLLECTION_NAME).insertOne({
                    Discipline: row["Discipline"],
                    DisciplineDescription: row["Discipline Description"],
                    Subject: row["Subject"],
                    SubjectDescription: row["Subject Description"],
                    NationalCurriculumSubjectMapping: row["National Curriculum Subject Mapping"],
                    NationalCurriculumSubjectMapping_1: row["National Curriculum Subject Mapping_1"],
                    NationalCurriculumSubjectMapping_2: row["National Curriculum Subject Mapping_2"],
                    NationalCurriculumSubjectMapping_3: row["National Curriculum Subject Mapping_3"],
                    NationalCurriculumSubjectMapping_4: row["National Curriculum Subject Mapping_4"],
                    YearClass: row["Year/Class"],
                    TypeOfExternalKnowledgeBase: row["Type of External Knowledge Base"],
                    Topic: row["Topic"],
                    Source: row["Source"],
                    Link: row["Link"],
                    OtherExternalResources: row["Other External Resources"],
                    content: null,
                    $vector: null,
                    createdAt: new Date(),
                });
                continue;
            }
            try {
                if ((0, fetchFolderId_1.isDriveFolderLink)(Link) // folder link, not a file
                ) {
                    const folderId = (0, fetchFolderId_1.extractDriveFolderId)(Link);
                    if (!folderId) {
                        console.warn(`⚠️ Invalid folder ID in link: ${Link}`);
                        break;
                    }
                    ;
                    const files = await (0, fetchPdfs_1.fetchPdfUrls)(folderId);
                    for await (const file of files) {
                        const content = await (0, loadPdf_1.loadPdfText)(file.url);
                        const chunks = await splitter.splitText(content);
                        for (const chunk of chunks) {
                            const embedding = await openai_1.default.embeddings.create({
                                model: "text-embedding-3-small",
                                input: chunk,
                                encoding_format: "float"
                            });
                            const vector = embedding.data[0].embedding;
                            await db.collection(COLLECTION_NAME).insertOne({
                                Discipline: row["Discipline"],
                                DisciplineDescription: row["Discipline Description"],
                                Subject: row["Subject"],
                                SubjectDescription: row["Subject Description"],
                                NationalCurriculumSubjectMapping: row["National Curriculum Subject Mapping"],
                                NationalCurriculumSubjectMapping_1: row["National Curriculum Subject Mapping_1"],
                                NationalCurriculumSubjectMapping_2: row["National Curriculum Subject Mapping_2"],
                                NationalCurriculumSubjectMapping_3: row["National Curriculum Subject Mapping_3"],
                                NationalCurriculumSubjectMapping_4: row["National Curriculum Subject Mapping_4"],
                                YearClass: row["Year/Class"],
                                TypeOfExternalKnowledgeBase: row["Type of External Knowledge Base"],
                                Topic: row["Topic"],
                                Source: row["Source"],
                                Link: file.url,
                                content: chunk,
                                $vector: vector,
                                OtherExternalResources,
                                createdAt: new Date(),
                            });
                        }
                    }
                }
                else if ((0, fetchFolderId_1.isDriveFileLink)(Link)) {
                    const fileUrl = (0, fetchFolderId_1.getGoogleDriveDirectDownload)(Link);
                    if (!fileUrl) {
                        break;
                    }
                    const content = await (0, loadPdf_1.loadPdfText)(fileUrl);
                    const chunks = await splitter.splitText(content);
                    for (const chunk of chunks) {
                        const embedding = await openai_1.default.embeddings.create({
                            model: "text-embedding-3-small",
                            input: chunk,
                            encoding_format: "float"
                        });
                        const vector = embedding.data[0].embedding;
                        await db.collection(COLLECTION_NAME).insertOne({
                            Discipline: row["Discipline"],
                            DisciplineDescription: row["Discipline Description"],
                            Subject: row["Subject"],
                            SubjectDescription: row["Subject Description"],
                            NationalCurriculumSubjectMapping: row["National Curriculum Subject Mapping"],
                            NationalCurriculumSubjectMapping_1: row["National Curriculum Subject Mapping_1"],
                            NationalCurriculumSubjectMapping_2: row["National Curriculum Subject Mapping_2"],
                            NationalCurriculumSubjectMapping_3: row["National Curriculum Subject Mapping_3"],
                            NationalCurriculumSubjectMapping_4: row["National Curriculum Subject Mapping_4"],
                            YearClass: row["Year/Class"],
                            TypeOfExternalKnowledgeBase: row["Type of External Knowledge Base"],
                            Topic: row["Topic"],
                            Source: row["Source"],
                            Link: fileUrl,
                            content: chunk,
                            $vector: vector,
                            OtherExternalResources,
                            createdAt: new Date(),
                        });
                    }
                }
                console.log(`✅ Processed PDF and metadata: ${Topic}`);
            }
            catch (pdfErr) {
                console.warn(`⚠️ Failed to process PDF at ${Link}:`, pdfErr);
            }
        }
    }
    catch (error) {
        console.error("❌ insertKnowledgeBase failed:", error);
        throw error;
    }
};
exports.insertKnowledgeBase = insertKnowledgeBase;
