import fs from "fs";
import pdfParse from "pdf-parse";

export const parsePDF = async (filePath: string): Promise<string[]> => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text.split("\n").filter(Boolean);
};
