"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPdfFilesInFolder = void 0;
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
// const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, "../config/service-account.json"), // your JSON key path
//   scopes: SCOPES,
// });
// export const drive = google.drive({ version: "v3", auth });
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: path_1.default.join(__dirname, "../public/google-credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = googleapis_1.google.drive({ version: "v3", auth });
const listPdfFilesInFolder = async (folderId) => {
    const res = await drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
        fields: "files(id, name)",
        pageSize: 100,
    });
    const files = res.data.files || [];
    console.log(`📄 Found ${files.length} PDF(s) in folder ${folderId}`);
    return files.map(file => file.id);
};
exports.listPdfFilesInFolder = listPdfFilesInFolder;
