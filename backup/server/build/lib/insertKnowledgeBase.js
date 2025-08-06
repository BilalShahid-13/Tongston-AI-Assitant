"use strict";
// import fs from "fs";
// import path from "path";
// import { parseExcelFile } from "../utils/parseExcelFile";
// import { connectMongo } from "./connectDb";
// import { generateEmbedding } from "./generateEmbedding";
// async function insertKnowledgeBaseFromExcel(fileUrl: string): Promise<void> {
//   try {
//     console.log("Starting to process file...");
//     // Resolve the file path
//     const filePath = path.resolve(__dirname, "public", fileUrl);
//     console.log(`Resolved file path: ${filePath}`);
//     // Check if file path is valid
//     if (!filePath) {
//       throw new Error("File path is required.");
//     }
//     // Check if the file exists
//     if (!fs.existsSync(filePath)) {
//       throw new Error(`File not found at path: ${filePath}`);
//     }
//     console.log("File found successfully.");
//     // Connect to MongoDB
//     const collection = await connectMongo();
//     console.log("Connected to MongoDB collection.");
//     // Parse the Excel file
//     const data = parseExcelFile(filePath);
//     if (!data || data.length === 0) {
//       throw new Error("No valid data found in the Excel file.");
//     }
//     console.log(`Parsed ${data.length} rows from Excel file.`);
//     // Prepare documents for insertion
//     const docs = [];
//     for (let row of data) {
//       // Extract the fields (ensure your Excel file has these columns)
//       const discipline = row?.Discipline || null;
//       const disciplineDescription = row?.["Discipline Description"] || null;
//       const subjects = row?.Subject || null;
//       const subjectDescription = row?.["Subject Description"] || null;
//       const className = row?.["Year/Class"] || null;
//       const nationalCurriculum =
//         row?.["National Curriculum Subject Mapping"] || null;
//       const topic = row?.Topic || null;
//       const source = row?.Source || null;
//       // Process the content (either from 'Content' or 'Text' or the entire row)
//       const chunk = row?.Content || row?.Text || JSON.stringify(row);
//       // Generate embedding for the content
//       const embedding = await generateEmbedding(chunk);
//       await collection.insertOne({
//         discipline,
//         disciplineDescription,
//         subjects,
//         subjectDescription,
//         className,
//         topic,
//         source,
//         embedding,
//         metadata: {
//           source: filePath,
//           nationalCurriculum,
//           timestamp: new Date(),
//         },
//       });
//     }
//     console.log("Knowledge base inserted successfully.");
//   } catch (error: any) {
//     // Log the actual error for debugging
//     console.error("Error inserting knowledge base:", error.message || error);
//     throw new Error(
//       "Error inserting knowledge base: " + (error.message || error)
//     );
//   }
// }
// const insertAllData = async () => {
//   try {
//     await insertKnowledgeBaseFromExcel(
//       "/media/bilal-shahid/New Volume/tongston june order/ai-assistant/server/public/k12 updated sheet.xlsx"
//     );
//   } catch (error: any) {
//     console.error(error);
//   }
// };
// export { insertAllData, insertKnowledgeBaseFromExcel };
// async function insertKnowledgeBaseFromExcel(fileUrl: string): Promise<void> {
//   try {
//     const filePath = path.resolve(__dirname, "public", fileUrl);
//     if (!filePath) {
//       throw new Error("File path is required.");
//     }
//     if (!fs.existsSync(filePath)) {
//       throw new Error(`File not found at path: ${filePath}`);
//     }
//     // Connect to MongoDB collection
//     const collection = await connectMongo();
//     // Parse the Excel file
//     const data = parseExcelFile();
//     if (!data || data.length === 0) {
//       throw new Error("No valid data found in the Excel file.");
//     }
//     // Prepare documents for insertion
//     const docs = [];
//     for (let row of data) {
//       const chunk = row?.Content || row?.Text || JSON.stringify(row); // Process content
//       const embedding = await generateEmbedding(chunk); // Get embedding for the content
//       docs.push({
//         content: chunk,
//         embedding,
//         metadata: {
//           source: filePath,
//           timestamp: new Date(),
//         },
//       });
//     }
//     // Insert documents into MongoDB
//     if (docs.length > 0) {
//       await collection.insertMany(docs);
//       console.log("Knowledge base inserted successfully");
//     } else {
//       throw new Error("No valid data found in the Excel file.");
//     }
//   } catch (error: any) {
//     // Log the actual error for debugging
//     console.error("Error inserting knowledge base:", error.message || error);
//     throw new Error(
//       "Error inserting knowledge base: " + (error.message || error)
//     );
//   }
// }
// export { insertKnowledgeBaseFromExcel };
