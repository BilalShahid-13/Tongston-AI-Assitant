import { Request, Response } from "express";
import { connectMongo } from "../lib/connectDb";
import { generateEmbedding } from "../lib/generateEmbedding";
import { OpenAIStream } from "../lib/openaiStream";
import { assessmentPlanPrompt } from "../lib/prompts";
import { cosineSimilarity } from "../utils/cosineSimilarity";
import openai from "../lib/openai";


async function generateFallbackResponse(query: Object): Promise<string> {
  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: JSON.stringify(query),
      max_tokens: 150,
    });
    return completion.choices[0].text.trim();
  } catch (error: any) {
    throw new Error(
      "Error generating fallback response: " + (error.message || error)
    );
  }
}

async function searchAssessmentPlanKnowledgeBase(req: Request, res: Response): Promise<void> {
  const {
    assessmentType,
    location,
    schoolCurriculum,
    yearClass,
    schoolLevel,
    subSchoolLevel,
    studentAge,
    classesSocioEconoic,
    term,
    termTheme,
    subject,
    subjectDiscipline,
    subjectUnitTopic,
    subjectSubTopic,
    bloom,
    subjectLearning,
    timeAvailable,
    sen,
    noOfStudents,
    severity,
    supportProvide,
    PreferredCommuniation,
    mobility,
    sensory,
    socialInteraction,
    cognitive,
    medical,
    IEP,
    send,
    cbtTest,
    examination,
    totalQuesions,
    questionTypes,
    maxAnswer,
    answerProvided,
    nationalTest
  } = req.body;

  // Set headers for streaming response
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const requiredFields = {
    assessmentType,
    location,
    schoolCurriculum,
    yearClass,
    schoolLevel,
    subSchoolLevel,
    studentAge,
    // classesSocioEconoic,
    term,
    termTheme,
    subject,
    subjectDiscipline,
    subjectUnitTopic,
    bloom,
    // subjectLearning,
    timeAvailable,
    totalQuesions,
    questionTypes,
  };

  // Find missing fields
  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => value === undefined || value === null || value === '')
    .map(([key]) => key);

  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Missing required fields',
      missingFields
    });
  }

  try {
    const queryEmbedding = await generateEmbedding(
      [
        assessmentType,
        location,
        schoolCurriculum,
        yearClass,
        schoolLevel,
        subSchoolLevel,
        studentAge,
        // classesSocioEconoic,
        term,
        termTheme,
        subject,
        subjectDiscipline,
        subjectUnitTopic,
        subjectSubTopic,
        bloom,
        subjectLearning,
        timeAvailable,
        sen,
        noOfStudents,
        severity,
        supportProvide,
        PreferredCommuniation,
        mobility,
        sensory,
        socialInteraction,
        cognitive,
        medical,
        IEP,
        send,
        cbtTest,
        examination,
        totalQuesions,
        questionTypes,
        maxAnswer,
        answerProvided,
        nationalTest
      ]
        .filter(Boolean)
        .join(" ")
    );

    const collection = await connectMongo();
    const documents = await collection.find({}).toArray();

    if (documents.length === 0) {
      res.status(404);
      res.write(
        `data: ${JSON.stringify({
          error: "No documents found in the collection",
        })}\n\n`
      );
      res.end(); // Terminate the response stream
      return;
    }

    const similarites = documents.map((doc: any) => {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      return {
        ...doc,
        similarity,
      };
    });

    similarites.sort((a: any, b: any) => b.similarity - a.similarity);

    let prompt: string;
    if (similarites.length === 0 || similarites[0].similarity < 0.5) {
      prompt = await generateFallbackResponse({
        assessmentType,
        location,
        schoolCurriculum,
        yearClass,
        schoolLevel,
        subSchoolLevel,
        studentAge,
        // classesSocioEconoic,
        term,
        termTheme,
        subject,
        subjectDiscipline,
        subjectUnitTopic,
        bloom,
        subjectLearning,
        timeAvailable,
        totalQuesions,
        questionTypes,
      });
    } else {
      prompt = `
        Discipline: ${similarites[0].Discipline},
        type of assessment: ${assessmentType},
        location:${location},
        School Level:${schoolLevel},
        Sub School Level:${subSchoolLevel},
        Students Average Age (Years):${studentAge},
        Term:${term},
        Term Theme:${termTheme},
        Subject:${subject},
        Subject Dicipline:${subjectDiscipline},
        Subject Unit/Topic:${subjectUnitTopic},
        Subject Sub-Unit/Sub-Topic:${subjectUnitTopic},
        Subject Level of Difficulty for the Learning / Lesson Objectives (using Blooms Taxonomy):${bloom},
        Subject Learning/Lesson Objectives:${subjectLearning},
        timeAvailable:${timeAvailable},
        Total Number of Qustions/Activities:${totalQuesions},
        Types of Questions:${questionTypes},
        subject: ${similarites[0].Subjects},
        class: ${similarites[0].Class},
        Description: ${similarites[0].Description},
        source: ${similarites[0].source},`;
    }

    const stream = await OpenAIStream(prompt, assessmentPlanPrompt);

    for await (const chunk of stream) {
      // Write each streamed chunk to the response
      res.write(chunk.choices?.[0]?.delta?.content || "");
    }
    res.end();
  } catch (error: any) {
    res.status(500);
    res.write(
      `data: ${JSON.stringify({
        error:
          "Server error during search: " + (error.message || "Unknown error"),
      })}\n\n`
    );
    res.end(); // Important: Terminate the response stream on error
  }
}

export { searchAssessmentPlanKnowledgeBase }