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
import { continousAssessmentWeekList, numberofQuestionLists, submisisonList, typeofAssesments } from "@/constants/assesmentPlanConstant";
import { allCities, allCountryNames, assesmentWeightLists, bloomTaxonomyLevel, cognitiveProcessingTime, communicationMethod, curriculumTypes, iepPlan, medicalEmergencyProtocol, mobility, nationalTestList, securityLevel, senDifferentiation, sensoryConsideration, socialInteraction, subjectLists, supportProvided, termOptions, timeOptions, typesofQuestions, yearClasses } from "@/constants/lessonPlanConstant";
import { useOnError } from "@/hooks/useOnError";
import { assesmentPlanForm, type assesmentPlanFormSchema } from "@/schema/schema.schema";
import { useCurriculumStore } from "@/store/curriculumStore";
import { useProjectTaskFacilitationStore } from "@/store/projectTaskFacilitationStore";
import { onSubmitFn } from "@/utils/onSubmit";
import { resetPlanValues } from "@/utils/resetPlanValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

const Assessments = () => {
  const form: UseFormReturn<assesmentPlanFormSchema> = useForm<assesmentPlanFormSchema>({
    resolver: zodResolver(assesmentPlanForm),
    defaultValues: {
      technologyAccess: "No",
    }
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showAssessmentPlan, setShowAssessmentPlan] = useState(false);
  const [data, setData] = useState<string | null>("");
  const chatbotRef = useRef<HTMLDivElement>(null);
  const { handleCities, cities, handleYearClass, handleTerm, handleCurriculum, resetContinousAssessment, setCurriculumEntry, handleSubjectDicipline } = useProjectTaskFacilitationStore();
  const { isLoaded, data: excelData } = useCurriculumStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      setCurriculumEntry(excelData, isLoaded);
    }
  }, [isLoaded, excelData]);

  useEffect(() => {
    resetContinousAssessment(form);
  }, [form.watch("assessmentType")])

  useEffect(() => {
    handleCurriculum(form);
  }, [
    form.watch("curriculum"), form.watch("subject"), form.watch("yearClass")
  ])

  const onSubmit = async (formData: assesmentPlanFormSchema) => {
    console.log(formData)
    const payload = {
      assessmentType: formData.typeofAssessments,
      assessmentWeek: formData.continuousAssessmentWeek,
      location: formData.location,
      schoolCurriculum: formData.curriculum,
      yearClass: formData.yearClass,
      schoolLevel: formData.schoolLevel,
      subSchoolLevel: formData.subSchoolLevel,
      studentAge: formData.studentAge,
      classesSocioEconoic: formData.classesSocioEconomic,
      term: formData.term,
      termTheme: formData.termTheme,
      subject: formData.subject,
      subjectDiscipline: formData.subjectDiscipline,
      subjectUnitTopic: formData.topic,
      subjectSubTopic: formData.subTopic || '', // optional mapping
      bloom: formData.bloomLevel,
      subjectLearning: formData.subject,
      timeAvailable: formData.timeAvailable,
      sen: formData.sen,
      noOfStudents: formData.noStudents,
      severity: formData?.security || '',
      supportProvide: formData.support,
      PreferredCommuniation: 'Verbal', // or map if dynamic
      mobility: '',
      sensory: formData.sensoryConsideration,
      socialInteraction: formData.socialInteraction,
      cognitive: formData.cognitiveProcessingTime,
      medical: '',
      IEP: formData.iepPlan,
      send: formData.correctModel,
      cbtTest: formData.cbtTest,
      examination: formData.explanationCorrectModel,
      totalQuesions: formData.noQuestions,
      questionTypes: formData.questionTypes,
      maxAnswer: formData.maxAnswers,
      answerProvided: formData.maxOptions,
      nationalTest: formData.nationalTest || 'No',
      technologyAccess: formData.technologyAccess || "Yes",
      // teachingAids: formData.teachingAids || ["Textbooks and Workbooks"]
    };
    const res = await onSubmitFn({
      payload: payload,
      // payload: cleanPayload(payload),
      api: "subject/assessmentPlan",
      setStatusMessage,
      setShowPlan: setShowAssessmentPlan,
      setData,
      navigate,
      setLoading
    })
    if (res?.error) {
      console.error("🔥 API Error:", `${res.error}${res.status}`);
      toast.error(`${res.error}-"${res.status}"`);
      return;
    }
    form.reset(resetPlanValues(assesmentPlanForm))
  };

  return (
    <>
      <ScrollAnimate scrollRef={scrollRef} />
      <ContainerPlan
        showPanel={showAssessmentPlan}
      >
        <PlanCard title="Subject Assessments"
          ref={scrollRef}
          className="relative h-[90vh] overflow-y-scroll">
          <ScrollArea
          >
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, useOnError())}
                className="flex flex-col gap-8 mx-3">
                <Container>
                  <Heading>Assessment Type & Scheduling</Heading>
                  <CustomSelectField
                    form={form}
                    isRequired
                    name="typeofAssessments"
                    fieldName="Type of Assessment"
                    placeholder="Select a assessment type"
                    list={typeofAssesments}
                  />
                  {form.watch("typeofAssessments") === "Continuous Assessment" &&
                    <CustomCheckBox<assesmentPlanFormSchema>
                      form={form}
                      column={3}
                      fieldName="Continuous Assessment Week"
                      isRequired
                      name={"continuousAssessmentWeek"}
                      list={continousAssessmentWeekList}
                    />}
                  {form.watch("typeofAssessments") === "Mid Term Assessment" &&
                    <CustomCheckBox<assesmentPlanFormSchema>
                      form={form}
                      column={3}
                      fieldName="Mid Term Assessment Week"
                      isRequired
                      isDisabled
                      showReadonlyList={5}
                      name={"continuousAssessmentWeek"}
                      list={continousAssessmentWeekList}
                    />}
                  {form.watch("typeofAssessments") === "End of Term Assessment" &&
                    <CustomCheckBox<assesmentPlanFormSchema>
                      form={form}
                      column={3}
                      fieldName="End of Term Assessment Week"
                      isRequired
                      isDisabled
                      showReadonlyList={10}
                      name={"continuousAssessmentWeek"}
                      list={continousAssessmentWeekList}
                    />}
                </Container>

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
                      className="w-full"
                      form={form}
                      isRequired
                      name="curriculum"
                      fieldName="School Branding – Curriculum / Scheme / Scheme of Work Type"
                      placeholder="Select a Curriculum"
                      list={curriculumTypes}
                    />
                  </Grid>
                </Container>

                {/* Class and Student Demographics */}
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
                      onChange={() => {
                        handleYearClass(form)
                      }}
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
                {/* Lesson Planning Specifics */}
                <Container>
                  <Heading>Lesson Planning Specifics</Heading>
                  <Container>
                    <Grid>
                      <CustomSelectField
                        form={form}
                        isRequired
                        name="term"
                        fieldName="Term"
                        onChange={() => handleTerm(form)}
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
                        onChange={() => handleSubjectDicipline(form)}
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
                          placeholder="Subject Unit/Topic"
                          fieldName="Select a Subject Unit/Topic"
                        />
                      }
                      <CustomTextArea
                        form={form}
                        name="subTopic"
                        placeholder="Select a Subject Sub-Unit/Sub-Topic"
                        // isDisabled={false}
                        fieldName="Sub-Unit/Sub-Topic"
                      />
                    </Container>
                    <Row gaps="md">
                      <CustomSelectField
                        form={form}
                        name="bloomLevel"
                        isRequired
                        placeholder="Select a Bloom Level"
                        fieldName="Subject Level of Difficulty for the Learning / Lesson Objectives (using Blooms Taxonomy)"
                        list={bloomTaxonomyLevel}
                      />
                      <CustomRadioButton
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
                        name="timeAvailable"
                        fieldName="Time Available"
                        placeholder="Select a Time Available"
                        isRequired
                        list={timeOptions}
                      />
                      {/* <CustomCheckBox
                        form={form}
                        isRequired
                        className="flex flex-col mt-2"
                        name="teachingAids"
                        fieldName="Availability of Teaching Aids / Learning Resources / Instructional Materials"
                        list={teachingAids} /> */}
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
                  <Heading>Assessment-Specific Parameters</Heading>
                  <CustomRadioButton
                    form={form}
                    name="cbtTest"
                    defaultValue="No"
                    fieldName="Is it a CBT test?"
                    list={["No", "Yes"]}
                  />

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
                  <CustomSelectField
                    name="noQuestions"
                    form={form}
                    isRequired
                    fieldName="Total Number of Questions/Activities"
                    placeholder="Select a number of questions"
                    list={numberofQuestionLists}
                  />
                  <CustomCheckBox
                    className="grid grid-cols-1"
                    form={form}
                    isRequired
                    fieldName="Type of Questions"
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
                </Container>

                <Container>
                  {form.watch("questionTypes")?.length > 0 &&
                    <><Heading>Submission Format</Heading><CustomCheckBox
                      form={form}
                      column={2}
                      name="submissionFormat"
                      fieldName="Submission Format"
                      list={form.watch("questionTypes") ? submisisonList.slice(0, form.watch("questionTypes")?.length) : []} /></>
                  }
                </Container>

                <SubmitButton variant="primary"
                  loading={loading}
                  text="Subject Assessment Plan"
                  statusMessage={statusMessage}
                />
              </form>
            </FormProvider>
          </ScrollArea>
        </PlanCard>
        <PlanCard
          ref={chatbotRef}
          title="Ai Assistant"
          className={`transition-opacity duration-700 ease-in-out
                    max-h-screen
                     ${showAssessmentPlan ? "opacity-100" : "opacity-0"
            }`}>
          <Chatbot chats={data} />
        </PlanCard>
      </ContainerPlan>
    </>
  );
};

export default Assessments;