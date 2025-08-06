import * as XLSX from "xlsx";
import { KnowledgeBaseEntry } from "../types";
export function parseExcelFile(filePath: string): any[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["External Knowledge base"]; // Target sheet
  const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  // List of desired columns (A to O correspond to 15 columns)
  const allowedKeys = [
    "Discipline",
    "Discipline Description",
    "Subject",
    "Subject Description",
    "National Curriculum Subject Mapping",
    "National Curriculum Subject Mapping_1",
    "National Curriculum Subject Mapping_2",
    "National Curriculum Subject Mapping_3",
    "National Curriculum Subject Mapping_4",
    "Year/Class",
    "Type of External Knowledge Base",
    "Topic",
    "Source",
    "Link",
    "Other External Resources"
  ];

  // Filter each row to keep only allowed keys
  const filteredData: KnowledgeBaseEntry[] = rawData.map((row: any) => {
    const filteredRow: any = {};
    for (const key of allowedKeys) {
      filteredRow[key] = row[key] ?? "";
    }
    return filteredRow;
  });

  return filteredData;
}


export const parseExcel = (filePath: string): string[] => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["External Knowledge base"];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  return rows.map((row: any[]) => row.join(" ")).filter(Boolean);
};

// import { google } from "googleapis";
// import path from "path";
// interface SheetRow {
//   [key: string]: string;
// }

// export const parseExcelFile = async (): Promise<any[] | undefined> => {
//   // export const parseExcelFile = async (): Promise<SheetRow[]> => {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       keyFile: path.join(__dirname, '../public/google-credentials.json'),
//       scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
//     });

//     // const client = await auth.getClient();
//     const client = (await auth.getClient()) as import('google-auth-library').OAuth2Client;
//     const sheets = google.sheets({ version: 'v4', auth: client });

//     const spreadsheetId = '1s4fUuWotKPWAqbF0HWntmV1zvbZXQXxy8wAh0Soy6qI';
//     // const spreadsheetId = '1s4fUuWotKPWAqbF0HWntmV1zvbZXQXxy8wAh0Soy6qI';
//     const sheetName = 'External Knowledge base';
//     const range = `${sheetName}!A1:Z1000`; // Expand range if needed

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range
//     });

//     const rows = response.data.values;
//     if (!rows || rows.length === 0) {
//       console.log('empty')
//       return;
//     };
//     // if (!rows || rows.length === 0) return [];

//     const headers = rows[0];
//     const data = rows.slice(1).map(row => {
//       const rowObj: SheetRow = {};
//       headers.forEach((header, i) => {
//         rowObj[header.trim()] = row[i]?.trim() || '';
//       });
//       return rowObj;
//     });

//     return data;
//     // console.log(data[3])
//   } catch (error) {
//     console.error('Error parsing Google Sheet:', error);
//     // return [];
//   }
// };

export const parseExcelLink = (filePath: string): string[] => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["External Knowledge base"];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  // Column "O" is index 14
  return rows
    .map((row: any[]) => row[14]) // Extract only column O
    .filter((cell) => typeof cell === "string" && cell.trim() !== ""); // Filter out empty or non-string cells
};
