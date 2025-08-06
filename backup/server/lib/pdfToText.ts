import PdfParse from "pdf-parse";

export async function pdfToText(buffer: Buffer): Promise<string> {
  const data = await PdfParse(buffer);
  return data.text;
}