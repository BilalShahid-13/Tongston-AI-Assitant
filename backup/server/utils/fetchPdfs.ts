import { google } from "googleapis";
import path from "path";


const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../public/google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const drive = google.drive({ version: 'v3', auth });
export async function fetchPdfUrls(folderId: string|null) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/pdf'`,
    fields: 'files(id, name)'
  });
  return res.data.files?.map(file => ({
    name: file.name,
    url: `https://drive.google.com/uc?id=${file.id}&export=download`
  })) ?? [];
}