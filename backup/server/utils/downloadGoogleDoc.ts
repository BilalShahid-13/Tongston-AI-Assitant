import axios from "axios";
import path from "path";
import fs from "fs";
export const downloadGoogleDoc = async (): Promise<string> => {
  const url = `https://docs.google.com/document/d/${process.env.DOC_ID}/export?format=pdf`;
  const filePath = path.join("downloads", "client-doc.pdf");

  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(filePath);
  await new Promise((resolve) => response.data.pipe(writer).on("finish", resolve));

  return filePath;
};
