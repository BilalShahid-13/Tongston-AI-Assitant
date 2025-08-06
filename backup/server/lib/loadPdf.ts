// loadPdfText.ts
import fetch from "node-fetch";
import pdf from "pdf-parse";

export async function loadPdfText(pdfUrl: string): Promise<string> {
  const res = await fetch(pdfUrl);
  const buffer = await res.arrayBuffer();
  const data = await pdf(Buffer.from(buffer));
  return data.text;
  // const res = await fetch(pdfUrl);
  // const contentType = res.headers.get("content-type");

  // if (!res.ok || !contentType?.includes("application/pdf")) {
  //   const textPreview = await res.text();
  //   throw new Error(`Not a PDF file. Response type: ${contentType}, Preview: ${textPreview.slice(0, 200)}`);
  // }

  // const buffer = await res.buffer();
  // const data = await PdfParse(buffer);
  // return data.text;
}
