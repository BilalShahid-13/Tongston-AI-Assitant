"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getKnowledgeBaseFile_controller_1 = require("../controller/getKnowledgeBaseFile.controller");
const insertKnowledgeBase_controller_1 = require("../controller/insertKnowledgeBase.controller");
const upload_1 = require("../middleware/upload");
const KnowledgeBaseRouter = (0, express_1.Router)();
KnowledgeBaseRouter.post("/insertKnowledgeBase", upload_1.upload.single("file"), insertKnowledgeBase_controller_1.insertKnowledgeBase); // KnowledgeBaseRouter.post("/insertKnowledgeBase", cloudinaryUpload.single("file"),
//   insertKnowledgeBase);
KnowledgeBaseRouter.post("/insertFromGoogleDocs", insertKnowledgeBase_controller_1.extractGoogleDocsController);
KnowledgeBaseRouter.post("/insertFromWebsite", insertKnowledgeBase_controller_1.extractWebsiteController);
KnowledgeBaseRouter.get("/getKnowledgeBaseFiles", getKnowledgeBaseFile_controller_1.getKnowledgeBaseFile);
KnowledgeBaseRouter.get("/getKnowledgeBaseFileLength", getKnowledgeBaseFile_controller_1.getKnowledgeBaseFileLength);
KnowledgeBaseRouter.delete("/deleteKnowledgeBaseFile", getKnowledgeBaseFile_controller_1.deleteKnowledgeBase);
exports.default = KnowledgeBaseRouter;
