"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePDF = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const parsePDF = async (filePath) => {
    const buffer = fs_1.default.readFileSync(filePath);
    const data = await (0, pdf_parse_1.default)(buffer);
    return data.text.split("\n").filter(Boolean);
};
exports.parsePDF = parsePDF;
