// import { Request, Response } from "express";
// import { connectMongo } from "../lib/connectDb";
// import { generateEmbedding } from "../lib/generateEmbedding";
// import openai from "../lib/openai";
// import { OpenAIStream } from "../lib/openaiStream";
// import { lessonPlanPrompt, promptTemplate } from "../lib/prompts";

// function cosineSimilarity(a: number[], b: number[]): number {
//   const dotProduct = a.reduce((sum, aVal, index) => sum + aVal * b[index]);
//   const normA = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
//   const normB = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
//   return dotProduct / (normA * normB);
// }

// async function searchLessonPlanKnowledgeBase(req: Request, res: Response): Promise<void> {
//   const {
//     query,
//     bloomLevel,
//     classSize,
//     classesSocioEconomic,
//     curriculum,
//     location,
//     schoolLevel,
//     studentAge,
//     subSchoolLevel,
//     subject,
//     subjectDicipline,
//     term,
//     termTheme,
//     timeAvailable,
//     week,
//     yearClass
//   } = req.body;

//   let docContext = "";
//   // Set headers for streaming response
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   try {
//     const queryText = [
//       bloomLevel,
//       classSize,
//       classesSocioEconomic,
//       curriculum,
//       location,
//       schoolLevel,
//       studentAge,
//       subSchoolLevel,
//       subject,
//       subjectDicipline,
//       term,
//       termTheme,
//       timeAvailable,
//       week,
//       yearClass
//     ].filter(Boolean).join(" ");

//     const queryVector = await generateEmbedding(queryText);
//     const db = await connectMongo();
//     const documents = await db.collection(process.env.COLLECTION_NAME!).aggregate([
//       {
//         $vectorSearch: {
//           index: "vector_index_2",
//           path: "$vector",
//           queryVector,
//           numCandidates: 100,
//           limit: 5
//         }
//       },
//       {
//         $project: {
//           content: 1,
//           Discipline: 1,
//           Subject: 1,
//           YearClass: 1,
//           SubjectDescription: 1,
//           Link: 1,
//           // similarity: { $meta: "vectorSimilarity" }
//         }
//       }
//     ]).toArray();
//     console.log("Embedding length:", queryVector.length);
//     console.log("queryVector", queryVector);

//     if (!documents.length) {
//       res.status(404).write(`data: ${JSON.stringify({ error: "No documents found." })}\n\n`);
//       res.end();
//       return;
//     }
//     const docContext = documents.map(doc => doc.content).join("\n---\n");
//     const top = documents[0];

//     const prompt = documents[0].similarity < 0.5 ? query : `
// Discipline: ${top.Discipline},
// Subject: ${top.Subject},
// Class: ${top.YearClass},
// Description: ${top.SubjectDescription || "N/A"},
// Source: ${top.Link || "N/A"}`.trim();

//     const finalPrompt = promptTemplate(lessonPlanPrompt, docContext, prompt);
//     const stream = await OpenAIStream(prompt, finalPrompt);

//     for await (const chunk of stream) {
//       res.write(chunk.choices?.[0]?.delta?.content || "");
//     }

//     res.write("data: [DONE]\n\n");
//     res.end();
//   } catch (error: any) {
//     res.status(500);
//     res.write(
//       `data: ${JSON.stringify({
//         error:
//           "Server error during search: " + (error.message || "Unknown error"),
//       })}\n\n`
//     );
//     res.end(); // Important: Terminate the response stream on error
//   }
// }





import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import { generateEmbedding } from "../lib/generateEmbedding";
import { OpenAIStream } from "../lib/openaiStream";
import { promptTemplate, lessonPlanPrompt } from "../lib/prompts";

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, aVal, i) => sum + aVal * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, aVal) => sum + aVal * aVal, 0));
  const normB = Math.sqrt(b.reduce((sum, bVal) => sum + bVal * bVal, 0));
  return dotProduct / (normA * normB);
}

export async function searchLessonPlanKnowledgeBase(req: Request, res: Response): Promise<void> {
  const {
    query,
    // bloomLevel,
    // classSize,
    // classesSocioEconomic,
    // curriculum,
    // location,
    // schoolLevel,
    // studentAge,
    // subSchoolLevel,
    // subject,
    // subjectDicipline,
    // term,
    // termTheme,
    // timeAvailable,
    // week,
    // yearClass
  } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const inputText = [
      // const inputText = [
      // bloomLevel,
      // classSize,
      // classesSocioEconomic,
      // curriculum,
      // location,
      // schoolLevel,
      // studentAge,
      // subSchoolLevel,
      // subject,
      // subjectDicipline,
      // term,
      // termTheme,
      // timeAvailable,
      // week,
      // yearClass
    ].filter(Boolean).join(" ");

    const queryVector = await generateEmbedding(query);
    const db = await connectMongo();

    const documents = await db.collection("tongton_ai_assistant_knowledge_base").aggregate([
      {
        $vectorSearch: {
          index: "vector_index_2",             // Your Atlas vector index name
          path: "$vector",                      // Field storing embedding array
          queryVector: queryVector,            // The input embedding from OpenAI
          numCandidates: 100,                  // How many to initially compare
          limit: 5                             // How many top results to return
        }
      },
      {
        $project: {
          content: 1,
          Discipline: 1,
          Subject: 1,
          YearClass: 1,
          SubjectDescription: 1,
          Link: 1
          // Omit similarity if not supported in your tier
        }
      }
    ]).toArray();

    if (!documents.length) {
      res.status(404).write(`data: ${JSON.stringify({ error: "No documents found." })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    const ranked = documents.map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryVector, doc["$vector"]),
      content: doc.content,
      Discipline: doc.Discipline,
      Subject: doc.Subject,
      YearClass: doc.YearClass,
      SubjectDescription: doc.SubjectDescription,
      Link: doc.Link
    })).sort((a, b) => b.similarity - a.similarity).slice(0, 5);

    const docContext = ranked.map(doc => doc.content).join("\n---\n");
    const bestMatch = ranked[0];

    const prompt = bestMatch.similarity < 0.5 ? query : `
Discipline: ${bestMatch.Discipline},
Subject: ${bestMatch.Subject},
Class: ${bestMatch.YearClass},
Description: ${bestMatch.SubjectDescription || "N/A"},
Source: ${bestMatch.Link || "N/A"}`.trim();

    const finalPrompt = promptTemplate(lessonPlanPrompt, docContext, prompt);
    const stream = await OpenAIStream(prompt, finalPrompt);

    for await (const chunk of stream) {
      res.write(chunk.choices?.[0]?.delta?.content || "");
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error: any) {
    console.error("LessonPlan search error:", error.message || error);
    res.status(500).write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}







// export { searchLessonPlanKnowledgeBase };
