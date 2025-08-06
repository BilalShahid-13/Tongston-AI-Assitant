"use strict";
// export function parseExcelFile(filePath: string): any[] {
//   const workbook = XLSX.readFile(filePath);
//   const sheet = workbook.Sheets["External Knowledge base"]; // Getting the first sheet
//   // const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Getting the first sheet
//   return XLSX.utils.sheet_to_json(sheet); // Convert the sheet to JSON
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcelFile = void 0;
// import * as XLSX from "xlsx";
// export const parseExcel = (filePath: string): string[] => {
//   const workbook = XLSX.readFile(filePath);
//   const sheet = workbook.Sheets["Internal Knowledge Base"];
//   const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
//   return rows.map((row: any[]) => row.join(" ")).filter(Boolean);
// };
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const parseExcelFile = async () => {
    // export const parseExcelFile = async (): Promise<SheetRow[]> => {
    try {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.join(__dirname, '../public/google-credentials.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });
        // const client = await auth.getClient();
        const client = (await auth.getClient());
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth: client });
        const spreadsheetId = '1s4fUuWotKPWAqbF0HWntmV1zvbZXQXxy8wAh0Soy6qI';
        const sheetName = 'External Knowledge base';
        const range = `${sheetName}!A1:Z1000`; // Expand range if needed
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });
        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('empty');
            return;
        }
        ;
        // if (!rows || rows.length === 0) return [];
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const rowObj = {};
            headers.forEach((header, i) => {
                rowObj[header.trim()] = row[i]?.trim() || '';
            });
            return rowObj;
        });
        // return data;
        console.log(data);
    }
    catch (error) {
        console.error('Error parsing Google Sheet:', error);
        // return [];
    }
};
exports.parseExcelFile = parseExcelFile;
