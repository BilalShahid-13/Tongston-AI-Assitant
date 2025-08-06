import axios from "axios";
import path from "path";
import fs from "fs";

export const downloadGoogleSheet = async (): Promise<string> => {
  const url = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/export?format=xlsx`;
  const filePath = path.join("downloads", "client-sheet.xlsx");

  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(filePath);
  await new Promise((resolve) => response.data.pipe(writer).on("finish", resolve));

  return filePath;
};