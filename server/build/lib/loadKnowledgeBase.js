"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const xlsx_1 = __importDefault(require("xlsx"));
const connectDb_1 = require("./connectDb");
const fetchFolderId_1 = require("../utils/fetchFolderId");
// Load environment variables
dotenv_1.default.config();
let db;
// Google Drive API setup
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: path_1.default.join(__dirname, '../public/google-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = googleapis_1.google.drive({ version: 'v3', auth });
// Function to download and extract text from a single PDF
async function extractPdfContent(link) {
    try {
        // Handle both original and direct download URLs
        const fileIdMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
        if (!fileIdMatch)
            throw new Error('Invalid Google Drive link');
        const fileId = fileIdMatch[1] || fileIdMatch[2];
        const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const pdfData = await (0, pdf_parse_1.default)(buffer);
        return pdfData.text.substring(0, 10000); // Limit to 10k chars
    }
    catch (error) {
        console.error(`Error extracting PDF content from ${link}:`, error);
        return null; // Return null for corrupted or inaccessible PDFs
    }
}
// Function to list and extract content from all PDFs in a Google Drive folder
async function extractFolderContent(folderLink) {
    try {
        const folderIdMatch = folderLink.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (!folderIdMatch)
            throw new Error('Invalid Google Drive folder link');
        const folderId = folderIdMatch[1];
        const response = await drive.files.list({
            q: `'${folderId}' in parents and mimeType='application/pdf'`,
            fields: 'files(id, name, webViewLink)',
        });
        const files = response.data.files || [];
        console.log(`Found ${files.length} PDFs in folder ${folderLink}`);
        const contents = await Promise.all(files.map(async (file) => {
            const fileLink = file.webViewLink || `https://drive.google.com/file/d/${file.id}`;
            return await extractPdfContent(fileLink);
        }));
        return contents.filter((content) => content !== null);
    }
    catch (error) {
        console.error(`Error extracting folder content from ${folderLink}:`, error);
        return [];
    }
}
// Function to check if a string is valid JSON
function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    }
    catch {
        return false;
    }
}
// Function to load and insert knowledge base
async function loadKnowledgeBaseFromExcel(filePath) {
    try {
        // Read the Excel file
        console.log(`Reading Excel file: ${filePath}`);
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetNames = ['External Knowledge base']; // Target only External Knowledge base sheet
        const knowledgeBase = [];
        // Process the specified sheet
        for (const sheetName of sheetNames) {
            if (!workbook.Sheets[sheetName]) {
                console.error(`Sheet ${sheetName} not found in Excel file`);
                continue;
            }
            console.log(`Processing sheet: ${sheetName}`);
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx_1.default.utils.sheet_to_json(sheet);
            console.log(`Found ${data.length} rows in sheet ${sheetName}`);
            for (const row of data) {
                const typedRow = row;
                let resources = [];
                // Handle the 'Link' column
                if (typedRow['Link']) {
                    if (isValidJson(typedRow['Link'])) {
                        const resourcesRaw = JSON.parse(typedRow['Link']);
                        resources = Array.isArray(resourcesRaw) ? resourcesRaw : [resourcesRaw];
                    }
                    else {
                        resources = [
                            {
                                link: typedRow['Link'],
                                type: 'Unknown',
                                title: 'Unknown',
                                source: 'Unknown',
                            },
                        ];
                    }
                }
                const curriculumMapping = typedRow['Curriculum Mapping']
                    ? typedRow['Curriculum Mapping'].split(',').map((item) => item.trim())
                    : [];
                // Fetch content from linked resources
                const enrichedResources = await Promise.all(resources.map(async (resource) => {
                    let content = null;
                    if (resource.link) {
                        console.log(`Processing resource link: ${resource.link}`);
                        if ((0, fetchFolderId_1.isDriveFolderLink)(resource.link)) {
                            const folderContents = await extractFolderContent(resource.link);
                            content = folderContents.filter((c) => c !== null).join(' ') || null;
                        }
                        else if ((0, fetchFolderId_1.isDriveFileLink)(resource.link)) {
                            const fileUrl = (0, fetchFolderId_1.getGoogleDriveDirectDownload)(resource.link);
                            content = await extractPdfContent(fileUrl);
                        }
                        else {
                            console.warn(`Skipping invalid link: ${resource.link}`);
                        }
                    }
                    return {
                        ...resource,
                        content,
                    };
                }));
                const document = {
                    discipline: typedRow['Discipline'] || 'Unknown',
                    subject: typedRow['Subject'] || 'Unknown',
                    class: typedRow['Class'] || 'Unknown',
                    description: typedRow['Description'] || '',
                    resources: enrichedResources,
                    curriculum_mapping: curriculumMapping,
                    year_class: typedRow['Year/Class'] || typedRow['Class'] || 'Unknown',
                    term: typedRow['Term'] ? parseInt(typedRow['Term']) : undefined,
                    week: typedRow['Week'] ? parseInt(typedRow['Week']) : undefined,
                    topic: typedRow['Topic'] || undefined,
                };
                knowledgeBase.push(document);
                console.log(`Created document for ${document.discipline} - ${document.subject} (${document.class})`);
            }
        }
        console.log(`Total documents created: ${knowledgeBase.length}`);
        if (knowledgeBase.length === 0) {
            console.warn('No documents created from Excel file');
            return;
        }
        // Initialize OpenAI embeddings
        console.log('Initializing OpenAI embeddings...');
        let embeddings;
        try {
            embeddings = new openai_1.OpenAIEmbeddings({
                apiKey: process.env.OPEN_AI_URI,
            });
        }
        catch (error) {
            console.error('Failed to initialize OpenAI embeddings:', error);
            throw error;
        }
        // Generate embeddings for each document
        console.log('Generating embeddings...');
        const documents = await Promise.all(knowledgeBase.map(async (entry) => {
            const resourceContent = entry.resources
                .map((r) => r.content || '')
                .filter((c) => c !== null)
                .join(' ');
            const text = `${entry.discipline} - ${entry.subject} (${entry.class}): ${entry.description} Topic: ${entry.topic || ''} Resources: ${resourceContent}`;
            let vector = [];
            try {
                vector = await embeddings.embedQuery(text);
                console.log(`Generated embedding for ${entry.discipline} - ${entry.subject} (${entry.class})`);
            }
            catch (error) {
                console.error(`Error generating embedding for ${entry.discipline} - ${entry.subject} (${entry.class}):`, error);
            }
            return {
                discipline: entry.discipline,
                subject: entry.subject,
                class: entry.class,
                description: entry.description,
                resources: entry.resources,
                vector,
                metadata: {
                    curriculum_mapping: entry.curriculum_mapping,
                    year_class: entry.year_class,
                    term: entry.term,
                    week: entry.week,
                    topic: entry.topic,
                },
            };
        }));
        // Filter out documents with empty vectors
        const validDocuments = documents.filter((doc) => doc.vector.length > 0);
        console.log(`Valid documents with embeddings: ${validDocuments.length}`);
        // Insert documents into MongoDB
        console.log('Deleting existing documents in grok_knowledge_base...');
        try {
            await db.collection('grok_knowledge_base').deleteMany({});
        }
        catch (error) {
            console.error('Error deleting existing documents:', error);
        }
        console.log('Inserting documents...');
        if (validDocuments.length === 0) {
            console.warn('No valid documents with embeddings. Inserting without vectors...');
            for (let i = 0; i < documents.length; i++) {
                const doc = { ...documents[i], vector: [] }; // Empty vector for fallback
                console.log(`Inserting fallback document ${i + 1} for ${doc.discipline} - ${doc.subject} (${doc.class})`);
                try {
                    const result = await db.collection('grok_knowledge_base').insertOne(doc);
                    console.log(`Inserted fallback document ${i + 1} with ID: ${result.insertedId}`);
                }
                catch (error) {
                    console.error(`Error inserting fallback document ${i + 1} for ${doc.discipline} - ${doc.subject} (${doc.class}):`, error);
                }
            }
            console.log(`Loaded ${documents.length} fallback documents into MongoDB`);
        }
        else {
            for (let i = 0; i < validDocuments.length; i++) {
                const doc = validDocuments[i];
                console.log(`Inserting document ${i + 1} for ${doc.discipline} - ${doc.subject} (${doc.class})`);
                try {
                    const result = await db.collection('grok_knowledge_base').insertOne(doc);
                    console.log(`Inserted document ${i + 1} with ID: ${result.insertedId}`);
                }
                catch (error) {
                    console.error(`Error inserting document ${i + 1} for ${doc.discipline} - ${doc.subject} (${doc.class}):`, error);
                }
            }
            console.log(`Loaded ${validDocuments.length} documents into MongoDB`);
        }
        // Verify collection exists
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some((col) => col.name === 'grok_knowledge_base');
        console.log(`Collection grok_knowledge_base exists: ${collectionExists}`);
    }
    catch (error) {
        console.error('Error loading knowledge base from Excel:', error);
        throw error;
    }
}
// Main function to execute Step 1
async function main() {
    try {
        db = await (0, connectDb_1.connectMongo)();
        const excelFilePath = path_1.default.join(__dirname, '../public/AI Chatbot (K12) Knowledge base sort sheet.xlsx');
        await loadKnowledgeBaseFromExcel(excelFilePath);
    }
    catch (error) {
        console.error('Main function error:', error);
    }
    finally {
        console.log('Script execution completed');
    }
}
main().catch(console.error);
