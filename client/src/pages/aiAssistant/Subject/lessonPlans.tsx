import Chatbot from "@/components/Chatbot";
import CustomCheckBox from "@/components/CustomFields/CustomCheckBox";
import CustomInputField from "@/components/CustomFields/CustomInputField";
import CustomRadioButton from "@/components/CustomFields/CustomRadioButton";
import CustomSelectField from "@/components/CustomFields/CustomSelectField";
import CustomTextArea from "@/components/CustomFields/CustomTextArea";
import { Container, ContainerPlan, Grid, Heading, Row, SubmitButton } from "@/components/GenralComponents";
import PlanCard from "@/components/planCard";
import ScrollAnimate from "@/components/scrollAnimate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allCities, allCountryNames, assesmentWeightLists, bloomTaxonomyLevel, classSizes, cognitiveProcessingTime, communicationMethod, curriculumTypes, iepPlan, mcqsQuestions, medicalEmergencyProtocol, mobility, nationalTestList, securityLevel, senDifferentiation, sensoryConsideration, settings, socialInteraction, studentConduct_KPI, subjectLists, supportProvided, teachingAids, termOptions, timeOptions, totalNumberofQuestionsAsString, typesofQuestions, weekList, yearClasses } from "@/constants/lessonPlanConstant";
import { useOnError } from "@/hooks/useOnError";
import { lessonPlanForm, type lessonPlanFormSchema } from "@/schema/schema.schema";
import { useCurriculumStore } from "@/store/curriculumStore";
import { useProjectTaskFacilitationStore } from "@/store/projectTaskFacilitationStore";
import { onSubmitFn } from "@/utils/onSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from "react-hook-form";

export default function LessonPlan() {
  const form: UseFormReturn<lessonPlanFormSchema> = useForm<lessonPlanFormSchema>({
    resolver: zodResolver(lessonPlanForm),
    defaultValues: {
      sen: [],
      teachingAids: [],
      location: '',
      state: '',
      technologyAccess: "No",
    }
  });


  const [data, setData] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showLessonPlan, setShowLessonPlan] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(null);

  const { isLoaded, data: excelData } = useCurriculumStore();
  const { handleCities, cities, handleYearClass, handleTerm, handleCurriculum,
    setCurriculumEntry, handleSubjectDicipline,setOtherTeachingAids } = useProjectTaskFacilitationStore();
  // const { downloadPDF } = useMarkdownStore()
  const navigate = useNavigate()
  useEffect(() => {
    if (isLoaded) {
      setCurriculumEntry(excelData, isLoaded);
    }
  }, [isLoaded, excelData]);

  useEffect(() => {
    handleCurriculum(form);
  }, [
    form.watch("curriculum"), form.watch("subject"), form.watch("yearClass")
  ])

  useEffect(() => {
    setOtherTeachingAids(form);
  }, [form.watch("teachingAids")])

  const onSubmit = async (data: lessonPlanFormSchema) => {
    setData("");
    await onSubmitFn({
      payload: data,
      api: "subject/lessonPlan",
      setStatusMessage,
      navigate,
      setShowPlan: setShowLessonPlan,
      setData, setLoading
    })
    // form.reset(resetPlanValues(lessonPlanForm))
  };

  return (
    <>
      <ScrollAnimate scrollRef={scrollRef} />
      <ContainerPlan
        showPanel={showLessonPlan}
      >
        <PlanCard title="Subject Lesson Plan"
          ref={scrollRef}
          className="relative h-[90vh] overflow-y-scroll">
          <ScrollArea>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, useOnError())}
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
                        onChange={() => handleCities(form)}
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
                      onChange={() => handleYearClass(form)}
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
                        onChange={() => handleTerm(form)}
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
                        onChange={() => handleSubjectDicipline(form)}
                        fieldName="Subject"
                      />
                      {form.watch("subject") &&
                        <CustomInputField
                          form={form}
                          name="subjectDiscipline"
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
                      <CustomRadioButton<lessonPlanFormSchema>
                        form={form}
                        name="technologyAccess"
                        isRequired
                        defaultValue="No"
                        list={["Yes", "No"]}
                        fieldName="Availability / Access of Technology"
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
                      {form.watch("teachingAids")?.includes("Other") ?
                        <CustomInputField
                          placeholder="Select Other Teaching Aids / Learning Resources / Instructional Materials"
                          name="teachingAids"
                          isDisabled={false}
                          fieldName="Other Teaching Aids / Learning Resources / Instructional Materials"
                          form={form}
                        /> : null
                      }
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
                            placeholder="Select a 1:1 Support Provided?"
                            list={supportProvided}
                          />
                          <CustomSelectField
                            form={form}
                            name="communicationMethod"
                            placeholder="Select a Preferred Communication Method"
                            fieldName="Preferred Communication Method"
                            list={communicationMethod}
                          />
                          <CustomSelectField
                            form={form}
                            name="mobility"
                            fieldName="Mobility or Accessibility Needs"
                            placeholder="Select a Mobility or Accessibility Needs"
                            list={mobility}
                          />
                          <CustomSelectField
                            form={form}
                            name="sensoryConsideration"
                            fieldName="Sensory Considerations"
                            placeholder="Select a Sensory Considerations"
                            list={sensoryConsideration}
                          />
                          <CustomSelectField
                            form={form}
                            name="socialInteraction"
                            placeholder="Select a Social Interaction Support"
                            fieldName="Social Interaction Support"
                            list={socialInteraction}
                          />
                          <CustomSelectField
                            form={form}
                            name="cognitiveProcessingTime"
                            placeholder="Select a Cognitive Processing Time"
                            fieldName="Cognitive Processing Time"
                            list={cognitiveProcessingTime}
                          />
                          <CustomSelectField
                            form={form}
                            name="cognitiveProcessingTime"
                            placeholder="Select a Cognitive Processing Time"
                            fieldName="Medical/Emergency Protocols"
                            list={medicalEmergencyProtocol}
                          />
                          <CustomSelectField
                            form={form}
                            name="iepPlan"
                            placeholder="Select a IEP or Documented Plan in Place?"
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
          </ScrollArea>
        </PlanCard >
        <PlanCard
          ref={chatbotRef}
          title="Ai Assistant"
          className={`transition-opacity duration-700 ease-in-out
            max-h-screen mt-4 flex flex-col gap-4
             ${showLessonPlan ? "opacity-100" : "opacity-0"
            }`}>
          <Chatbot chats={data}
          />

        </PlanCard>
      </ContainerPlan >
    </>
  );
}
