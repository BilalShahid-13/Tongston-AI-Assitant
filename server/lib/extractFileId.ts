import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import axios from "axios";
import { faqKnowledgeBase } from "../model/faqKnowledgeBase";
import { embedQuery } from "./openai";
import { pdfToText } from "./pdfToText";

export const extractFileId = (link: string): string => {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
};

export const extractFolderId = (link: string): string => {
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
};

export const downloadDriveFile = async (fileId: string): Promise<Buffer> => {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
};

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

export async function processSinglePdf(fileId: string) {
  const pdfBuffer = await downloadDriveFile(fileId);
  const content = await pdfToText(pdfBuffer);
  const chunks = await splitter.splitText(content);

  for (const chunk of chunks) {
    // embeddings.embedQuery
    const vector = await embedQuery(chunk);
    // const embedding = await openai.embeddings.create({
    //   model: "gemini-embedding-001",
    //   input: chunk,
    //   encoding_format: "float",
    // });

    // const vector = embedding.data[0].embedding;

    await faqKnowledgeBase.insertOne({
      content: chunk,
      vector,
    });
  }
}
