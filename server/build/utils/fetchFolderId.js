"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDriveFolderId = extractDriveFolderId;
exports.extractDriveFileId = extractDriveFileId;
exports.isDriveFolderLink = isDriveFolderLink;
exports.isDriveFileLink = isDriveFileLink;
exports.getGoogleDriveDirectDownload = getGoogleDriveDirectDownload;
function extractDriveFolderId(url) {
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}
function extractDriveFileId(link) {
    const match = link.match(/\/file\/d\/([^/]+)\//);
    return match ? match[1] : null;
}
function isDriveFolderLink(link) {
    return link.includes("drive.google.com/drive/folders/");
}
function isDriveFileLink(link) {
    return link.includes("drive.google.com/file/d/");
}
function getGoogleDriveDirectDownload(link) {
    const match = link.match(/\/d\/([^/]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return link; // fallback if not Google Drive
}
