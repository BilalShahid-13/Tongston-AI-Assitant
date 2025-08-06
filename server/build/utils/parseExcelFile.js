"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcelLink = exports.parseExcel = void 0;
exports.parseExcelFile = parseExcelFile;
const XLSX = __importStar(require("xlsx"));
function parseExcelFile(filePath) {
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
    const filteredData = rawData.map((row) => {
        const filteredRow = {};
        for (const key of allowedKeys) {
            filteredRow[key] = row[key] ?? "";
        }
        return filteredRow;
    });
    return filteredData;
}
const parseExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["External Knowledge base"];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return rows.map((row) => row.join(" ")).filter(Boolean);
};
exports.parseExcel = parseExcel;
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
const parseExcelLink = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets["External Knowledge base"];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Column "O" is index 14
    return rows
        .map((row) => row[14]) // Extract only column O
        .filter((cell) => typeof cell === "string" && cell.trim() !== ""); // Filter out empty or non-string cells
};
exports.parseExcelLink = parseExcelLink;
