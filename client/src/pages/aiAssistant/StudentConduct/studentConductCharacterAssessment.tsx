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
import { allCities, allCountryNames, assesmentWeightLists, bloomTaxonomyLevel, classSizes, cognitiveProcessingTime, communicationMethod, iepPlan, medicalEmergencyProtocol, mobility, nationalTestList, securityLevel, senDifferentiation, sensoryConsideration, socialInteraction, subjectLists, supportProvided, teachingAids, termOptions, timeOptions, typesofQuestions, weekList, yearClasses } from "@/constants/lessonPlanConstant";
import { KPIList } from "@/constants/studentConductCharacterPlanConstant";
import { useOnError } from "@/hooks/useOnError";
import { studentConductCharacterAssessmentsFormSchema, type IStudentConductCharacterAssessmentsForm } from "@/schema/studentConductCharacterAssessments.schema";
import { useLessonStore } from "@/store/lessonStore";
import { useProjectTaskFacilitationStore } from "@/store/projectTaskFacilitationStore";
import { onSubmitFn } from "@/utils/onSubmit";
import { resetPlanValues } from "@/utils/resetPlanValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function StudentConductCharacterAssessment() {
  const form: UseFormReturn<IStudentConductCharacterAssessmentsForm> = useForm<IStudentConductCharacterAssessmentsForm>({
    resolver: zodResolver(studentConductCharacterAssessmentsFormSchema),
    defaultValues: {
      sen: [],
      teachingAids: [],
      location: '',
      state: '',
      technologyAccess: "No",
    }
  });
  const { handleCities, cities, handleTerm, resetContinousAssessment, handleSubjectLearning,
    handleSubjectDicipline, handleYearClass, setOtherTeachingAids } = useProjectTaskFacilitationStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<string | null>("");
  const navigate = useNavigate();
  const {currentLesson,setCurrentLesson} = useLessonStore();

  const onSubmit = async (data: IStudentConductCharacterAssessmentsForm) => {
    console.log("Form Data:", data);
    setData("");
    const res = await onSubmitFn({
      payload: data,
      api: "student/ConductCharacterAssessment",
      setStatusMessage,
      setShowPlan: setCurrentLesson,
      setData,
      navigate,
      setLoading
    })
    if (res?.error) {
      console.error("🔥 API Error:", `${res.error}${res.status}`);
      toast.error(`${res.error}-"${res.status}"`);
      return;
    }
    form.reset(resetPlanValues(studentConductCharacterAssessmentsFormSchema))
  };

  useEffect(() => {
    resetContinousAssessment(form);
  }, [form.watch("typeofAssessments")])

  useEffect(() => {
    setOtherTeachingAids(form);
  }, [form.watch("teachingAids")])

  return (
    <>
      <ScrollAnimate scrollRef={scrollRef} />
      <ContainerPlan
        showPanel={currentLesson}
      >

        <PlanCard title="Student Conduct & Character Assessments"
          ref={scrollRef}
          // isOpen={true}
          className="relative h-[90vh] overflow-y-scroll">
          <ScrollArea>
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
                    <CustomCheckBox<IStudentConductCharacterAssessmentsForm>
                      form={form}
                      column={3}
                      fieldName="Continuous Assessment Week"
                      isRequired
                      name={"continuousAssessmentWeek"}
                      list={continousAssessmentWeekList}
                    />}
                  {form.watch("typeofAssessments") === "Mid Term Assessment" &&
                    <CustomCheckBox<IStudentConductCharacterAssessmentsForm>
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
                    <CustomCheckBox<IStudentConductCharacterAssessmentsForm>
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
                    <CustomSelectField
                      form={form}
                      name="KPI"
                      isRequired
                      className="w-full"
                      placeholder="Select a KPI"
                      fieldName="Student Conduct & Character Criterion/Indicator/KPI"
                      list={KPIList} />
                  </Row>
                </Container>
                <Container>
                  <Heading>Lesson Planning Specifics</Heading>
                  <Row gaps="lg">
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
                        onChange={() => {
                          handleSubjectDicipline(form);
                          handleSubjectLearning(form)
                        }}
                        placeholder="Select a Subject"
                        fieldName="Subject"
                      />
                      <Row gaps="md">
                        <CustomTextArea
                          form={form}
                          name="aim"
                          placeholder="Select aim or goal or rationale"
                          fieldName="Aim/Goal/Rationale"
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
                          fieldName="Student Conduct & Character KPI Learning / Lesson Objectives"
                          form={form}
                          placeholder="Enter Student Conduct & Character KPI Learning / Lesson Objectives"
                          isDisabled={false}
                          isRequired
                          name="studentConductLessonObjectives"
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
                          name="subjectLearning"
                          isRequired
                          placeholder="Select a Subject"
                          fieldName="Subject Learning / Lesson Objectives"
                        // onChange={() => handleSubjectLearning(form)}
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
                  </Row>
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
                  text="Student Conduct Assessment Plan"
                  statusMessage={statusMessage}
                />
              </form>
            </FormProvider>
          </ScrollArea>
        </PlanCard>
        <PlanCard
          ref={chatbotRef}
          // isOpen={currentLesson}
          title="Ai Assistant"
          className={`transition-opacity duration-700 ease-in-out
                                    max-h-screen
                                     ${currentLesson ? "opacity-100" : "opacity-0"
            }`}>
          <Chatbot chats={data} />
        </PlanCard>
      </ContainerPlan>
    </>
  )
}
