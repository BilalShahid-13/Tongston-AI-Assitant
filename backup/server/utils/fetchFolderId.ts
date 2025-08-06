export function extractDriveFolderId(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function extractDriveFileId(link: string): string | null {
  const match = link.match(/\/file\/d\/([^/]+)\//);
  return match ? match[1] : null;
}

export function isDriveFolderLink(link: string): boolean {
  return link.includes("drive.google.com/drive/folders/");
}

export function isDriveFileLink(link: string): boolean {
  return link.includes("drive.google.com/file/d/");
}

export function getGoogleDriveDirectDownload(link: string): string {
  const match = link.match(/\/d\/([^/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return link; // fallback if not Google Drive
}
