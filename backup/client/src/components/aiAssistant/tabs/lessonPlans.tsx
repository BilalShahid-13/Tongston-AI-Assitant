import Chatbot from "@/components/Chatbot";
import CustomCheckBox from "@/components/CustomFields/CustomCheckBox";
import CustomInputField from "@/components/CustomFields/CustomInputField";
import CustomRadioButton from "@/components/CustomFields/CustomRadioButton";
import CustomSelectField from "@/components/CustomFields/CustomSelectField";
import CustomTextArea from "@/components/CustomFields/CustomTextArea";
import { Container, ContainerPlan, Grid, Heading, Row, SubmitButton } from "@/components/GenralComponents";
import LessonCard from "@/components/lessonCard";
import { allCities, allCountryNames, assesmentWeightLists, bloomTaxonomyLevel, classSizes, cognitiveProcessingTime, communicationMethod, curriculumTypes, iepPlan, juniorSecondarySchool, mcqsQuestions, medicalEmergencyProtocol, mobility, nationalTestList, nurserySchool, primartSchool, secondarySchool, securityLevel, senDifferentiation, seniorSecondarySchool, sensoryConsideration, settings, socialInteraction, studentAge, studentConduct_KPI, subjectLists, supportProvided, teachingAids, termOptions, tertiarySchool, timeOptions, totalNumberofQuestionsAsString, typesofQuestions, weekList, yearClasses, yearClassMappings } from "@/lib/lessonPlanConstant";
import { lessonPlanForm, type lessonPlanFormSchema } from "@/schema/schema.types";
import { useCurriculumStore } from "@/store/curriculumStore";
import type { CurriculumEntry } from "@/types";
import { onSubmitFn } from "@/utils/onSubmit";
import { showFieldErrors } from "@/utils/showFieldError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from "react-hook-form";

export default function LessonPlan() {
  const form: UseFormReturn<lessonPlanFormSchema> = useForm<lessonPlanFormSchema>({
    resolver: zodResolver(lessonPlanForm),
    defaultValues: {
      sen: [],
      teachingAids: [],
      location: '',
      state: ''
    }
  });


  const yearClass = form.watch("yearClass");
  const curriculum = form.watch("curriculum") === "Tongston Entrepreneurial Education - PRIORITY";
  const currentSchoolLevel = form.watch("schoolLevel");
  const subSchoolLevel = form.watch("subSchoolLevel");
  const studentAvgAge = form.watch("studentAge");
  const classesSocioEconomic = form.watch("classesSocioEconomic");
  const term = form.watch("term");
  const state = form.watch("state");
  const subject = form.watch("subject");
  const [cities, setCities] = useState<string[]>([]);
  const [curriculumData, setCurriculumData] = useState<CurriculumEntry[]>([]);
  const [data, setData] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showLessonPlan, setShowLessonPlan] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const { isLoaded, data: excelData } = useCurriculumStore();

  useEffect(() => {
    if (isLoaded) {
      setCurriculumData(excelData);
    }
  }, [isLoaded, excelData]);


  const findTopic = () => {
    const subject = form.getValues("subject");
    const yearClass = form.getValues("yearClass");

    const yearMatch = yearClassMappings.find(
      (entry) => entry.normalized === yearClass
    );
    const normalizedYearClass = yearMatch?.raw;

    const match = curriculumData.find(
      (entry) =>
        entry.Subject === subject &&
        entry["Year/Class"] === normalizedYearClass
    );
    form.setValue("topic", match?.Topic || "No topic found for this subject and class.");
    // setMatchedTopic(match?.Topic || "No topic found for this subject and class.");
  };

  useEffect(() => {
    if (subject && yearClass && curriculum) {
      findTopic();
    }
  }, [subject, yearClass])

  const handleSubSchoolLevel = useCallback(() => {
    const primary1 = primartSchool.slice(0, 3);
    const primary2 = primartSchool.slice(3, 6);
    // const junior1 =
    if (nurserySchool.includes(yearClass)) {
      form.setValue("subSchoolLevel", "Nursery School");
    }
    else if (primary1.includes(yearClass)) {
      form.setValue("subSchoolLevel", "Lower Primary School");
    }
    else if (primary2.includes(yearClass)) {
      form.setValue("subSchoolLevel", "Upper Primary School");
    }
    else if (juniorSecondarySchool.includes(yearClass)) {
      form.setValue("subSchoolLevel", "Junior Secondary School");
    }
    else if (seniorSecondarySchool.includes(yearClass)) {
      form.setValue("subSchoolLevel", "Senior Secondary School")
    }
    else if (tertiarySchool.includes(yearClass)) {
      form.setValue("subSchoolLevel", "Tertiary School")
    }
  }, [yearClass, subSchoolLevel, form])

  const handleSchoolLevel = useCallback(() => {
    let newSchoolLevel = "";

    if (nurserySchool.includes(yearClass)) {
      newSchoolLevel = "Nursery School";
    } else if (primartSchool.includes(yearClass)) {
      newSchoolLevel = "Primary School";
    } else if (secondarySchool.includes(yearClass)) {
      newSchoolLevel = "Secondary School";
    } else if (tertiarySchool.includes(yearClass)) {
      newSchoolLevel = "Tertiary School";
    }
    if (newSchoolLevel !== currentSchoolLevel) {
      form.setValue("schoolLevel", newSchoolLevel);
    }
  }, [yearClass, currentSchoolLevel, form])

  const handleStudentAge = useCallback(() => {
    const matchedItem = studentAge.find(item => item.name === yearClass);
    if (matchedItem) {
      form.setValue("studentAge", matchedItem.ageRange);
    } else {
      form.setValue("studentAge", "");
    }
  }, [yearClass, studentAvgAge, form])

  const handleSocioEconomic = useCallback(() => {
    switch (yearClass) {
      case "Nursery 1/Kindergarten 1/Preparatory 1/Preparatory 2":
        form.setValue("classesSocioEconomic", "House");
        break;
      case "Nursery 2/Kindergarten 2":
        form.setValue("classesSocioEconomic", "Neighbourhood");
        break;
      case "Nursery 2/Kindergarten 3":
        form.setValue("classesSocioEconomic", "TESTS");
        break;
      case "Primary 1/Grade 1/Basic 1":
        form.setValue("classesSocioEconomic", "District");
        break;
      case "Primary 2/Grade 2/Basic 2":
        form.setValue("classesSocioEconomic", "Town");
        break;
      case "Primary 2/Grade 2/Basic 3":
        form.setValue("classesSocioEconomic", "TESTS");
        break;
      case "Primary 4/Grade 4/Basic 4":
        form.setValue("classesSocioEconomic", "County/Local Government Area (LGA)");
        break;
      case "Primary 5/Grade 5/Basic 5":
        form.setValue("classesSocioEconomic", "State");
        break;
      case "Primary 6/Grade 6/Basic 6":
        form.setValue("classesSocioEconomic", "TESTS");
        break;
      case "Junior Secondary 1/JSS1/JS1/Grade 7":
        form.setValue("classesSocioEconomic", "Sub-National Region");
        break;
      case "Junior Secondary 1/JSS1/JS1/Grade 8":
        form.setValue("classesSocioEconomic", "Country");
        break;
      case "Junior Secondary 1/JSS1/JS1/Grade 9":
        form.setValue("classesSocioEconomic", "TESTS");
        break;
      case "Senior Secondary 1/ SS1/Grade 10":
        form.setValue("classesSocioEconomic", "Sub-Continental Region");
        break;
      case "Senior Secondary 1/ SS1/Grade 11":
        form.setValue("classesSocioEconomic", "Continent");
        break;
      case "Senior Secondary 1/ SS1/Grade 11":
        form.setValue("classesSocioEconomic", "TESTS");
        break;
      case "Undergraduate Year 1":
        form.setValue("classesSocioEconomic", "Global Socio-Economic (Trade) Block");
        break;
      case "Undergraduate Year 2":
        form.setValue("classesSocioEconomic", "World");
        break;
      case "Undergraduate Year 3":
        form.setValue("classesSocioEconomic", "TESTS");
        break;
    }
  }, [yearClass, classesSocioEconomic, form])

  const handleTermTheme = useCallback(() => {
    switch (term) {
      case "1":
        form.setValue("termTheme", "Personal Development");
        break;
      case "2":
        form.setValue("termTheme", "Professional Development");
        break;
      case "3":
        form.setValue("termTheme", "Public Development");
        break;
    }
  }, [yearClass, term, form])

  const handleCities = useCallback(() => {
    const citiesName = allCities?.find(item => item.state === form.getValues("state"))?.cities;
    setCities(citiesName ?? [])
  }, [state, form])

  const handleSubject = useCallback(() => {
    if (subject) {
      form.setValue("subjectDicipline", subjectLists.find(items => items.subject === subject)?.discipline ?? "")
    }
  }, [subject, form])

  useEffect(() => {
    onError()
  }, [form.formState.errors])


  useEffect(() => {
    handleSchoolLevel();
    handleSubSchoolLevel();
    handleStudentAge();
    handleSocioEconomic()
    handleTermTheme();
    handleCities();
    handleSubject();
  }, [handleSubSchoolLevel, handleSchoolLevel, handleSocioEconomic, handleStudentAge, handleTermTheme, handleCities, handleSubject])


  const onSubmit = async (data: lessonPlanFormSchema) => {
    const payload = {
      bloomLevel: data.bloomLevel,
      classSize: data.classSize,
      classesSocioEconomic: data.classesSocioEconomic,
      curriculum: data.curriculum,
      location: data.location,
      schoolLevel: data.schoolLevel,
      studentAge: data.studentAge,
      subSchoolLevel: data.subSchoolLevel,
      subject: data.subject,
      subjectDicipline: data.subjectDicipline,
      term: data.term,
      termTheme: data.termTheme,
      timeAvailable: data.timeAvailable,
      week: data.week,
      yearClass: data.yearClass,
    }
    await onSubmitFn({
      payload,
      api: "search/lessonPlan",
      setStatusMessage,
      setShowPlan: setShowLessonPlan,
      setData, setLoading
    })
    console.log("Form data submitted:", data);
  };

  const onError = () => {
    console.log(form.formState.errors)
    showFieldErrors(form.formState.errors); // for react-hook-form local errors
  }

  return (
    <>
      <ContainerPlan
        showPanel={showLessonPlan}
      // showPanel={showAssessmentPlan}
      >
        <LessonCard title="Subject Lesson Plan & Notes Generator">
          <div className="h-[500px] relative overflow-y-scroll">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 mx-3">
                <Container>
                  <Heading>Contextualization Parameters</Heading>
                  <Grid>
                    <CustomSelectField
                      form={form}
                      name="location"
                      fieldName="Location"
                      isRequired
                      list={allCountryNames}
                    />
                    {form.watch("location") === "Nigeria" &&
                      <CustomSelectField
                        form={form}
                        isRequired
                        name="state"
                        fieldName="States"
                        list={allCities.map(items => items.state)}
                        placeholder="Select a State"
                      />
                    }
                    {form.watch("state") && cities &&
                      <CustomSelectField
                        form={form}
                        isRequired
                        name="cities"
                        fieldName="Cities"
                        list={cities}
                        placeholder="Select a city"
                      />
                    }
                    <CustomSelectField
                      form={form}
                      name="setting"
                      fieldName="Setting"
                      placeholder="Select a Setting"
                      list={settings}
                    />
                  </Grid>
                </Container>
                <Container>
                  <Heading>School Branding Information</Heading>
                  <Row gaps="lg">
                    <CustomTextArea
                      form={form}
                      name="mission"
                      fieldName="School Branding - Mission"
                      placeholder="Enter your brand name" />
                    <CustomTextArea
                      form={form}

                      name="vision"
                      fieldName="School Branding - Vision"
                      placeholder="Enter your vision" />
                    <CustomTextArea
                      form={form}
                      name="coreValues"
                      fieldName="School Branding - Core Values"
                      placeholder="Enter your core values" />
                    <CustomSelectField
                      className="w-full"
                      form={form}
                      isRequired
                      name="curriculum"
                      fieldName="School Branding – Curriculum / Scheme / Scheme of Work Type"
                      placeholder="Select a Curriculum"
                      list={curriculumTypes}
                    />
                  </Row>
                </Container>
                <Container>
                  <Heading> Class and Student Demographics</Heading>
                  <Row gaps="lg">
                    <CustomSelectField
                      className="w-full"
                      form={form}
                      isRequired
                      name="yearClass"
                      fieldName="Year/Class"
                      placeholder="Select a Year/Class"
                      list={yearClasses}
                    />
                    {form.watch("schoolLevel") &&
                      <CustomInputField
                        form={form}
                        name="schoolLevel"
                        fieldName="School Level"
                      />
                    }
                    {form.watch("subSchoolLevel") &&
                      <CustomInputField
                        form={form}
                        name="subSchoolLevel"
                        fieldName="Sub School Level"
                      />
                    }
                    {form.watch("studentAge") &&
                      <CustomInputField
                        form={form}
                        name="studentAge"
                        fieldName="Students Average Age (Years)"
                      />
                    }
                    {form.watch("classesSocioEconomic") &&
                      <CustomInputField
                        form={form}
                        name="classesSocioEconomic"
                        fieldName="Classes’ Socio-Economic Contexts/Boundaries/Limits"
                      />
                    }
                  </Row>
                </Container>
                <Container>
                  <Heading>Lesson Planning Specifics</Heading>
                  <Container>
                    <Grid>
                      <CustomSelectField
                        form={form}
                        isRequired
                        name="week"
                        fieldName="Week"
                        placeholder="Select a Week"
                        list={weekList}
                      />
                      <CustomSelectField
                        form={form}
                        isRequired
                        name="term"
                        fieldName="Term"
                        placeholder="Select a Term"
                        list={termOptions}
                      />
                      {form.watch("term") && <CustomInputField
                        form={form}
                        name="termTheme"
                        fieldName="Term Theme"
                      />}
                    </Grid>
                    <Container>
                      <CustomSelectField
                        form={form}
                        className="max-w-md"
                        name="subject"
                        list={subjectLists.flatMap(items => items.subject)}
                        isRequired
                        placeholder="Select a Subject"
                        fieldName="Subject"
                      />
                      {form.watch("subject") &&
                        <CustomInputField
                          form={form}
                          name="subjectDicipline"
                          isRequired
                          placeholder="Select a Subject Dicipline"
                          fieldName="Subject Dicipline"
                        />
                      }
                      {form.watch("curriculum") === "Tongston Entrepreneurial Education - PRIORITY" ? <CustomTextArea
                        form={form}
                        name="topic"
                        isRequired
                        isDisabled={true}
                        fieldName="Subject Unit/Topic"
                      /> :
                        <CustomTextArea
                          form={form}
                          name="topic"
                          isRequired
                          isDisabled={false}
                          placeholder="Select a Subject Unit/Topic"
                          fieldName="Select a Subject Unit/Topic"
                        />
                      }
                      <CustomTextArea
                        form={form}
                        name="subTopic"
                        placeholder="Select a Subject Sub-Unit/Sub-Topic"
                        // isDisabled={false}
                        fieldName="Subject Sub-Unit/Sub-Topic"
                      />
                    </Container>
                    <Row gaps="md">
                      <CustomTextArea
                        form={form}
                        name="aim"
                        placeholder="Select aim or goal or rationale"
                        fieldName="Aim/Goal/Rationale"
                      />
                      <CustomTextArea
                        form={form}
                        name="preRequisite"
                        placeholder="Select pre-requisite competence (knowledge, skills, attitude)"
                        fieldName="PRE-REQUISITE COMPETENCE (Knowledge, Skills, Attitude)"
                      />
                      <CustomSelectField
                        form={form}
                        name="bloomLevel"
                        isRequired
                        placeholder="Select a Bloom Level"
                        fieldName="Subject Level of Difficulty for the Learning / Lesson Objectives (using Blooms Taxonomy)"
                        list={bloomTaxonomyLevel}
                      />
                      <CustomInputField
                        form={form}
                        name="subject"
                        isRequired
                        placeholder="Select a Subject"
                        fieldName="Subject Learning / Lesson Objectives"
                      />
                      <CustomSelectField
                        form={form}
                        name="classSize"
                        fieldName="Class Size"
                        isRequired
                        placeholder="Select a Class Size"
                        list={classSizes}
                      />
                      <CustomSelectField
                        form={form}
                        name="timeAvailable"
                        fieldName="Time Available"
                        placeholder="Select a Time Available"
                        isRequired
                        list={timeOptions}
                      />
                      <CustomCheckBox
                        form={form}
                        isRequired
                        className="flex flex-col mt-2"
                        name="teachingAids"
                        fieldName="Availability of Teaching Aids / Learning Resources / Instructional Materials"
                        list={teachingAids} />
                    </Row>
                  </Container>
                </Container>
                <Container>
                  <Heading>Special Education Needs (SEN) Differentiation</Heading>
                  <Row gaps="lg">
                    <Row>
                      <CustomCheckBox
                        form={form}
                        name="sen"
                        fieldName="SPECIAL EDUCATION NEEDS (SEN) DIFFERENTIATION"
                        list={senDifferentiation.map((item) => item.name)}
                      />
                    </Row>
                    {form.watch("sen") && Array.isArray(form.getValues("sen") ?? []) && (form.getValues("sen") ?? []).length > 0 &&
                      <>
                        <Row gaps="lg">
                          <CustomCheckBox
                            form={form}
                            name="noStudents"
                            fieldName="Number of students with this need"
                            list={["1", "2", "3", "4", "5+"]}
                          />
                          <CustomCheckBox
                            form={form}
                            name="security"
                            fieldName="Severity/Level of need"
                            list={securityLevel}
                          />
                        </Row>
                        <Grid>
                          <CustomSelectField
                            form={form}
                            name="support"
                            fieldName="1:1 Support Provided?"
                            list={supportProvided}
                          />
                          <CustomSelectField
                            form={form}
                            name="communicationMethod"
                            fieldName="Preferred Communication Method"
                            list={communicationMethod}
                          />
                          <CustomSelectField
                            form={form}
                            name="mobility"
                            fieldName="Mobility or Accessibility Needs"
                            list={mobility}
                          />
                          <CustomSelectField
                            form={form}
                            name="sensoryConsideration"
                            fieldName="Sensory Considerations"
                            list={sensoryConsideration}
                          />
                          <CustomSelectField
                            form={form}
                            name="socialInteraction"
                            fieldName="Social Interaction Support"
                            list={socialInteraction}
                          />
                          <CustomSelectField
                            form={form}
                            name="cognitiveProcessingTime"
                            fieldName="Cognitive Processing Time"
                            list={cognitiveProcessingTime}
                          />
                          <CustomSelectField
                            form={form}
                            name="cognitiveProcessingTime"
                            fieldName="Medical/Emergency Protocols"
                            list={medicalEmergencyProtocol}
                          />
                          <CustomSelectField
                            form={form}
                            name="iepPlan"
                            fieldName="IEP or Documented Plan in Place?"
                            list={iepPlan}
                          />
                        </Grid>
                        <Row>
                          <Heading>SEND Differentiation Dropdown Options</Heading>
                          <Row gaps="md">
                            {senDifferentiation
                              .filter((item) => form.watch("sen")?.includes(item.name))
                              .map((item) => (
                                <CustomCheckBox
                                  key={item.name}
                                  form={form}
                                  name="senOptions"
                                  fieldName={item.name}
                                  list={item.items}
                                />
                              ))}
                          </Row>

                        </Row>
                      </>}
                  </Row>
                </Container>
                <Container>
                  <Heading>Assessment Details</Heading>
                  <Row gaps="md">
                    <CustomSelectField
                      form={form}
                      name="studentConduct"
                      placeholder="Select a character KPI"
                      fieldName="Student Conduct & Character KPI"
                      list={studentConduct_KPI}
                    />
                    <CustomSelectField
                      form={form}
                      name="noQuestions"
                      placeholder="Select a number"
                      fieldName="Total Number of Questions/Activities"
                      list={totalNumberofQuestionsAsString}
                    />
                    <Container>
                      <h6 className="font-medium text-base">MCQ - Learners select the best option from a list of answers.
                      </h6>
                      <CustomCheckBox
                        className="grid grid-cols-1"
                        form={form}
                        name="questionTypes"
                        fieldName="Type of Questions/Tasks"
                        list={mcqsQuestions}
                      />
                    </Container>
                    <CustomCheckBox
                      className="grid grid-cols-1"
                      form={form}
                      fieldName=""
                      name="questionTypes"
                      list={typesofQuestions} />

                    {form.watch("questionTypes") && <CustomSelectField
                      className="grid grid-cols-1"
                      form={form}
                      placeholder="Select a number of options"
                      fieldName="Maximum Number of Options to a question Provided"
                      name="maxOptions"
                      list={[
                        "2", "4", "5"
                      ]} />}
                    <CustomInputField
                      placeholder="Enter a number of words"
                      name="maxAnswers"
                      isDisabled={false}
                      form={form}
                      fieldName="Maximum number of words in an answer to answer question"
                    />
                    <CustomRadioButton
                      defaultValue="No"
                      list={["Yes", "No"]}
                      isRequired={false}
                      form={form} name="correctModel"
                      fieldName="Correct/Model Answer Provided" />

                    {form.watch("correctModel") === "Yes" && <CustomRadioButton
                      defaultValue="No"
                      list={["Yes", "No"]}
                      isRequired={false}
                      form={form} name="explanationCorrectModel"
                      fieldName="Explanation of Correct/Model Answer"
                    />}
                    {form.watch("questionTypes") && <CustomSelectField
                      form={form} name="assessmentWeight"
                      fieldName="Assessment Type"
                      placeholder="Select an Assessment Type"
                      list={assesmentWeightLists} />}

                    <CustomRadioButton
                      defaultValue="No"
                      form={form} name="assessmentLearning"
                      fieldName="Should the assessment be matched to a standard of national / international standardized tests / examination"
                      list={["Yes", "No"]} />
                    {form.watch("assessmentLearning") === "Yes" &&
                      <CustomSelectField
                        form={form}
                        name="nationalTest"
                        fieldName=""
                        className="max-w-md"
                        placeholder="Select an Assessment Type"
                        list={nationalTestList}
                      />}

                  </Row>
                </Container>
                <Container>
                  <Heading>Activities and Notes</Heading>
                  <Row gaps="md">
                    <CustomRadioButton
                      name="teacher"
                      list={["Yes", "No"]}
                      defaultValue="No"
                      form={form}
                      fieldName="Subject Lesson / Learning Activities - Teacher" />


                  </Row>
                </Container>
                <SubmitButton variant="primary"
                  loading={loading}
                  text="Lesson Plan"
                  statusMessage={statusMessage}
                />
              </form>
            </FormProvider>
          </div>
        </LessonCard >
        <LessonCard
          ref={chatbotRef}
          title="Ai Assistant"
          className={`transition-opacity duration-700 ease-in-out
            max-h-screen
             ${showLessonPlan ? "opacity-100" : "opacity-0"
            }`}>
          <Chatbot chats={data} />
        </LessonCard>
      </ContainerPlan >
    </>
  );
}
