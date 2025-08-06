"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadGoogleDoc = void 0;
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const downloadGoogleDoc = async () => {
    const url = `https://docs.google.com/document/d/${process.env.DOC_ID}/export?format=pdf`;
    const filePath = path_1.default.join("downloads", "client-doc.pdf");
    const response = await axios_1.default.get(url, { responseType: "stream" });
    const writer = fs_1.default.createWriteStream(filePath);
    await new Promise((resolve) => response.data.pipe(writer).on("finish", resolve));
    return filePath;
};
exports.downloadGoogleDoc = downloadGoogleDoc;
