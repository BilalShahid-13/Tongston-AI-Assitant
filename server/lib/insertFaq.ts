import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import axios from "axios";
import { config } from "dotenv";
import { Db, MongoClient } from "mongodb";
import PdfParse from "pdf-parse";
import { connectMongo } from "../lib/connectDb";
import openai from "../lib/openai";
import { parseExcelLink } from "../utils/parseExcelFile";
import { listPdfFilesInFolder } from "./googleDriveDriver";
import { faqKnowledgeBase } from "../model/faqKnowledgeBase";


config();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
});
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db: Db;

const COLLECTION_NAME = process.env.COLLECTION_NAME as string;


const extractFileId = (link: string): string => {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
};

const extractFolderId = (link: string): string => {
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
};

const downloadDriveFile = async (fileId: string): Promise<Buffer> => {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await axios.get(url, { responseType: "arraybuffer", timeout: 60000 });
  return Buffer.from(response.data);
};

// const listPdfFilesInFolder = async (folderId: string): Promise<string[]> => {
//   // TODO: Replace with Google Drive API logic
//   return ["pdfFileId1", "pdfFileId2"];
// };

async function pdfToText(buffer: Buffer): Promise<string> {
  const data = await PdfParse(buffer);
  return data.text;
}

// async function processSinglePdf(fileId: string) {
//   const pdfBuffer = await downloadDriveFile(fileId);
//   const content = await pdfToText(pdfBuffer);
//   const chunks = await splitter.splitText(content);

//   for (const chunk of chunks) {
//     const embedding = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: chunk,
//       encoding_format: "float",
//     });

//     const vector = embedding.data[0].embedding;

//     await Faq.create({
//       fileId:fileId,
//       chunkIndex: i,
//       content: chunk,
//       vector,
//     });
//   }
// }
async function processSinglePdf(fileId: string) {
  const pdfBuffer = await downloadDriveFile(fileId);
  const content = await pdfToText(pdfBuffer);
  const chunks = await splitter.splitText(content);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const exists = await faqKnowledgeBase.exists({ fileId, chunkIndex: i });
    if (exists) {
      console.log(`⏩ Skipping chunk ${i} of file ${fileId} (already in DB)`);
      continue;
    }

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
      encoding_format: "float",
    });

    const vector = embedding.data[0].embedding;

    await faqKnowledgeBase.create({
      fileId,
      chunkIndex: i,
      content: chunk,
      vector,
    });

    console.log(`✅ Inserted chunk ${i} of file ${fileId}`);
  }
}






export async function insertFaq() {
  try {
    const links: string[] = parseExcelLink("./public/AI Chatbot (K12) Knowledge base sort sheet.xlsx");

    const db = await connectMongo();

    for (const link of links) {
      const isPdfLink = link.includes("/view");
      const isFolderLink = link.includes("/folders/");

      if (isPdfLink) {
        const fileId = extractFileId(link);
        await processSinglePdf(fileId);
      } else if (isFolderLink) {
        const folderId = extractFolderId(link);

        const pdfFileIds = await listPdfFilesInFolder(folderId);
        for (const pdfId of pdfFileIds) {
          await processSinglePdf(pdfId);
        }
      } else {
        console.warn(`⚠️ Unknown link format: ${link}`);
      }
    }

    // res.status(200).json({ message: "FAQs inserted successfully." });
    console.log("FAQs inserted successfully")

  } catch (error) {
    console.error("❌ Error inserting FAQ:", error);
    // res.status(500).json({ error: "Internal Server Error" });
  }
}
