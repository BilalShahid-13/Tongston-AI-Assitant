import axios from "axios";
import { pdfToText } from "./pdfToText";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import openai from "./openai";
import { Faq } from "../model/faq";

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
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
      encoding_format: "float",
    });

    const vector = embedding.data[0].embedding;

    await Faq.insertOne({
      content: chunk,
      vector,
    });
  }
}