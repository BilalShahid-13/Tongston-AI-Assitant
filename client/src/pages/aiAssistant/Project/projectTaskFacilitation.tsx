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
import { allCities, allCountryNames, classSizes, cognitiveProcessingTime, communicationMethod, iepPlan, medicalEmergencyProtocol, mobility, securityLevel, senDifferentiation, sensoryConsideration, socialInteraction, supportProvided, teachingAids, termOptions, timeOptions, yearClasses } from "@/constants/lessonPlanConstant";
import { useOnError } from "@/hooks/useOnError";
import { projectTaskFacilitationFormSchema, type IProjectTaskFacilitationFormSchema } from "@/schema/projectTaskFacilitation.schema";
import { useProjectTaskFacilitationStore } from "@/store/projectTaskFacilitationStore";
import { onSubmitFn } from "@/utils/onSubmit";
import { resetPlanValues } from "@/utils/resetPlanValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";



export default function ProjectTaskFacilitation() {
  const form: UseFormReturn<IProjectTaskFacilitationFormSchema> = useForm<IProjectTaskFacilitationFormSchema>({
    resolver: zodResolver(projectTaskFacilitationFormSchema),
    defaultValues: {
      sen: [],
      teachingAids: [],
      location: '',
      state: '',
      technologyAccess: "No",
    }
  });
  const { handleCities, cities, handleYearClass, handleTerm } = useProjectTaskFacilitationStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<string | null>("");
  const navigate = useNavigate();

  const onSubmit = async (data: IProjectTaskFacilitationFormSchema) => {
    setData("");
    const res = await onSubmitFn({
      payload: data,
      api: "project/Facilitation",
      setStatusMessage,
      navigate,
      setShowPlan: setShowChatbot,
      setData,
      setLoading
    })
    if (res?.error) {
      console.error("🔥 API Error:", `${res.error}${res.status}`);
      toast.error(`${res.error}-"${res.status}"`);
      return;
    }
    form.reset(resetPlanValues(projectTaskFacilitationFormSchema))
  };

  return (
    <>
      <ScrollAnimate scrollRef={scrollRef} />
      <ContainerPlan
        showPanel={showChatbot}
      >

               <PlanCard title="Project (Tasks) Lesson Facilitation Plan"
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
                  </Row>
                </Container>
                <Container>
                  <Heading>Lesson Planning Specifics</Heading>
                  <Container>
                    <Grid>
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
                      <CustomInputField
                        form={form}
                        name="task"
                        isDisabled={false}
                        isRequired
                        placeholder="Enter a Task"
                        fieldName="Task"
                      />
                      <CustomTextArea
                        form={form}
                        name="subTask"
                        placeholder="Enter a Sub-Task"
                        fieldName="Subject Sub-Unit/Sub-Topic"
                      />
                    </Container>
                    <Row gaps="md">
                      <CustomRadioButton
                        form={form}
                        name="technologyAccess"
                        isRequired
                        defaultValue="No"
                        list={["Yes", "No"]}
                        fieldName="Availability / Access of Technology"
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
                <CustomRadioButton
                  form={form}
                  name="weeklyNotes"
                  fieldName="Weekly Project (Tasks) Lesson / Lecture Notes"
                  list={["Yes", "No"]}
                  defaultValue="No"
                />
                <SubmitButton variant="primary"
                  loading={loading}
                  text="Project Task Facilitation"
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
                                     ${showChatbot ? "opacity-100" : "opacity-0"
            }`}>
          <Chatbot chats={data} />
        </PlanCard>
      </ContainerPlan>

    </>
  )
}
