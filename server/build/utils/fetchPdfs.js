"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPdfUrls = fetchPdfUrls;
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: path_1.default.join(__dirname, '../public/google-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const drive = googleapis_1.google.drive({ version: 'v3', auth });
async function fetchPdfUrls(folderId) {
    const res = await drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/pdf'`,
        fields: 'files(id, name)'
    });
    return res.data.files?.map(file => ({
        name: file.name,
        url: `https://drive.google.com/uc?id=${file.id}&export=download`
    })) ?? [];
}
