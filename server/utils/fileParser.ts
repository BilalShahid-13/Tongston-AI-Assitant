import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseUploadedFile(fileBuffer: Buffer, originalName: string): Promise<string> {
  const ext = originalName.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  if (ext === "txt") {
    return fileBuffer.toString("utf-8");
  }

  throw new Error("Unsupported file type");
}
