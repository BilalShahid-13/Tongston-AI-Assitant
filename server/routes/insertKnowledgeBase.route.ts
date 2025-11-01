import { Router } from "express";
import { deleteKnowledgeBase, getKnowledgeBaseFile, getKnowledgeBaseFileLength } from "../controller/getKnowledgeBaseFile.controller";
import { extractGoogleDocsController, extractWebsiteController, insertKnowledgeBase } from "../controller/insertKnowledgeBase.controller";
import cloudinaryUpload, { upload } from "../middleware/upload";

const KnowledgeBaseRouter = Router();

KnowledgeBaseRouter.post("/insertKnowledgeBase", upload.single("file"), insertKnowledgeBase);// KnowledgeBaseRouter.post("/insertKnowledgeBase", cloudinaryUpload.single("file"),
//   insertKnowledgeBase);
KnowledgeBaseRouter.post("/insertFromGoogleDocs", extractGoogleDocsController);
KnowledgeBaseRouter.post("/insertFromWebsite", extractWebsiteController);
KnowledgeBaseRouter.get("/getKnowledgeBaseFiles", getKnowledgeBaseFile);
KnowledgeBaseRouter.get("/getKnowledgeBaseFileLength", getKnowledgeBaseFileLength);
KnowledgeBaseRouter.delete("/deleteKnowledgeBaseFile", deleteKnowledgeBase);
export default KnowledgeBaseRouter;