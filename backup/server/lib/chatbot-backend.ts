
import express from 'express';
import { MongoClient, Collection, Document } from 'mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { KnowledgeBaseDocument, LessonPlanRequest } from '../types';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// MongoDB connection setup
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'k12_chatbot';
const COLLECTION_NAME = 'knowledge_base';
let collection: Collection<Document>;

// Initialize MongoDB client
async function connectToMongoDB() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
// Function to load knowledge base (unchanged from previous)
async function loadKnowledgeBase() {
  // Simulated knowledge base data (extend with full data from Excel)
  const knowledgeBase = [
    {
      discipline: 'Business & Entrepreneurship',
      subject: 'Business Studies & Commerce',
      class: 'Nursery One',
      description: 'This subject provides a comprehensive introduction to business operations...',
      resources: [
        {
          type: 'N/A',
          title: 'Not Available',
          source: '',
          link: '',
        },
      ],
      curriculum_mapping: ['No Direct Mapping', 'Entrepreneurship', 'Business Studies', 'Commerce'],
      year_class: 'Nursery One',
      term: 1,
      week: 1,
      topic: 'Introduction to Business',
      objectives: ['Define business', 'Identify simple business activities'],
    },
    // Add more entries
  ];

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const documents: KnowledgeBaseDocument[] = await Promise.all(
    knowledgeBase.map(async (entry) => {
      const text = `${entry.discipline} - ${entry.subject} (${entry.class}): ${entry.description} Topic: ${entry.topic}`;
      const vector = await embeddings.embedQuery(text);
      return {
        _id: uuidv4(),
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
          objectives: entry.objectives,
        },
      };
    })
  );

  try {
    await collection.deleteMany({});
    await collection.insertMany(documents);
    console.log('Knowledge base loaded into MongoDB');
  } catch (error) {
    console.error('Error loading knowledge base:', error);
  }
}

// Initialize LangChain components
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection,
  indexName: 'vector_index',
});

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the lesson plan prompt template
const lessonPlanPrompt = PromptTemplate.fromTemplate(`
You are an expert K12 education assistant tasked with generating a SMART lesson plan that is Specific, Measurable, Achievable, Relevant, and Time-bound. The lesson plan must incorporate Multiple Intelligences (linguistic, logical-mathematical, spatial, bodily-kinesthetic, musical, interpersonal, intrapersonal, naturalistic) and 21st Century skills (critical thinking, collaboration, communication, creativity, digital literacy). The plan must align with the following parameters:

**Parameters**:
- Location: {location}
- State: {state}
- Setting: {setting}
- School Branding: Mission: {mission}, Vision: {vision}, Core Values: {coreValues}, Curriculum Type: {curriculumType}
- Year/Class: {yearClass}
- School Level: {schoolLevel}
- School Sub-Level: {schoolSubLevel}
- Students’ Average Age: {studentsAverageAge}
- Socio-Economic Context: {socioEconomicContext}
- Week: {week}
- Term: {term} (Theme: {termTheme})
- Subject: {subject}
- Discipline: {discipline}
- Topic: {topic}
- Sub-Topic: {subTopic}
- Aim/Goal/Rationale: {aim}
- Pre-Requisite Competence: {preRequisiteCompetence}
- Difficulty Level (Bloom’s Taxonomy): {difficultyLevel}
- Learning Objectives: {learningObjectives}
- Technology Available: {technologyAvailable}
- Class Size: {classSize}
- Time Available: {timeAvailable}
- Teaching Aids: {teachingAids}
- SEN Differentiation: {senDifferentiation}
- Assessments: {assessments}
- Teacher Activities: {teacherActivities} (Max: {maxTeacherActivities})
- Student Activities: {studentActivities} (Max: {maxStudentActivities})
- Lecture Notes: {lectureNotes}

**Context from Knowledge Base**:
{context}

**Instructions**:
1. Generate a comprehensive SMART lesson plan tailored to the parameters.
2. Ensure activities address Multiple Intelligences and 21st Century skills.
3. Align learning objectives with the curriculum type and Bloom’s Taxonomy level.
4. Adapt activities for class size, time, and technology availability.
5. Include SEN differentiation if specified, tailoring activities and assessments.
6. Incorporate assessments (diagnostic, formative, or summative) with specified question types and formats.
7. If lecture notes are requested, provide concise notes summarizing key points.
8. Use resources from the knowledge base where applicable.

**Output Format** (JSON):
{
  "metadata": { ... },
  "lessonDetails": { ... },
  "learningObjectives": [...],
  "activities": {
    "teacher": [...],
    "student": [...]
  },
  "assessments": [...],
  "resources": [...],
  "notes": string (optional)
}
`);

// Create the lesson plan chain
const lessonPlanChain = RunnableSequence.from([
  {
    // Extract input parameters
    location: (input: LessonPlanRequest) => input.location || 'Not specified',
    state: (input: LessonPlanRequest) => input.state || 'Not specified',
    setting: (input: LessonPlanRequest) => input.setting || 'Not specified',
    mission: (input: LessonPlanRequest) => input.schoolBranding?.mission || 'Not specified',
    vision: (input: LessonPlanRequest) => input.schoolBranding?.vision || 'Not specified',
    coreValues: (input: LessonPlanRequest) => input.schoolBranding?.coreValues || 'Not specified',
    curriculumType: (input: LessonPlanRequest) => input.schoolBranding?.curriculumType || 'Not specified',
    yearClass: (input: LessonPlanRequest) => input.yearClass,
    schoolLevel: (input: LessonPlanRequest) => input.schoolLevel,
    schoolSubLevel: (input: LessonPlanRequest) => input.schoolSubLevel,
    studentsAverageAge: (input: LessonPlanRequest) => input.studentsAverageAge,
    socioEconomicContext: (input: LessonPlanRequest) => input.socioEconomicContext,
    week: (input: LessonPlanRequest) => input.week,
    term: (input: LessonPlanRequest) => input.term,
    termTheme: (input: LessonPlanRequest) => input.termTheme,
    subject: (input: LessonPlanRequest) => input.subject,
    discipline: (input: LessonPlanRequest) => input.discipline,
    topic: (input: LessonPlanRequest) => input.topic,
    subTopic: (input: LessonPlanRequest) => input.subTopic || 'Not specified',
    aim: (input: LessonPlanRequest) => input.aim || 'Not specified',
    preRequisiteCompetence: (input: LessonPlanRequest) => input.preRequisiteCompetence || 'Not specified',
    difficultyLevel: (input: LessonPlanRequest) => input.difficultyLevel || 'Not specified',
    learningObjectives: (input: LessonPlanRequest) => input.learningObjectives?.join('; ') || 'Not specified',
    technologyAvailable: (input: LessonPlanRequest) => input.technologyAvailable ? 'Yes' : 'No',
    classSize: (input: LessonPlanRequest) => input.classSize,
    timeAvailable: (input: LessonPlanRequest) => input.timeAvailable,
    teachingAids: (input: LessonPlanRequest) => input.teachingAids.join(', ') || 'None',
    senDifferentiation: (input: LessonPlanRequest) => JSON.stringify(input.senDifferentiation) || 'None',
    assessments: (input: LessonPlanRequest) => JSON.stringify(input.assessments) || 'None',
    teacherActivities: (input: LessonPlanRequest) => input.teacherActivities ? 'Yes' : 'No',
    maxTeacherActivities: (input: LessonPlanRequest) => input.maxTeacherActivities || 0,
    studentActivities: (input: LessonPlanRequest) => input.studentActivities ? 'Yes' : 'No',
    maxStudentActivities: (input: LessonPlanRequest) => input.maxStudentActivities || 0,
    lectureNotes: (input: LessonPlanRequest) => input.lectureNotes ? 'Yes' : 'No',
    context: async (input: LessonPlanRequest) => {
      const query = `${input.discipline} ${input.subject} ${input.yearClass} ${input.topic} Term ${input.term} Week ${input.week}`;
      const results = await vectorStore.similaritySearch(query, 3);
      return results.map((doc) => `
        Discipline: ${doc.discipline}
        Subject: ${doc.subject}
        Class: ${doc.class}
        Description: ${doc.description}
        Topic: ${doc.metadata.topic}
        Objectives: ${doc.metadata.objectives?.join(', ')}
        Resources: ${JSON.stringify(doc.resources)}
      `).join('\n\n');
    },
  },
  lessonPlanPrompt,
  llm,
  new StringOutputParser(),
]);

// API endpoint for lesson plan generation


// Start the server
async function startServer() {
  await connectToMongoDB();
  await loadKnowledgeBase();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();