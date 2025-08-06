"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const openai_1 = require("@langchain/openai");
const mongodb_atlas_1 = require("@langchain/community/vectorstores/mongodb_atlas");
const openai_2 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const runnables_1 = require("@langchain/core/runnables");
const output_parsers_1 = require("@langchain/core/output_parsers");
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
// MongoDB connection setup
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'k12_chatbot';
const COLLECTION_NAME = 'knowledge_base';
let collection;
// Initialize MongoDB client
async function connectToMongoDB() {
    const client = new mongodb_1.MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(DB_NAME);
        collection = db.collection(COLLECTION_NAME);
    }
    catch (error) {
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
    const embeddings = new openai_1.OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const documents = await Promise.all(knowledgeBase.map(async (entry) => {
        const text = `${entry.discipline} - ${entry.subject} (${entry.class}): ${entry.description} Topic: ${entry.topic}`;
        const vector = await embeddings.embedQuery(text);
        return {
            _id: (0, uuid_1.v4)(),
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
    }));
    try {
        await collection.deleteMany({});
        await collection.insertMany(documents);
        console.log('Knowledge base loaded into MongoDB');
    }
    catch (error) {
        console.error('Error loading knowledge base:', error);
    }
}
// Initialize LangChain components
const embeddings = new openai_1.OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
});
const vectorStore = new mongodb_atlas_1.MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: 'vector_index',
});
const llm = new openai_2.ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
});
// Define the lesson plan prompt template
const lessonPlanPrompt = prompts_1.PromptTemplate.fromTemplate(`
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
const lessonPlanChain = runnables_1.RunnableSequence.from([
    {
        // Extract input parameters
        location: (input) => input.location || 'Not specified',
        state: (input) => input.state || 'Not specified',
        setting: (input) => input.setting || 'Not specified',
        mission: (input) => input.schoolBranding?.mission || 'Not specified',
        vision: (input) => input.schoolBranding?.vision || 'Not specified',
        coreValues: (input) => input.schoolBranding?.coreValues || 'Not specified',
        curriculumType: (input) => input.schoolBranding?.curriculumType || 'Not specified',
        yearClass: (input) => input.yearClass,
        schoolLevel: (input) => input.schoolLevel,
        schoolSubLevel: (input) => input.schoolSubLevel,
        studentsAverageAge: (input) => input.studentsAverageAge,
        socioEconomicContext: (input) => input.socioEconomicContext,
        week: (input) => input.week,
        term: (input) => input.term,
        termTheme: (input) => input.termTheme,
        subject: (input) => input.subject,
        discipline: (input) => input.discipline,
        topic: (input) => input.topic,
        subTopic: (input) => input.subTopic || 'Not specified',
        aim: (input) => input.aim || 'Not specified',
        preRequisiteCompetence: (input) => input.preRequisiteCompetence || 'Not specified',
        difficultyLevel: (input) => input.difficultyLevel || 'Not specified',
        learningObjectives: (input) => input.learningObjectives?.join('; ') || 'Not specified',
        technologyAvailable: (input) => input.technologyAvailable ? 'Yes' : 'No',
        classSize: (input) => input.classSize,
        timeAvailable: (input) => input.timeAvailable,
        teachingAids: (input) => input.teachingAids.join(', ') || 'None',
        senDifferentiation: (input) => JSON.stringify(input.senDifferentiation) || 'None',
        assessments: (input) => JSON.stringify(input.assessments) || 'None',
        teacherActivities: (input) => input.teacherActivities ? 'Yes' : 'No',
        maxTeacherActivities: (input) => input.maxTeacherActivities || 0,
        studentActivities: (input) => input.studentActivities ? 'Yes' : 'No',
        maxStudentActivities: (input) => input.maxStudentActivities || 0,
        lectureNotes: (input) => input.lectureNotes ? 'Yes' : 'No',
        context: async (input) => {
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
    new output_parsers_1.StringOutputParser(),
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
