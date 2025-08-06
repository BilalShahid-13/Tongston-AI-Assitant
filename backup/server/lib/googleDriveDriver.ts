import { google } from "googleapis";
import { promises as fs } from "fs";
import path from "path";

// const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, "../config/service-account.json"), // your JSON key path
//   scopes: SCOPES,
// });

// export const drive = google.drive({ version: "v3", auth });



const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../public/google-credentials.json"),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export const listPdfFilesInFolder = async (folderId: string): Promise<string[]> => {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
    fields: "files(id, name)",
    pageSize: 100,
  });

  const files = res.data.files || [];
  console.log(`📄 Found ${files.length} PDF(s) in folder ${folderId}`);
  return files.map(file => file.id!);
};
