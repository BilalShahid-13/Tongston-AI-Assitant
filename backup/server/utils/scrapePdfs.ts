import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Db } from "mongodb";
import { loadPdfText } from "../lib/loadPdf";
import openai from "../lib/openai";
import { IScrapePdfs } from "../types";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
});

export const scrapePdfs = async (
  Link: string
): Promise<IScrapePdfs[]> => {
  const pdfContent = await loadPdfText(Link);
  const chunks = await splitter.splitText(pdfContent);

  const links: IScrapePdfs[] = [];

  for (const chunk of chunks) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
      encoding_format: "float"
    });

    const vector = embedding.data[0].embedding;

    links.push({
      content: chunk,
      $vector: vector,
      createdAt: new Date()
    });

  }
  return links;
};

// await db.collection(COLLECTION_NAME).insertOne({
//   Discipline,
//   DisciplineDescription,
//   Subject,
//   SubjectDescription,
//   NationalCurriculumSubjectMapping,
//   NationalCurriculumSubjectMapping_1,
//   NationalCurriculumSubjectMapping_2,
//   NationalCurriculumSubjectMapping_3,
//   NationalCurriculumSubjectMapping_4,
//   YearClass,
//   TypeOfExternalKnowledgeBase,
//   Topic,
//   Source,
//   Link,
//   OtherExternalResources,
//   content: chunk,
//   $vector: vector,
//   createdAt: new Date(),
// });
