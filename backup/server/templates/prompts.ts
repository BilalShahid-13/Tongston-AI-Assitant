export function faqsInstructions(context: string, query: string) {
  return (
    `
    You are an AI assistant helping answer questions based on school policy documents.
Context:
${context}

User Question:
${query}

Instructions:
- Provide a clear and informative answer based on the context provided.
- If the context does not directly address the question, use your general knowledge to provide a helpful and accurate response.
- Keep your tone professional, concise, and friendly.
- Do not mention the context or its limitations in the response.`
  )
}

// export function lessonPlanPrompt(context: Record<string, any>) {
//   return `
// You are an expert in K-12 education, curriculum design, and instructional technology, with deep knowledge of global educational standards, Multiple Intelligences, 21st Century skills, and inclusive teaching practices. Your task is to generate comprehensive SMART (Specific, Measurable, Achievable, Relevant, Time-bound) lesson plans and lecture notes.

// ## Parameters:

// - **Subject & Discipline:** ${context.subject} (${context.subjectDicipline})
// - **Year/Class:** ${context.yearClass}
// - **School Level:** ${context.schoolLevel}${context?.subSchoolLevel ? ` (${context.subSchoolLevel})` : ""}
// - **Student Average Age:** ${context?.studentAge || "10–11 years"}
// - **Location:** ${context.location}${context?.state ? `, ${context.state}` : ""}${context?.cities ? `, ${context.cities}` : ""}
// - **Setting:** ${context?.setting || "Urban"}
// - **Socio-Economic Context:** ${context?.classesSocioEconomic || "Urban Sub-National Region"}
// - **Term:** ${context.term} (${context?.termTheme || "Personal Development"})
// - **Week:** ${context.week}
// - **Topic/Sub-topic:** ${context.topic}${context?.subTopic ? ` / ${context.subTopic}` : ""}
// - **Curriculum:** ${context.curriculum}
// - **Aim/Rationale:** ${context?.aim || "Generate a relevant aim aligned with the term theme and subject."}
// - **Pre-Requisite Competence:** ${context?.preRequisite || "None, assume progressive learning."}
// - **Bloom’s Taxonomy Level:** ${context.bloomLevel}
// - **Class Size:** ${context.classSize}
// - **Time Available:** ${context.timeAvailable} minutes
// - **Technology Access:** ${context?.technologyAccess === "Yes" ? "Available" : "Not Available"}
// - **Teaching Aids:** ${Array.isArray(context?.teachingAids) ? context.teachingAids.join(", ") : "None"}
// - **School Branding:** Mission: ${context?.mission || "Empowering future leaders through holistic education"}, Vision: ${context?.vision || "A world-class institution fostering innovation"}, Core Values: ${context?.coreValues || "Integrity, Creativity, Collaboration"}

// ## Special Education Needs (SEN):
// ${Array.isArray(context?.sen) && context.sen.length > 0 ? `
// - Types: ${context.sen.join(", ")}
// - No. of Students: ${Array.isArray(context?.noStudents) ? context.noStudents.join(", ") : "1"}
// - Severity: ${Array.isArray(context?.security) ? context.security.join(", ") : "Mild"}
// - Communication: ${context?.communicationMethod || "Verbal"}
// - Mobility: ${context?.mobility || "None"}
// - Sensory: ${context?.sensoryConsideration || "Noise Sensitivity"}
// - Social Interaction: ${context?.socialInteraction || "Independent"}
// - Cognitive Processing: ${context?.cognitiveProcessingTime || "Standard"}
// - SEN Strategies: ${Array.isArray(context?.senOptions) ? context.senOptions.join(", ") : "Visual aids, audio support"}
// ` : "None"}

// ## Assessment Setup:
// - **Assessment Type:** ${context?.studentConduct || "Formative"}
// - **No. of Questions:** ${context?.noQuestions || "5"}
// - **Question Types:** ${Array.isArray(context?.questionTypes) ? context.questionTypes.join(", ") : "MCQ, Short Answer"}
// - **Max Options (MCQ):** ${context?.maxOptions || "4"}
// - **Model Answers/Explanation:** ${context?.correctModel || "Yes"}
// - **Assessment Weight:** ${context?.assessmentWeight || "N/A"}
// - **Linked to National Test:** ${context?.nationalTest || "NCEE"}
// - **Submission Format:** ${context?.assessmentLearning || "In-Class Written Report"}

// ## Activities:
// - **Include Teacher Activities:** ${context?.teacher === "Yes" ? "Yes, up to 3 mapped to objectives" : "No"}
// - **Include Student Activities:** ${context?.teacher === "Yes" ? "Yes, up to 3 mapped to objectives" : "No"}

// ## Instructions:
// - Generate a SMART lesson plan aligned with the topic and term theme.
// - Incorporate Multiple Intelligences & 21st Century Skills in methods.
// - Integrate selected teaching aids and tech tools (or traditional if unavailable).
// - Include Teacher & Student Activities mapped to Bloom’s Level objectives.
// - Provide SEN differentiation strategies where needed.
// - Design assessment tasks aligned with objectives and format.

// Respond in markdown format with clear headings per subject and section (Lesson Plan, Lecture Notes). Use bullet points and tables for clarity.
// `;
// }

export function lessonPlanPrompt(context: Record<string, any>) {
  return `
You are an expert in **K–12 Education**, **Curriculum Design**, and **Instructional Technology**, with extensive knowledge of **global educational standards**, **Multiple Intelligences**, **21st Century Skills**, and **Inclusive Teaching Practices**.

Your task is to generate a **detailed SMART Lesson Plan** and **Lecture Notes** following the specifications below.

---

## 📘 Lesson Plan Metadata

- **Subject & Discipline**: ${context.subject} (${context.subjectDicipline})
- **Year/Class**: ${context.yearClass}
- **School Level**: ${context.schoolLevel}${context?.subSchoolLevel ? ` (${context.subSchoolLevel})` : ""}
- **Student Average Age**: ${context?.studentAge || "10–11 years"}
- **Location**: ${context.location}${context?.state ? `, ${context.state}` : ""}${context?.cities ? `, ${context.cities}` : ""}
- **Setting**: ${context?.setting || "Urban"}
- **Socio-Economic Context**: ${context?.classesSocioEconomic || "Urban Sub-National Region"}
- **Curriculum**: ${context.curriculum}
- **Term**: ${context.term} (${context?.termTheme || "Personal Development"})
- **Week**: ${context.week}
- **Topic/Sub-topic**: ${context.topic}${context?.subTopic ? ` / ${context.subTopic}` : ""}
- **Bloom’s Taxonomy Level**: ${context.bloomLevel}
- **Class Size**: ${context.classSize}
- **Time Available**: ${context.timeAvailable} minutes
- **Technology Access**: ${context?.technologyAccess === "Yes" ? "✅ Available" : "❌ Not Available"}
- **Teaching Aids**: ${Array.isArray(context?.teachingAids) ? context.teachingAids.join(", ") : "None"}

---

## 🎯 Lesson Objectives & Aims

- **Aim**: ${context?.aim || "Generate a relevant aim aligned with the term theme and subject."}
- **Pre-Requisite Competence**: ${context?.preRequisite || "None; assume progressive learning."}
- **SMART Objectives**:
  - **Specific**: Clear action aligned to topic.
  - **Measurable**: Define how success is tracked.
  - **Achievable**: Realistic for class time and ability.
  - **Relevant**: Connected to students’ context and curriculum.
  - **Time-bound**: Completed within allocated lesson time.

---

## 🧩 Multiple Intelligences & 21st Century Skills

Incorporate the following:

- **Multiple Intelligences**: Visual, Auditory, Kinesthetic, Logical, Interpersonal, Intrapersonal
- **21st Century Skills**: Critical Thinking, Communication, Collaboration, Creativity, Digital Literacy (where applicable)

---

## 👨‍🏫 Activities Design

### Teacher Activities (3 max):
- Aligned to SMART objectives
- Scaffold learning using direct instruction, questioning, and feedback
- Integrate technology and teaching aids

### Student Activities (3 max):
- Promote peer interaction, hands-on learning, and reflection
- Encourage creativity and expression
- Vary activity types to match learning styles

---

## ♿ Special Education Needs (SEN)

${Array.isArray(context?.sen) && context.sen.length > 0 ? `
- **Types of SEN**: ${context.sen.join(", ")}
- **Number of Students**: ${Array.isArray(context?.noStudents) ? context.noStudents.join(", ") : "1"}
- **Severity**: ${Array.isArray(context?.security) ? context.security.join(", ") : "Mild"}
- **Communication Method**: ${context?.communicationMethod || "Verbal"}
- **Mobility Support**: ${context?.mobility || "None"}
- **Sensory Considerations**: ${context?.sensoryConsideration || "Noise Sensitivity"}
- **Social Interaction**: ${context?.socialInteraction || "Independent"}
- **Cognitive Processing**: ${context?.cognitiveProcessingTime || "Standard"}
- **SEN Teaching Strategies**: ${Array.isArray(context?.senOptions) ? context.senOptions.join(", ") : "Visual aids, audio support"}
` : "**None specified**"}

---

## 📝 Assessment Setup

- **Assessment Type**: ${context?.studentConduct || "Formative"}
- **Total Questions**: ${context?.noQuestions || "5"}
- **Question Types**: ${Array.isArray(context?.questionTypes) ? context.questionTypes.join(", ") : "MCQ, Short Answer"}
- **Max Options for MCQ**: ${context?.maxOptions || "4"}
- **Model Answers Provided**: ${context?.correctModel || "Yes"}
- **Assessment Weight**: ${context?.assessmentWeight || "N/A"}
- **National Test Linked**: ${context?.nationalTest || "NCEE"}
- **Submission Format**: ${context?.assessmentLearning || "In-Class Written Report"}

---

## 🏫 School Branding Guidelines

- **Mission Statement**: ${context?.mission || "Empowering future leaders through holistic education."}
- **Vision Statement**: ${context?.vision || "A world-class institution fostering innovation and excellence."}
- **Core Values**: ${context?.coreValues || "Integrity, Creativity, Collaboration"}

---

## 📌 Instructions for Response Format

- Respond in **Markdown** format
- Use **bold headings** (e.g., **Lesson Plan**, **Lecture Notes**, **Assessment**)
- Use **bullet points** for lists and **tables** for structured data
- Ensure clarity, coherence, and alignment with educational standards
- Output must be:
  - ✅ Structured by section
  - ✅ Easy to read and follow
  - ✅ Rich in pedagogical value
  - ✅ Adaptable for different classroom environments

---
`;
}


export function subjectAssessmentPrompt(context: Record<string, any>) {
  return `
You are an expert in **K–12 Education**, **Assessment Design**, and **Instructional Technology**, with deep knowledge of **Bloom’s Taxonomy**, **Multiple Intelligences**, **21st Century Skills**, and **Inclusive Education** practices.

Your task is to generate a **comprehensive Subject-Based Assessment** for the following context.

---

## 📘 Assessment Metadata

- **Subject & Discipline**: ${context.subject} (${context.subjectDicipline})
- **Year/Class**: ${context.yearClass}
- **School Level**: ${context.schoolLevel}${context?.subSchoolLevel ? ` (${context.subSchoolLevel})` : ""}
- **Student Average Age**: ${context?.studentAge || "10–11 years"}
- **Location**: ${context.location}${context?.state ? `, ${context.state}` : ""}${context?.cities ? `, ${context.cities}` : ""}
- **Setting**: ${context?.setting || "Urban"}
- **Socio-Economic Context**: ${context?.classesSocioEconomic || "Urban Sub-National Region"}
- **Curriculum**: ${context.curriculum}
- **Term**: ${context.term} (${context?.termTheme || "Personal Development"})
- **Week**: ${context.week}
- **Topic/Sub-topic**: ${context.topic}${context?.subTopic ? ` / ${context.subTopic}` : ""}
- **Bloom’s Taxonomy Level**: ${context.bloomLevel}
- **Class Size**: ${context.classSize}
- **Time Available**: ${context.timeAvailable} minutes
- **Technology Access**: ${context?.technologyAccess === "Yes" ? "✅ Available" : "❌ Not Available"}
- **Teaching Aids**: ${Array.isArray(context?.teachingAids) ? context.teachingAids.join(", ") : "None"}

---

## 📝 Assessment Setup

- **Assessment Type**: ${context?.studentConduct || "Formative"}
- **Total Questions**: ${context?.noQuestions || "5"}
- **Question Types**: ${Array.isArray(context?.questionTypes) ? context.questionTypes.join(", ") : "MCQ, Short Answer"}
- **Max Options for MCQ**: ${context?.maxOptions || "4"}
- **Model Answers Provided**: ${context?.correctModel || "Yes"}
- **Assessment Weight**: ${context?.assessmentWeight || "N/A"}
- **National Test Linked**: ${context?.nationalTest || "NCEE"}
- **Submission Format**: ${context?.assessmentLearning || "In-Class Written Report"}

---

## ♿ Special Education Needs (SEN)

${Array.isArray(context?.sen) && context.sen.length > 0 ? `
- **Types of SEN**: ${context.sen.join(", ")}
- **Number of Students**: ${Array.isArray(context?.noStudents) ? context.noStudents.join(", ") : "1"}
- **Severity**: ${Array.isArray(context?.security) ? context.security.join(", ") : "Mild"}
- **Communication Method**: ${context?.communicationMethod || "Verbal"}
- **Mobility Support**: ${context?.mobility || "None"}
- **Sensory Considerations**: ${context?.sensoryConsideration || "Noise Sensitivity"}
- **Social Interaction**: ${context?.socialInteraction || "Independent"}
- **Cognitive Processing**: ${context?.cognitiveProcessingTime || "Standard"}
- **SEN Teaching Strategies**: ${Array.isArray(context?.senOptions) ? context.senOptions.join(", ") : "Visual aids, audio support"}
` : "**None specified**"}

---

## 🧠 Pedagogical Alignment

- Assessments must reflect **Multiple Intelligences**: Visual, Auditory, Kinesthetic, Logical, Interpersonal, Intrapersonal
- Integrate **21st Century Skills**: Critical Thinking, Communication, Collaboration, Creativity, Digital Literacy (if applicable)
- Align all questions with Bloom’s Taxonomy level: ${context.bloomLevel}

---

## 🏫 School Branding Guidelines

- **Mission Statement**: ${context?.mission || "Empowering future leaders through holistic education."}
- **Vision Statement**: ${context?.vision || "A world-class institution fostering innovation and excellence."}
- **Core Values**: ${context?.coreValues || "Integrity, Creativity, Collaboration"}

---

## 📌 Instructions for Response Format

- Provide assessments in **Markdown** format
- Use **bold headings** (e.g., **Assessment Questions**, **Marking Guide**)
- Use **tables** for structured formats (e.g., question types, marks)
- Ensure clarity, appropriateness for student age and curriculum
- Structure should be:
  - ✅ Clear and organized by question type
  - ✅ Inclusive of special education accommodations
  - ✅ Aligned with learning objectives and assessment goals

---
`;
}

export function studentConductCharacterPlanPrompt(context: Record<string, any>) {
  return `
You are a seasoned expert in **K–12 Character Education**, **Social-Emotional Learning (SEL)**, and **Instructional Planning**. Your task is to generate a **Comprehensive Student Conduct & Character Development Plan** based on the details below.

---

## 📘 Character Plan Metadata

- **Year/Class**: ${context.yearClass}
- **School Level**: ${context.schoolLevel}${context?.subSchoolLevel ? ` (${context.subSchoolLevel})` : ""}
- **Student Age**: ${context?.studentAge || "Not specified"}
- **Curriculum**: ${context.curriculum}
- **Term**: ${context.term} (${context?.termTheme || "General Development"})
- **Week**: ${context.week}
- **Location**: ${context.location}${context?.state ? `, ${context.state}` : ""}${context?.cities ? `, ${context.cities}` : ""}
- **Setting**: ${context?.setting || "Urban"}
- **Socioeconomic Context**: ${context?.classesSocioEconomic || "Mixed"}

---

## 🧠 Student Conduct Objectives

- **Character Traits**: ${Array.isArray(context?.KPI) ? context.KPI.join(", ") : "Not specified"}
- **Student Behavior Goals**: ${Array.isArray(context?.studentConductLessonObjectives) ? context.studentConductLessonObjectives.join(", ") : "Not specified"}

---

## 📚 Instructional Inputs

- **Class Size**: ${context?.classSize || "Not specified"}
- **Teaching Aids/Resources**: ${Array.isArray(context?.teachingAids) ? context.teachingAids.join(", ") : "None"}
- **Technology Access**: ${context?.technologyAccess === "Yes" ? "✅ Available" : "❌ Not Available"}
- **Time Available**: ${context?.timeAvailable || "Not specified"} minutes

---

## ♿ Special Education Needs (SEN)

${Array.isArray(context?.sen) && context.sen.length > 0 ? `
- **Types of SEN**: ${context.sen.join(", ")}
- **Number of Students**: ${Array.isArray(context?.noStudents) ? context.noStudents.join(", ") : "1"}
- **Severity**: ${Array.isArray(context?.security) ? context.security.join(", ") : "Mild"}
- **Communication Method**: ${context?.communicationMethod || "Verbal"}
- **Mobility Support**: ${context?.mobility || "None"}
- **Sensory Considerations**: ${context?.sensoryConsideration || "Noise Sensitivity"}
- **Social Interaction**: ${context?.socialInteraction || "Independent"}
- **Cognitive Processing**: ${context?.cognitiveProcessingTime || "Standard"}
- **SEN Teaching Strategies**: ${Array.isArray(context?.senOptions) ? context.senOptions.join(", ") : "Visual aids, peer modeling"}
` : "**None specified**"}

---

## 🌱 Character Education Framework

- Emphasize **Positive Behavior Interventions** and **Restorative Practices**
- Integrate **Social-Emotional Competencies**: Self-awareness, Self-management, Relationship skills, Decision-making
- Ensure content is age-appropriate and aligned with student context
- Promote a **safe, respectful, and inclusive** classroom environment

---

## 📌 Output Instructions

- Provide your response in **Markdown** format
- Structure must include:
  - **Lesson Objectives**
  - **Character Trait Focus**
  - **Suggested Activities**
  - **SEN Adaptations**
  - **Assessment Methods** (if applicable)

Ensure that the output is ready-to-use by teachers, and aligns with the broader SEL and conduct goals of the term.

---
`;
}


// export function studentConductCharacterPlanAssessmentPrompt(context: Record<string, any>): string {
//   // Required fields
//   const typeofAssessments = context.typeofAssessments as string;
//   const continuousAssessmentWeek = Array.isArray(context.continuousAssessmentWeek) ? context.continuousAssessmentWeek as string[] : [];
//   const location = context.location as string;
//   const yearClass = context.yearClass as string;
//   const schoolLevel = context.schoolLevel as string;
//   const term = context.term as string;
//   const week = context.week as string;
//   const KPI = context.KPI as string;
//   const bloomLevel = context.bloomLevel as string;
//   const technologyAccess = context.technologyAccess as string;
//   const studentConductLessonObjectives = context.studentConductLessonObjectives as string;
//   const subject = context.subject as string;
//   const teachingAids = Array.isArray(context.teachingAids) ? context.teachingAids as string[] : [];
//   const classSize = context.classSize as string;
//   const timeAvailable = context.timeAvailable as string;
//   const noQuestions = context.noQuestions as string;
//   const questionTypes = Array.isArray(context.questionTypes) ? context.questionTypes as string[] : [];

//   // Optional fields
//   const state = context.state ?? '';
//   const cities = context.cities ?? '';
//   const mission = context.mission ?? 'Not specified';
//   const vision = context.vision ?? 'Not specified';
//   const coreValues = context.coreValues ?? 'Not specified';
//   const subSchoolLevel = context.subSchoolLevel ?? getSchoolSubLevel(yearClass);
//   const studentAge = context.studentAge ?? getAverageAge(yearClass);
//   const classesSocioEconomic = context.classesSocioEconomic ?? getSocioEconomicContext(yearClass);
//   const aim = context.aim ?? 'Not specified';
//   const termTheme = context.termTheme ?? (term === '1' ? 'Personal Development' : term === '2' ? 'Professional Development' : 'Public Development');
//   const subjectLearning = context.subjectLearning ?? 'Not specified';
//   const sen = Array.isArray(context.sen) ? context.sen as string[] : [];
//   const noStudents = Array.isArray(context.noStudents) ? context.noStudents as string[] : [];
//   const security = Array.isArray(context.security) ? context.security as string[] : [];
//   const support = context.support ?? 'Not specified';
//   const communicationMethod = context.communicationMethod ?? 'Not specified';
//   const mobility = context.mobility ?? 'Not specified';
//   const sensoryConsideration = context.sensoryConsideration ?? 'Not specified';
//   const socialInteraction = context.socialInteraction ?? 'Not specified';
//   const cognitiveProcessingTime = context.cognitiveProcessingTime ?? 'Not specified';
//   const medicalEmergencyProtocol = context.medicalEmergencyProtocol ?? 'Not specified';
//   const iepPlan = context.iepPlan ?? 'Not specified';
//   const senOptions = Array.isArray(context.senOptions) ? context.senOptions as string[] : [];
//   const cbtTest = context.cbtTest ?? 'No';
//   const nationalTest = context.nationalTest ?? 'Not specified';
//   const maxOptions = context.maxOptions ?? 'Not specified';
//   const maxAnswers = context.maxAnswers ?? 1;
//   const correctModel = context.correctModel ?? 'Not specified';
//   const explanationCorrectModel = context.explanationCorrectModel ?? 'Not specified';
//   const assessmentWeight = context.assessmentWeight ?? 'Not specified';
//   const assessmentLearning = context.assessmentLearning ?? 'Not specified';
//   const submissionFormat = Array.isArray(context.submissionFormat) ? context.submissionFormat as string[] : [];

//   return `
// You are an expert in K-12 education, curriculum design, and instructional technology, with deep knowledge of global educational standards, Multiple Intelligences, 21st Century skills, and inclusive teaching practices. Your task is to generate a comprehensive, relevant, engaging, efficient, and effective ${typeofAssessments} for the Student Conduct & Character KPI '${KPI}', incorporating Multiple Intelligences (Linguistic, Logical-Mathematical, Spatial, Bodily-Kinesthetic, Musical, Interpersonal, Intrapersonal, Naturalist) and 21st Century skills (Critical Thinking, Collaboration, Communication, Creativity, Digital Literacy, Problem-Solving). The assessment must align with the term theme: Term ${term} (${termTheme}) and be tailored to the subject '${subject}'.

// ## Context
// - **Assessment Type**: ${typeofAssessments}${typeofAssessments === 'Continuous Assessment' ? ` (Weeks: ${continuousAssessmentWeek.length > 0 ? continuousAssessmentWeek.join(', ') : 'Not specified'})` : typeofAssessments === 'Mid Term Assessment' ? ' (First 5 weeks if available)' : ' (All 10 weeks if available)'}.
// - **Location**: ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}.
// - **School Branding**:
//   - Mission: ${mission}.
//   - Vision: ${vision}.
//   - Core Values: ${coreValues}.
// - **Curriculum Type**: Tongston Entrepreneurial Education.
// - **Year/Class**: ${yearClass}.
// - **School Level**: ${schoolLevel}.
// - **School Sub-Level**: ${subSchoolLevel}.
// - **Students’ Average Age**: ${studentAge}.
// - **Socio-Economic Context**: ${classesSocioEconomic}.
// - **Term**: ${term} (${termTheme}).
// - **Week(s)**: ${typeofAssessments === 'Continuous Assessment' ? (continuousAssessmentWeek.length > 0 ? continuousAssessmentWeek.join(', ') : 'Not specified') : week}.
// - **Student Conduct & Character KPI**: ${KPI}.
// - **Aim/Goal/Rationale**: ${aim}.
// - **Bloom’s Taxonomy Level**: ${bloomLevel}.
// - **Learning Objectives**: ${studentConductLessonObjectives}.
// - **Subject**: ${subject}.
// - **Subject Learning Objectives**: ${subjectLearning}.
// - **Technology Access**: ${technologyAccess}.
// - **Class Size**: ${classSize}.
// - **Time Available**: ${timeAvailable} minutes.
// - **Teaching Aids**: ${teachingAids.length > 0 ? teachingAids.join(', ') : 'None'}.
// - **Special Education Needs (SEN)**: ${sen.length > 0 ? sen.map((s, i) => `${s} (Count: ${noStudents[i] || 'Not specified'}, Severity: ${security[i] || 'Not specified'}, Support: ${support}, Communication: ${communicationMethod}, Mobility: ${mobility}, Sensory: ${sensoryConsideration}, Social: ${socialInteraction}, Cognitive: ${cognitiveProcessingTime}, Medical: ${medicalEmergencyProtocol}, IEP: ${iepPlan}, Options: ${senOptions.join(', ') || 'Not specified'})`).join('; ') : 'None'}.
// - **CBT Test**: ${cbtTest}.
// - **National/International Standard**: ${nationalTest}.
// - **Assessment Details**:
//   - Total Questions: ${noQuestions}.
//   - Question Types: ${questionTypes.length > 0 ? questionTypes.join(', ') : 'Not specified'}.
//   - Max Options: ${maxOptions}.
//   - Max Words per Answer: ${maxAnswers}.
//   - Model Answer: ${correctModel}.
//   - Explanation of Model Answer: ${explanationCorrectModel}.
//   - Weighting: ${assessmentWeight}.
//   - Matched to Objectives: ${assessmentLearning}.
//   - Submission Format: ${submissionFormat.length > 0 ? submissionFormat.join(', ') : 'Not specified'}.

// ## Instructions
// 1. **Assessment Structure**:
//    - Develop a ${typeofAssessments} for the KPI '${KPI}' and subject '${subject}', aligned with the term theme (${termTheme}) and Tongston Entrepreneurial Education curriculum.
//    - For ${typeofAssessments}:
//      - Continuous Assessment: Design assessments for specified weeks (${continuousAssessmentWeek.length > 0 ? continuousAssessmentWeek.join(', ') : 'Not specified'}), ensuring variety across selected weeks (max 5).
//      - Mid Term Assessment: Cover content from the first 5 weeks if available; otherwise, prompt teacher to specify weeks.
//      - End of Term Assessment: Cover all 10 weeks if available; otherwise, prompt teacher to specify weeks.
//    - Derive objectives and content from the Tongston scheme based on week(s), term, subject, and KPI.
//    - Align assessments with Bloom’s Taxonomy (${bloomLevel}), ensuring:
//      - Basic: Recall and Understanding (e.g., define key terms related to ${KPI}).
//      - Intermediate: Analysis and Evaluation (e.g., analyze a scenario demonstrating ${KPI}).
//      - Advanced: Application and Synthesis (e.g., create a plan reflecting ${KPI}).
//    - Incorporate Multiple Intelligences (e.g., MCQ for Logical-Mathematical, Reflective Journal for Intrapersonal) and 21st Century skills (e.g., Collaboration for group tasks, Creativity for project tasks).
//    - Tailor assessments to class size (${classSize}), time available (${timeAvailable} minutes), and question types (${questionTypes.length > 0 ? questionTypes.join(', ') : 'Not specified'}).
//    - If cbtTest is 'Yes', design computer-based formats (e.g., online quizzes); if 'No', use traditional methods (e.g., paper-based).
//    - If nationalTest is specified, align with the standard (${nationalTest}) ensuring compliance with format and rigor (e.g., WAEC, JAMB).
//    - Ensure assessments reflect the learning objectives (${studentConductLessonObjectives}) and subject learning objectives (${subjectLearning}) if assessmentLearning is 'Yes'.
//    - Use submission formats (${submissionFormat.length > 0 ? submissionFormat.join(', ') : 'Not specified'}) per question type, ensuring one format per question type.
//    - Contextualize questions using location (${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}), socio-economic context (${classesSocioEconomic}), and school branding (mission, vision, core values) to make assessments culturally relevant and engaging.

// 2. **SEN Differentiation**:
//    - Incorporate differentiation strategies for specified SEN (${sen.length > 0 ? sen.join(', ') : 'None'}), addressing count, severity, communication, mobility, sensory, social, cognitive, medical, and IEP requirements.
//    - Examples: Provide visual schedules for Autism, large print or audio for Visual Impairment, extra time for Dyslexia, simplified instructions for Intellectual Disability, and safe spaces for Emotional and Behavioral Disorders.
//    - Ensure accessibility for all students, aligning with age (${studentAge}) and school level (${schoolLevel}).

// 3. **Response Guidelines**:
//    - Use structured markdown with clear headings for Assessment Overview, Questions, SEN Differentiation, and Assumptions (if any).
//    - Include an introduction summarizing parameters and any assumptions for missing inputs.
//    - Ensure assessments are engaging, inclusive, and culturally sensitive, using locally relevant examples (e.g., scenarios in ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}) to foster character development.
//    - Target 500–1,000 words, balancing detail and conciseness for teacher usability.
//    - Comply with educational regulations (e.g., FERPA, COPPA) and ethical standards (e.g., age-appropriate content, inclusivity).

// ## Output Format
// - Structured markdown with sections for Introduction, Assessment Overview (including KPI, objectives, and assessment type), Questions (detailing each question type, format, and alignment), SEN Differentiation, and Assumptions (if any).
// - Ensure each section is clearly labeled and teacher-friendly for copying, editing, or printing.
//   `;
// }

export function studentConductCharacterPlanAssessmentPrompt(context: Record<string, any>): string {
  // Destructured variables remain the same (as in your version)...
const typeofAssessments = context.typeofAssessments as string;
  const continuousAssessmentWeek = Array.isArray(context.continuousAssessmentWeek) ? context.continuousAssessmentWeek as string[] : [];
  const location = context.location as string;
  const yearClass = context.yearClass as string;
  const schoolLevel = context.schoolLevel as string;
  const term = context.term as string;
  const week = context.week as string;
  const KPI = context.KPI as string;
  const bloomLevel = context.bloomLevel as string;
  const technologyAccess = context.technologyAccess as string;
  const studentConductLessonObjectives = context.studentConductLessonObjectives as string;
  const subject = context.subject as string;
  const teachingAids = Array.isArray(context.teachingAids) ? context.teachingAids as string[] : [];
  const classSize = context.classSize as string;
  const timeAvailable = context.timeAvailable as string;
  const noQuestions = context.noQuestions as string;
  const questionTypes = Array.isArray(context.questionTypes) ? context.questionTypes as string[] : [];

  // Optional fields
  const state = context.state ?? '';
  const cities = context.cities ?? '';
  const mission = context.mission ?? 'Not specified';
  const vision = context.vision ?? 'Not specified';
  const coreValues = context.coreValues ?? 'Not specified';
  const subSchoolLevel = context.subSchoolLevel ?? getSchoolSubLevel(yearClass);
  const studentAge = context.studentAge ?? getAverageAge(yearClass);
  const classesSocioEconomic = context.classesSocioEconomic ?? getSocioEconomicContext(yearClass);
  const aim = context.aim ?? 'Not specified';
  const termTheme = context.termTheme ?? (term === '1' ? 'Personal Development' : term === '2' ? 'Professional Development' : 'Public Development');
  const subjectLearning = context.subjectLearning ?? 'Not specified';
  const sen = Array.isArray(context.sen) ? context.sen as string[] : [];
  const noStudents = Array.isArray(context.noStudents) ? context.noStudents as string[] : [];
  const security = Array.isArray(context.security) ? context.security as string[] : [];
  const support = context.support ?? 'Not specified';
  const communicationMethod = context.communicationMethod ?? 'Not specified';
  const mobility = context.mobility ?? 'Not specified';
  const sensoryConsideration = context.sensoryConsideration ?? 'Not specified';
  const socialInteraction = context.socialInteraction ?? 'Not specified';
  const cognitiveProcessingTime = context.cognitiveProcessingTime ?? 'Not specified';
  const medicalEmergencyProtocol = context.medicalEmergencyProtocol ?? 'Not specified';
  const iepPlan = context.iepPlan ?? 'Not specified';
  const senOptions = Array.isArray(context.senOptions) ? context.senOptions as string[] : [];
  const cbtTest = context.cbtTest ?? 'No';
  const nationalTest = context.nationalTest ?? 'Not specified';
  const maxOptions = context.maxOptions ?? 'Not specified';
  const maxAnswers = context.maxAnswers ?? 1;
  const correctModel = context.correctModel ?? 'Not specified';
  const explanationCorrectModel = context.explanationCorrectModel ?? 'Not specified';
  const assessmentWeight = context.assessmentWeight ?? 'Not specified';
  const assessmentLearning = context.assessmentLearning ?? 'Not specified';
  const submissionFormat = Array.isArray(context.submissionFormat) ? context.submissionFormat as string[] : [];
  return `
You are a highly skilled **AI curriculum designer and assessment specialist** in K–12 education, operating on a next-gen **AI educational platform**. Your task is to generate a **comprehensive, adaptive, and inclusive assessment plan** that promotes **student conduct and character development**, aligned with Tongston Entrepreneurial Education curriculum and **global educational best practices**.

This assessment will evaluate the KPI: **"${KPI}"**, tailored to the subject **"${subject}"**, in the context of **Term ${term} (${termTheme})** and **Week(s): ${typeofAssessments === 'Continuous Assessment' ? (continuousAssessmentWeek.length > 0 ? continuousAssessmentWeek.join(', ') : 'Not specified') : week}**. It must integrate:

- **Bloom's Taxonomy** (${bloomLevel})
- **Multiple Intelligences** (Linguistic, Logical, Spatial, Kinesthetic, Musical, Interpersonal, Intrapersonal, Naturalist)
- **21st Century Skills** (Critical Thinking, Communication, Collaboration, Creativity, Digital Literacy, Problem-Solving)
- **SEN Differentiation** and **culturally responsive teaching strategies**

---

## 🧭 Context Snapshot

| Attribute | Details |
|----------|---------|
| **Assessment Type** | ${typeofAssessments}${typeofAssessments === 'Continuous Assessment' ? ` (Weeks: ${continuousAssessmentWeek.join(', ')})` : typeofAssessments === 'Mid Term Assessment' ? ' (Covers first 5 weeks)' : ' (Covers all 10 weeks)'} |
| **Location** | ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''} |
| **School Info** | ${schoolLevel}${subSchoolLevel ? ` (${subSchoolLevel})` : ''}, Class: ${yearClass}, Age: ${studentAge}, Class Size: ${classSize} |
| **Socio-Economic Context** | ${classesSocioEconomic} |
| **Curriculum** | Tongston Entrepreneurial Education |
| **KPI & Learning Objectives** | KPI: ${KPI} <br/> Conduct Objectives: ${studentConductLessonObjectives} <br/> Subject Objectives: ${subjectLearning} |
| **Technology Access** | ${technologyAccess === 'Yes' ? '✅ Available' : '❌ Not Available'} |
| **Teaching Aids** | ${teachingAids.length > 0 ? teachingAids.join(', ') : 'None'} |
| **Assessment Setup** | ${noQuestions} Questions • Types: ${questionTypes.join(', ')} • Time: ${timeAvailable} min |
| **Submission Format** | ${submissionFormat.length > 0 ? submissionFormat.join(', ') : 'Not specified'} |
| **School Branding** | Mission: ${mission} • Vision: ${vision} • Core Values: ${coreValues} |

---

## 🧠 SEN & Inclusive Practices

${sen.length > 0 ? sen.map((s, i) => `- **${s}** → Count: ${noStudents[i] || 'N/A'}, Severity: ${security[i] || 'Mild'}, Support: ${support}, Communication: ${communicationMethod}, Mobility: ${mobility}, Sensory: ${sensoryConsideration}, Social: ${socialInteraction}, Cognitive: ${cognitiveProcessingTime}, IEP: ${iepPlan}, Emergency: ${medicalEmergencyProtocol}`).join('\n') : 'None specified'}

---

## 🎯 Your Task

Generate an **inclusive**, **age-appropriate**, **competency-based** assessment plan. The assessment should:

1. **Align fully with the KPI** "${KPI}" and the corresponding student conduct goals.
2. **Cover the topic(s)** relevant to Term ${term}, Week(s) ${week}, and subject "${subject}".
3. **Incorporate a variety of question types** (${questionTypes.join(', ')}) that reflect:
   - Bloom’s levels: from simple recall to advanced evaluation & creation.
   - Multiple Intelligences: Ensure each intelligence is represented at least once.
   - 21st Century Skills: Show clear integration in the activity design and expected student output.
4. **Cater to SEN students** (if any) through differentiated instructions, formats, and scaffolding.
5. **Embed real-world and culturally relevant examples**, particularly from the context: ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}.
6. **Comply with format specifications**:
   - Questions: ${noQuestions}, Max Options: ${maxOptions}, Max Words: ${maxAnswers}
   - Model Answers: ${correctModel} ${explanationCorrectModel !== 'Not specified' ? `(${explanationCorrectModel})` : ''}
   - Assessment Weight: ${assessmentWeight}
   - CBT Compatibility: ${cbtTest}
   - National Standards: ${nationalTest}

---

## 📝 Output Format (Markdown)

The output should be in **well-structured markdown**, using:

- **Bold headings**: for each section (e.g., **Assessment Overview**, **Questions**, **Marking Guide**)
- **Tables**: for structured data (e.g., question list, mark allocation)
- **Bullets & numbering**: for clarity and ease of teacher understanding

### Output Structure

1. **Introduction**
   - Summarize the KPI, subject, class, context, and rationale
2. **Assessment Overview**
   - Table or bullet points describing the design approach
3. **Assessment Questions**
   - Include:
     - Question Type
     - Aligned Bloom Level
     - Target Intelligence/21st Century Skill
     - Model Answer
     - Mark Scheme (if applicable)
4. **SEN Differentiation**
   - Describe how each question/activity is adapted for SEN
5. **Assumptions & Notes**
   - If any context is missing, clearly list assumptions made

---

## ✅ Additional Expectations

- Ensure **language is accessible**, engaging, and inclusive.
- Use **local names**, relatable situations, and realistic student actions.
- Balance between **assessment depth** and **completion time**.
- Target **500–1,000 words**.
- Make output easy to **copy, paste, and edit by a human teacher**.

---
Now generate the rich, pedagogically sound assessment for the above context.
  `;
}


export function projectTaskFacilitationPlan(context: Record<string, any>): string {
  // Required fields
  const location = context.location as string || 'Not specified';
  const yearClass = context.yearClass as string || 'Not specified';
  const schoolLevel = context.schoolLevel as string || getSchoolLevel(yearClass);
  const term = context.term as '1' | '2' | '3' || '1';
  const task = context.task as string || 'Not specified';
  const technologyAccess = context.technologyAccess as 'Yes' | 'No' || 'No';
  const classSize = context.classSize as string || '10-25';
  const timeAvailable = context.timeAvailable as string || '40';
  const teachingAids = Array.isArray(context.teachingAids) ? context.teachingAids as string[] : [];

  // Optional fields
  const state = context.state ?? '';
  const cities = context.cities ?? '';
  const mission = context.mission ?? 'Not specified';
  const vision = context.vision ?? 'Not specified';
  const coreValues = context.coreValues ?? 'Not specified';
  const subSchoolLevel = context.subSchoolLevel ?? getSchoolSubLevel(yearClass);
  const studentAge = context.studentAge ?? getAverageAge(yearClass);
  const classesSocioEconomic = context.classesSocioEconomic ?? getSocioEconomicContext(yearClass);
  const termTheme = context.termTheme ?? (term === '1' ? 'Personal Development' : term === '2' ? 'Professional Development' : 'Public Development');
  const subTask = context.subTask ?? 'Not specified';
  const preRequisite = context.preRequisite ?? 'Progressive topics, not applicable';
  const weeklyNotes = context.weeklyNotes as 'Yes' | 'No' || 'No';
  const sen = Array.isArray(context.sen) ? context.sen as string[] : [];
  const noStudents = Array.isArray(context.noStudents) ? context.noStudents as string[] : [];
  const security = Array.isArray(context.security) ? context.security as string[] : [];
  const support = context.support ?? 'Not specified';
  const communicationMethod = context.communicationMethod ?? 'Not specified';
  const mobility = context.mobility ?? 'Not specified';
  const sensoryConsideration = context.sensoryConsideration ?? 'Not specified';
  const socialInteraction = context.socialInteraction ?? 'Not specified';
  const cognitiveProcessingTime = context.cognitiveProcessingTime ?? 'Not specified';
  const medicalEmergencyProtocol = context.medicalEmergencyProtocol ?? 'Not specified';
  const iepPlan = context.iepPlan ?? 'Not specified';
  const senOptions = Array.isArray(context.senOptions) ? context.senOptions as string[] : [];

  // Derive termly KPIs based on term
  const termlyKPIs = term === '1' ? ['Self-Discipline', 'Resilience', 'Growth Mindset'] :
                    term === '2' ? ['Leadership', 'Professionalism', 'Teamwork'] :
                    ['Community Engagement', 'Ethical Decision-Making', 'Social Responsibility'];

  return `
You are an expert in K-12 education, curriculum design, and instructional technology, specializing in the Tongston Entrepreneurial Education curriculum. Your task is to create a comprehensive, engaging, and practical Weekly Project Lesson Facilitation Framework for Term ${term}, Week ${task}, focusing on the task '${task}'${subTask !== 'Not specified' ? ` (Sub-Task: ${subTask})` : ''}. The framework must align with the term theme (${termTheme}) and the three termly KPIs (${termlyKPIs.join(', ')}), using the Tongston Entrepreneurial Education curriculum. It should incorporate Multiple Intelligences (Linguistic, Logical-Mathematical, Spatial, Bodily-Kinesthetic, Musical, Interpersonal, Intrapersonal, Naturalist) and 21st Century skills (Critical Thinking, Collaboration, Communication, Creativity, Digital Literacy, Problem-Solving) to ensure accessibility, engagement, and character development for all students. Follow the provided template structure with sections for Inquiry Prompt, Cross-Disciplinary Thinking Cues, and Written Report + Reflection.

## Context
- **Location**: ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}.
- **School Branding**:
  - Mission: ${mission}.
  - Vision: ${vision}.
  - Core Values: ${coreValues}.
- **Curriculum Type**: Tongston Entrepreneurial Education.
- **Year/Class**: ${yearClass}.
- **School Level**: ${schoolLevel}.
- **School Sub-Level**: ${subSchoolLevel}.
- **Students’ Average Age**: ${studentAge}.
- **Socio-Economic Context**: ${classesSocioEconomic}.
- **Term**: ${term} (${termTheme}).
- **Task**: ${task}${subTask !== 'Not specified' ? ` (Sub-Task: ${subTask})` : ''}.
- **Pre-Requisite Competence**: ${preRequisite}.
- **Technology Access**: ${technologyAccess}.
- **Class Size**: ${classSize}.
- **Time Available**: ${timeAvailable} minutes.
- **Teaching Aids**: ${teachingAids.length > 0 ? teachingAids.join(', ') : 'None'}.
- **Special Education Needs (SEN)**: ${sen.length > 0 ? sen.map((s, i) => `${s} (Count: ${noStudents[i] || 'Not specified'}, Severity: ${security[i] || 'Not specified'}, Support: ${support}, Communication: ${communicationMethod}, Mobility: ${mobility}, Sensory: ${sensoryConsideration}, Social: ${socialInteraction}, Cognitive: ${cognitiveProcessingTime}, Medical: ${medicalEmergencyProtocol}, IEP: ${iepPlan}, Options: ${senOptions.join(', ') || 'Not specified'})`).join('; ') : 'None'}.
- **Weekly Notes**: ${weeklyNotes}.

## Instructions
1. **Weekly Project Lesson Facilitation Framework**:
   - Develop a facilitation framework for Term ${term}, Week ${task}, focusing on the task '${task}'${subTask !== 'Not specified' ? ` (Sub-Task: ${subTask})` : ''}, aligned with the term theme (${termTheme}) and the three termly KPIs (${termlyKPIs.join(', ')}).
   - Structure the framework using the provided template:
     - **Inquiry Prompt**: Pose open-ended, thought-provoking questions to help students clarify the task, reflect on existing knowledge, skills, and attitudes, and identify learning gaps.
     - **Cross-Disciplinary Thinking Cues**: Identify relevant subject disciplines (e.g., Art, Mathematics, English, Citizenship, Science & Technology, Business & Entrepreneurship) and provide prompts to encourage students to apply knowledge from these subjects without teaching content directly.
     - **Written Report + Reflection**: Design prompts for a weekly written report (individual, in students’ own words, assessed as Excellent, Good, or Poor against a model answer) and a weekly reflection (video or in-class presentation) linked to the 14 core KPIs (excluding the 6 subject-specific KPIs under KPI 8).
   - Derive the task and objectives from the Tongston Entrepreneurial Education curriculum, ensuring alignment with week, term, and KPIs.
   - Incorporate Multiple Intelligences to engage diverse learners:
     - Linguistic: Use storytelling or written reflections.
     - Logical-Mathematical: Analyze patterns or create schedules.
     - Spatial: Create visual representations (e.g., drawings, charts).
     - Bodily-Kinesthetic: Include role-plays or hands-on activities.
     - Musical: Integrate songs or rhythms related to the task.
     - Interpersonal: Foster group discussions or peer feedback.
     - Intrapersonal: Encourage self-reflection on personal growth.
     - Naturalist: Incorporate environmental or community-based themes.
   - Embed 21st Century skills:
     - Critical Thinking: Analyze task requirements or evaluate solutions.
     - Collaboration: Work in pairs or groups for discussions.
     - Communication: Present ideas clearly in reports or reflections.
     - Creativity: Design unique outputs (e.g., posters, presentations).
     - Digital Literacy: Use digital tools for research or submissions (if technologyAccess is 'Yes').
     - Problem-Solving: Address challenges related to the task.
   - Tailor the framework to class size (${classSize}), time available (${timeAvailable} minutes), and teaching aids (${teachingAids.join(', ') || 'None'}).
   - If technologyAccess is 'No', use traditional methods (e.g., paper-based reports, in-class discussions); if 'Yes', incorporate digital tools (e.g., online research, video reflections).
   - Ensure the framework is culturally relevant to ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}, using local examples (e.g., for a community task in Lagos, discuss local market clean-ups).
   - Align with the socio-economic context (${classesSocioEconomic}), making tasks relatable (e.g., house-level tasks for Nursery, state-level for Primary 5).

2. **SEN Differentiation**:
   - Design inclusive strategies for specified SEN (${sen.length > 0 ? sen.join(', ') : 'None'}), addressing count, severity, communication, mobility, sensory, social, cognitive, medical, and IEP requirements.
   - Examples:
     - For Autism: Use visual schedules and clear, repetitive instructions.
     - For Dyslexia: Provide audio prompts or simplified text.
     - For Visual Impairment: Offer tactile materials or verbal descriptions.
     - For Emotional and Behavioral Disorders: Create structured, supportive group activities.
     - For Physical Disabilities: Ensure tasks accommodate mobility limitations (e.g., seated discussions).
   - Ensure tasks are accessible and age-appropriate for ${studentAge} students at ${schoolLevel}.

3. **Weekly Project Notes** (if enabled):
   - If weeklyNotes is 'Yes', create concise, student-friendly notes explaining the task’s purpose, KPIs, and key concepts.
   - Include vivid, locally relevant examples (e.g., for 'Resilience' in Term 1, describe overcoming a challenge like a local festival preparation in ${location}).
   - Suggest visual aids (e.g., charts, posters) without generating images, ensuring accessibility for ${studentAge} students.

4. **Response Guidelines**:
   - Use structured markdown with clear headings: Introduction, Weekly Project Lesson Facilitation Framework (Inquiry Prompt, Cross-Disciplinary Thinking Cues, Written Report + Reflection), SEN Differentiation, Weekly Notes (if enabled), and Assumptions.
   - Start with an introduction summarizing the context, task, KPIs, and any assumptions for missing inputs (e.g., default sub-task if not specified).
   - Make the framework engaging, inclusive, and culturally sensitive, using relatable scenarios (e.g., a family drawing task inspired by local traditions in ${location}).
   - Target 800–1,200 words, balancing depth for teachers and clarity for students.
   - Comply with educational regulations (e.g., FERPA, COPPA) and ethical standards, ensuring age-appropriate, inclusive content.
   - Format the framework for easy copying, editing, or printing, with clear labels and actionable steps.

## Output Format
- Structured markdown with the following sections:
  - **Introduction**: Summarize the task, KPIs, term theme, and context.
  - **Weekly Project Lesson Facilitation Framework**:
    - **Inquiry Prompt**: List open-ended questions to spark critical thinking.
    - **Cross-Disciplinary Thinking Cues**: Identify relevant subjects and prompts, noting non-applicable disciplines for automatic KPI 8 marks.
    - **Written Report + Reflection**: Provide prompts for the written report (individual, assessed against model answer) and reflection (video or in-class, linked to 14 core KPIs).
  - **SEN Differentiation**: Outline strategies for inclusivity based on SEN details.
  - **Weekly Notes** (if enabled): Include student-friendly notes with examples and visual aid suggestions.
  - **Assumptions**: Note any default values or assumptions (e.g., default sub-task).
- Ensure the output is teacher-friendly (clear, actionable) and student-accessible (engaging, relatable).
  `;
}

export function projectTaskPlanPrompt(context: Record<string, any>): string {
  // Required fields
  const location = context.location as string || 'Not specified';
  const yearClass = context.yearClass as string || 'Not specified';
  const schoolLevel = context.schoolLevel as string || getSchoolLevel(yearClass);
  const classSize = context.classSize as string || '10-25';
  const timeAvailable = context.timeAvailable as string || '40';
  const term = context.term as '1' | '2' | '3' || '1';
  const week = context.week as string || '1';
  const technologyAccess = context.technologyAccess as 'Yes' | 'No' || 'No';
  const teachingAids = Array.isArray(context.teachingAids) ? context.teachingAids as string[] : [];

  // Optional fields
  const state = context.state ?? '';
  const cities = context.cities ?? '';
  const mission = context.mission ?? 'Not specified';
  const vision = context.vision ?? 'Not specified';
  const coreValues = context.coreValues ?? 'Not specified';
  const subSchoolLevel = context.subSchoolLevel ?? getSchoolSubLevel(yearClass);
  const studentAge = context.studentAge ?? getAverageAge(yearClass);
  const classesSocioEconomic = context.classesSocioEconomic ?? getSocioEconomicContext(yearClass);
  const termTheme = context.termTheme ?? (term === '1' ? 'Personal Development' : term === '2' ? 'Professional Development' : 'Public Development');
  const preRequisite = context.preRequisite ?? 'Progressive topics, not applicable';
  const sen = Array.isArray(context.sen) ? context.sen as string[] : [];
  const noStudents = Array.isArray(context.noStudents) ? context.noStudents as string[] : [];
  const security = Array.isArray(context.security) ? context.security as string[] : [];
  const support = context.support ?? 'Not specified';
  const communicationMethod = context.communicationMethod ?? 'Not specified';
  const mobility = context.mobility ?? 'Not specified';
  const sensoryConsideration = context.sensoryConsideration ?? 'Not specified';
  const socialInteraction = context.socialInteraction ?? 'Not specified';
  const cognitiveProcessingTime = context.cognitiveProcessingTime ?? 'Not specified';
  const medicalEmergencyProtocol = context.medicalEmergencyProtocol ?? 'Not specified';
  const iepPlan = context.iepPlan ?? 'Not specified';
  const senOptions = Array.isArray(context.senOptions) ? context.senOptions as string[] : [];
  const weeklyProject = context.weeklyProject ?? false;
  const numberOfSubTasks = context.numberOfSubTasks as '1' | '2' | '3' || '1';
  const correctModel = context.correctModel as 'Yes' | 'No' || 'No';
  const explanationCorrectModel = context.explanationCorrectModel as 'Yes' | 'No' || 'No';
  const submissionFormat = Array.isArray(context.submissionFormat) ? context.submissionFormat as string[] : [];

  // Derive termly KPIs based on term
  const termlyKPIs = term === '1' ? ['Self-Discipline', 'Resilience', 'Growth Mindset'] :
                    term === '2' ? ['Leadership', 'Professionalism', 'Teamwork'] :
                    ['Community Engagement', 'Ethical Decision-Making', 'Social Responsibility'];

  return `
You are an expert in K-12 education, curriculum design, and instructional technology, specializing in the Tongston Entrepreneurial Education curriculum. Your task is to create a highly engaging, comprehensive, and practical project task plan for Term ${term} that inspires students and supports teachers in fostering character development. The project must center on the term theme (${termTheme}) and integrate three termly KPIs (${termlyKPIs.join(', ')}) within a cohesive, motivating project plot/scope. The plan should leverage Multiple Intelligences (Linguistic, Logical-Mathematical, Spatial, Bodily-Kinesthetic, Musical, Interpersonal, Intrapersonal, Naturalist) and 21st Century skills (Critical Thinking, Collaboration, Communication, Creativity, Digital Literacy, Problem-Solving) to ensure accessibility and engagement for all students.

## Context
- **Location**: ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}.
- **School Branding**:
  - Mission: ${mission}.
  - Vision: ${vision}.
  - Core Values: ${coreValues}.
- **Curriculum Type**: Tongston Entrepreneurial Education.
- **Year/Class**: ${yearClass}.
- **School Level**: ${schoolLevel}.
- **School Sub-Level**: ${subSchoolLevel}.
- **Students’ Average Age**: ${studentAge}.
- **Socio-Economic Context**: ${classesSocioEconomic}.
- **Term**: ${term} (${termTheme}).
- **Week**: ${week}.
- **Termly KPIs**: ${termlyKPIs.join(', ')}.
- **Pre-Requisite Competence**: ${preRequisite}.
- **Technology Access**: ${technologyAccess}.
- **Class Size**: ${classSize}.
- **Time Available**: ${timeAvailable} minutes.
- **Teaching Aids**: ${teachingAids.length > 0 ? teachingAids.join(', ') : 'None'}.
- **Special Education Needs (SEN)**: ${sen.length > 0 ? sen.map((s, i) => `${s} (Count: ${noStudents[i] || 'Not specified'}, Severity: ${security[i] || 'Not specified'}, Support: ${support}, Communication: ${communicationMethod}, Mobility: ${mobility}, Sensory: ${sensoryConsideration}, Social: ${socialInteraction}, Cognitive: ${cognitiveProcessingTime}, Medical: ${medicalEmergencyProtocol}, IEP: ${iepPlan}, Options: ${senOptions.join(', ') || 'Not specified'})`).join('; ') : 'None'}.
- **Weekly Project Facilitation**: ${weeklyProject ? 'Enabled' : 'Disabled'}.
- **Number of Sub-Tasks**: ${numberOfSubTasks} (labeled A${numberOfSubTasks === '2' || numberOfSubTasks === '3' ? ', B' : ''}${numberOfSubTasks === '3' ? ', C' : ''}).
- **Model Answer Provided**: ${correctModel}.
- **Explanation of Model Answer**: ${explanationCorrectModel}.
- **Submission Format**: ${submissionFormat.length > 0 ? submissionFormat.join(', ') : 'Not specified'}.

## Instructions
1. **Project Task Structure**:
   - Create a term-long project task plan for Term ${term}, centered on the theme (${termTheme}) and the three KPIs (${termlyKPIs.join(', ')}). Craft a compelling project plot/scope that ties the KPIs into a meaningful narrative, such as:
     - Term 1 (Personal Development): A personal growth journal where students set goals, track progress, and reflect on self-discipline, resilience, and growth mindset.
     - Term 2 (Professional Development): A mock entrepreneurial venture where students develop leadership, professionalism, and teamwork skills.
     - Term 3 (Public Development): A community service initiative addressing community engagement, ethical decision-making, and social responsibility.
   - Derive objectives and tasks from the Tongston Entrepreneurial Education curriculum, ensuring alignment with week (${week}), term (${term}), and KPIs.
   - Design ${numberOfSubTasks} sub-tasks for Week ${week}, labeled (e.g., A, B, C), each with clear, actionable instructions. For example, for 'Resilience' in Term 1, sub-task A could be a reflective journal on overcoming challenges, and sub-task B a group discussion on real-life scenarios.
   - Incorporate Multiple Intelligences to engage diverse learners:
     - Linguistic: Write reflective essays or narratives.
     - Logical-Mathematical: Create schedules or analyze data for projects.
     - Spatial: Design posters or visual presentations.
     - Bodily-Kinesthetic: Role-play scenarios or community activities.
     - Musical: Create songs or jingles related to KPIs.
     - Interpersonal: Collaborate on group tasks or peer reviews.
     - Intrapersonal: Reflect on personal growth or values.
     - Naturalist: Incorporate environmental themes (e.g., sustainability projects).
   - Embed 21st Century skills:
     - Critical Thinking: Analyze scenarios or evaluate solutions.
     - Collaboration: Work in teams to complete tasks.
     - Communication: Present ideas clearly in written or oral formats.
     - Creativity: Design innovative project outputs.
     - Digital Literacy: Use technology for research or presentations (if available).
     - Problem-Solving: Address real-world challenges tied to KPIs.
   - Tailor tasks to the class size (${classSize}), time available (${timeAvailable} minutes), and teaching aids (${teachingAids.join(', ') || 'None'}).
   - If technologyAccess is 'No', use traditional methods (e.g., handwritten reports, physical posters); if 'Yes', leverage digital tools (e.g., online presentations, digital portfolios).
   - Ensure tasks are culturally relevant to ${location}${state ? `, ${state}` : ''}${cities ? `, ${cities}` : ''}, using local examples (e.g., a community project addressing local issues like waste management in Lagos).
   - Align tasks with the socio-economic context (${classesSocioEconomic}), making them relatable (e.g., house-level projects for Nursery, state-level projects for Primary 5).
   - If correctModel is 'Yes', provide clear model answers for each sub-task (e.g., a sample journal entry for Self-Discipline). If explanationCorrectModel is 'Yes', include detailed explanations to guide students.
   - Assign submission formats (${submissionFormat.length > 0 ? submissionFormat.join(', ') : 'Not specified'}) to each sub-task, ensuring one format per task (e.g., In-Class Written Report for sub-task A, In-Class Presentation for sub-task B).
   - Use equal weighting for all sub-tasks unless specified otherwise.

2. **SEN Differentiation**:
   - Design inclusive tasks for specified SEN (${sen.length > 0 ? sen.join(', ') : 'None'}), addressing count, severity, communication, mobility, sensory, social, cognitive, medical, and IEP requirements.
   - Examples:
     - For Autism: Provide visual schedules and clear, step-by-step instructions.
     - For Dyslexia: Offer audio recordings or simplified text.
     - For Visual Impairment: Use tactile materials or audio descriptions.
     - For Emotional and Behavioral Disorders: Create safe, structured group activities.
     - For Physical Disabilities: Ensure tasks accommodate mobility limitations (e.g., seated presentations).
   - Ensure tasks are accessible and age-appropriate for ${studentAge} students at ${schoolLevel}.

3. **Weekly Project Facilitation Framework** (if enabled):
   - Provide a detailed facilitation framework for Week ${week}, including:
     - Teacher Role: Guide discussions, provide feedback, and model tasks (e.g., demonstrate a goal-setting exercise).
     - Student Role: Actively participate, collaborate, and reflect (e.g., share journal entries in pairs).
     - Sequencing: Outline the order of sub-tasks (e.g., brainstorming, drafting, presenting).
     - Suggested Activities: Include engaging methods like role-plays, peer reviews, or community visits.
   - Align the framework with the project plot/scope and KPIs to ensure coherence.

4. **Weekly Project Notes** (if enabled):
   - Create concise, student-friendly notes for Week ${week}, explaining the project’s purpose, KPIs, and key concepts.
   - Include vivid, locally relevant examples (e.g., for 'Community Engagement' in Term 3, describe a local market clean-up in ${location}).
   - Suggest visual aids (e.g., charts, posters) without generating images, ensuring accessibility for ${studentAge} students.

5. **Response Guidelines**:
   - Use structured markdown with clear, descriptive headings: Introduction, Project Overview, Project Plot/Scope, Termly Goal, Sub-Tasks, SEN Differentiation, Weekly Facilitation Framework (if enabled), Weekly Project Notes (if enabled), and Assumptions.
   - Start with an introduction summarizing the context, KPIs, and any assumptions for missing inputs (e.g., default sub-tasks if not specified).
   - Make the plan engaging, inclusive, and culturally sensitive, using relatable scenarios (e.g., a teamwork task inspired by local festivals in ${location}).
   - Target 1,200–1,800 words, ensuring depth for teachers while keeping instructions clear for students.
   - Comply with educational regulations (e.g., FERPA, COPPA) and ethical standards, ensuring age-appropriate, inclusive content.
   - Format the plan for easy copying, editing, or printing, with clear labels and actionable steps.

## Output Format
- Structured markdown with the following sections:
  - **Introduction**: Summarize the project’s purpose, KPIs, term theme, and context.
  - **Project Overview**: Detail the termly KPIs, project goal, and alignment with Tongston curriculum.
  - **Project Plot/Scope**: Describe the term-long narrative tying the KPIs together.
  - **Sub-Tasks**: List ${numberOfSubTasks} sub-tasks for Week ${week}, with instructions, submission formats, model answers (if enabled), and explanations (if enabled).
  - **SEN Differentiation**: Outline strategies for inclusivity based on SEN details.
  - **Weekly Facilitation Framework** (if enabled): Provide teacher and student roles, sequencing, and activities.
  - **Weekly Project Notes** (if enabled): Include student-friendly notes with examples and visual aid suggestions.
  - **Assumptions**: Note any default values or assumptions (e.g., equal weighting for sub-tasks).
- Ensure the output is teacher-friendly (clear, actionable) and student-accessible (engaging, relatable).
  `;
}

// Helper functions
function getSchoolLevel(yearClass: string): string {
  const nursery = ['Nursery 1', 'Nursery 2', 'Nursery 3', 'Kindergarten 1', 'Kindergarten 2', 'Kindergarten 3', 'Preparatory 1', 'Preparatory 2'];
  const primary = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'];
  const secondary = ['Junior Secondary 1', 'Junior Secondary 2', 'Junior Secondary 3', 'Senior Secondary 1', 'Senior Secondary 2', 'Senior Secondary 3', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const tertiary = ['Undergraduate Year 1', 'Undergraduate Year 2', 'Undergraduate Year 3'];

  if (nursery.includes(yearClass)) return 'Nursery School';
  if (primary.includes(yearClass)) return 'Primary School';
  if (secondary.includes(yearClass)) return 'Secondary School';
  if (tertiary.includes(yearClass)) return 'Tertiary School';
  return 'Not specified';
}

function getSchoolSubLevel(yearClass: string): string {
  const nursery = ['Nursery 1', 'Nursery 2', 'Nursery 3', 'Kindergarten 1', 'Kindergarten 2', 'Kindergarten 3', 'Preparatory 1', 'Preparatory 2'];
  const lowerPrimary = ['Primary 1', 'Primary 2', 'Primary 3', 'Grade 1', 'Grade 2', 'Grade 3', 'Basic 1', 'Basic 2', 'Basic 3'];
  const upperPrimary = ['Primary 4', 'Primary 5', 'Primary 6', 'Grade 4', 'Grade 5', 'Grade 6', 'Basic 4', 'Basic 5', 'Basic 6'];
  const juniorSecondary = ['Junior Secondary 1', 'Junior Secondary 2', 'Junior Secondary 3', 'JSS1', 'JSS2', 'JSS3', 'Grade 7', 'Grade 8', 'Grade 9'];
  const seniorSecondary = ['Senior Secondary 1', 'Senior Secondary 2', 'Senior Secondary 3', 'SS1', 'SS2', 'SS3', 'Grade 10', 'Grade 11', 'Grade 12'];
  const tertiary = ['Undergraduate Year 1', 'Undergraduate Year 2', 'Undergraduate Year 3'];

  if (nursery.includes(yearClass)) return 'Nursery School';
  if (lowerPrimary.includes(yearClass)) return 'Lower Primary School';
  if (upperPrimary.includes(yearClass)) return 'Upper Primary School';
  if (juniorSecondary.includes(yearClass)) return 'Junior Secondary School';
  if (seniorSecondary.includes(yearClass)) return 'Senior Secondary School';
  if (tertiary.includes(yearClass)) return 'Tertiary School';
  return 'Not specified';
}

function getAverageAge(yearClass: string): string {
  const ageMap: { [key: string]: string } = {
    'Nursery 1': '3–4 years', 'Kindergarten 1': '3–4 years', 'Preparatory 1': '3–4 years', 'Preparatory 2': '3–4 years',
    'Nursery 2': '4–5 years', 'Kindergarten 2': '4–5 years',
    'Nursery 3': '5–6 years', 'Kindergarten 3': '5–6 years',
    'Primary 1': '6–7 years', 'Grade 1': '6–7 years', 'Basic 1': '6–7 years',
    'Primary 2': '7–8 years', 'Grade 2': '7–8 years', 'Basic 2': '7–8 years',
    'Primary 3': '8–9 years', 'Grade 3': '8–9 years', 'Basic 3': '8–9 years',
    'Primary 4': '9–10 years', 'Grade 4': '9–10 years', 'Basic 4': '9–10 years',
    'Primary 5': '10–11 years', 'Grade 5': '10–11 years', 'Basic 5': '10–11 years',
    'Primary 6': '11–12 years', 'Grade 6': '11–12 years', 'Basic 6': '11–12 years',
    'Junior Secondary 1': '12–13 years', 'JSS1': '12–13 years', 'Grade 7': '12–13 years',
    'Junior Secondary 2': '13–14 years', 'JSS2': '13–14 years', 'Grade 8': '13–14 years',
    'Junior Secondary 3': '14–15 years', 'JSS3': '14–15 years', 'Grade 9': '14–15 years',
    'Senior Secondary 1': '15–16 years', 'SS1': '15–16 years', 'Grade 10': '15–16 years',
    'Senior Secondary 2': '16–17 years', 'SS2': '16–17 years', 'Grade 11': '16–17 years',
    'Senior Secondary 3': '17–18 years', 'SS3': '17–18 years', 'Grade 12': '17–18 years',
    'Undergraduate Year 1': '18+ years',
    'Undergraduate Year 2': '19+ years',
    'Undergraduate Year 3': '20+ years',
  };
  return ageMap[yearClass] || 'Not specified';
}

function getSocioEconomicContext(yearClass: string): string {
  const contextMap: { [key: string]: string } = {
    'Nursery 1': 'House', 'Kindergarten 1': 'House', 'Preparatory 1': 'House', 'Preparatory 2': 'House',
    'Nursery 2': 'Neighbourhood', 'Kindergarten 2': 'Neighbourhood',
    'Nursery 3': 'TESTS', 'Kindergarten 3': 'TESTS',
    'Primary 1': 'District', 'Grade 1': 'District', 'Basic 1': 'District',
    'Primary 2': 'Town', 'Grade 2': 'Town', 'Basic 2': 'Town',
    'Primary 3': 'TESTS', 'Grade 3': 'TESTS', 'Basic 3': 'TESTS',
    'Primary 4': 'County/Local Government Area (LGA)', 'Grade 4': 'County/Local Government Area (LGA)', 'Basic 4': 'County/Local Government Area (LGA)',
    'Primary 5': 'State', 'Grade 5': 'State', 'Basic 5': 'State',
    'Primary 6': 'TESTS', 'Grade 6': 'TESTS', 'Basic 6': 'TESTS',
    'Junior Secondary 1': 'Sub-National Region', 'JSS1': 'Sub-National Region', 'Grade 7': 'Sub-National Region',
    'Junior Secondary 2': 'Country', 'JSS2': 'Country', 'Grade 8': 'Country',
    'Junior Secondary 3': 'TESTS', 'JSS3': 'TESTS', 'Grade 9': 'TESTS',
    'Senior Secondary 1': 'Sub-Continental Region', 'SS1': 'Sub-Continental Region', 'Grade 10': 'Sub-Continental Region',
    'Senior Secondary 2': 'Continent', 'SS2': 'Continent', 'Grade 11': 'Continent',
    'Senior Secondary 3': 'TESTS', 'SS3': 'TESTS', 'Grade 12': 'TESTS',
    'Undergraduate Year 1': 'Global Socio-Economic (Trade) Block',
    'Undergraduate Year 2': 'World',
    'Undergraduate Year 3': 'TESTS',
  };
  return contextMap[yearClass] || 'Not specified';
}