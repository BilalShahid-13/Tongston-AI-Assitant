import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { extractDriveFolderId, getGoogleDriveDirectDownload, isDriveFileLink, isDriveFolderLink } from "../utils/fetchFolderId";
import { fetchPdfUrls } from "../utils/fetchPdfs";
import { parseExcelFile } from "../utils/parseExcelFile";
import { connectMongo } from "./connectDb";
import { loadPdfText } from "./loadPdf";
import openai from "./openai";

export const insertKnowledgeBase = async (path: string) => {
  const COLLECTION_NAME = process.env.COLLECTION_NAME as string;
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
  });
  try {
    const db = await connectMongo();
    if (!db) throw new Error("Failed to connect to MongoDB");

    const data = parseExcelFile(path);
    // const data: KnowledgeBaseEntry[] = parseExcelFile(path);
    if (!data || data.length === 0) throw new Error("No valid data found in Excel file");

    for (const row of data) {
      const {
        Discipline,
        DisciplineDescription,
        Subject,
        SubjectDescription,
        NationalCurriculumSubjectMapping,
        NationalCurriculumSubjectMapping_1,
        NationalCurriculumSubjectMapping_2,
        NationalCurriculumSubjectMapping_3,
        NationalCurriculumSubjectMapping_4,
        YearClass,
        TypeOfExternalKnowledgeBase,
        Topic,
        Source,
        Link,
        OtherExternalResources
      } = row;
      const trimmedLink = Link?.trim(); // 🧼 Trim whitespace

      if (!Link || // empty or undefined
        Link.trim() === "" || Link === "") {
        // Store metadata only
        await db.collection(COLLECTION_NAME).insertOne({
          Discipline: row["Discipline"],
          DisciplineDescription: row["Discipline Description"],
          Subject: row["Subject"],
          SubjectDescription: row["Subject Description"],
          NationalCurriculumSubjectMapping: row["National Curriculum Subject Mapping"],
          NationalCurriculumSubjectMapping_1: row["National Curriculum Subject Mapping_1"],
          NationalCurriculumSubjectMapping_2: row["National Curriculum Subject Mapping_2"],
          NationalCurriculumSubjectMapping_3: row["National Curriculum Subject Mapping_3"],
          NationalCurriculumSubjectMapping_4: row["National Curriculum Subject Mapping_4"],
          YearClass: row["Year/Class"],
          TypeOfExternalKnowledgeBase: row["Type of External Knowledge Base"],
          Topic: row["Topic"],
          Source: row["Source"],
          Link: row["Link"],
          OtherExternalResources: row["Other External Resources"],
          content: null,
          $vector: null,
          createdAt: new Date(),
        });
        continue;
      }

      try {
        if (
          isDriveFolderLink(Link) // folder link, not a file
        ) {
          const folderId = extractDriveFolderId(Link);
          if (!folderId) {
            console.warn(`⚠️ Invalid folder ID in link: ${Link}`);
            break;
          };
          const files = await fetchPdfUrls(folderId);
          for await (const file of files) {
            const content = await loadPdfText(file.url);
            const chunks = await splitter.splitText(content);

            for (const chunk of chunks) {
              const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
              });

              const vector = embedding.data[0].embedding;

              await db.collection(COLLECTION_NAME).insertOne({
                Discipline: row["Discipline"],
                DisciplineDescription: row["Discipline Description"],
                Subject: row["Subject"],
                SubjectDescription: row["Subject Description"],
                NationalCurriculumSubjectMapping: row["National Curriculum Subject Mapping"],
                NationalCurriculumSubjectMapping_1: row["National Curriculum Subject Mapping_1"],
                NationalCurriculumSubjectMapping_2: row["National Curriculum Subject Mapping_2"],
                NationalCurriculumSubjectMapping_3: row["National Curriculum Subject Mapping_3"],
                NationalCurriculumSubjectMapping_4: row["National Curriculum Subject Mapping_4"],
                YearClass: row["Year/Class"],
                TypeOfExternalKnowledgeBase: row["Type of External Knowledge Base"],
                Topic: row["Topic"],
                Source: row["Source"],
                Link: file.url,
                content: chunk,
                $vector: vector,
                OtherExternalResources,
                createdAt: new Date(),
              });
            }
          }
        }
        else if (isDriveFileLink(Link)) {
          const fileUrl = getGoogleDriveDirectDownload(Link);
          if (!fileUrl) {
            break;
          }
          const content = await loadPdfText(fileUrl);
          const chunks = await splitter.splitText(content);

          for (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
              model: "text-embedding-3-small",
              input: chunk,
              encoding_format: "float"
            });

            const vector = embedding.data[0].embedding;

            await db.collection(COLLECTION_NAME).insertOne({
              Discipline: row["Discipline"],
              DisciplineDescription: row["Discipline Description"],
              Subject: row["Subject"],
              SubjectDescription: row["Subject Description"],
              NationalCurriculumSubjectMapping: row["National Curriculum Subject Mapping"],
              NationalCurriculumSubjectMapping_1: row["National Curriculum Subject Mapping_1"],
              NationalCurriculumSubjectMapping_2: row["National Curriculum Subject Mapping_2"],
              NationalCurriculumSubjectMapping_3: row["National Curriculum Subject Mapping_3"],
              NationalCurriculumSubjectMapping_4: row["National Curriculum Subject Mapping_4"],
              YearClass: row["Year/Class"],
              TypeOfExternalKnowledgeBase: row["Type of External Knowledge Base"],
              Topic: row["Topic"],
              Source: row["Source"],
              Link: fileUrl,
              content: chunk,
              $vector: vector,
              OtherExternalResources,
              createdAt: new Date(),
            });
          }
        }


        console.log(`✅ Processed PDF and metadata: ${Topic}`);
      } catch (pdfErr) {
        console.warn(`⚠️ Failed to process PDF at ${Link}:`, pdfErr);
      }
    }

  } catch (error) {
    console.error("❌ insertKnowledgeBase failed:", error);
    throw error;
  }
};
