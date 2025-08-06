import Chatbot from "@/components/Chatbot";
import CustomInputField from "@/components/CustomFields/CustomInputField";
import CustomSelectField from "@/components/CustomFields/CustomSelectField";
import { FileUploader } from "@/components/fileUploader";
import { Container, ContainerPlan, Grid, Row, SubmitButton } from "@/components/GenralComponents";
import PlanCard from "@/components/planCard";
import ScrollAnimate from "@/components/scrollAnimate";
import { termOptions, yearClassMappings } from "@/constants/lessonPlanConstant";
import { useOnError } from "@/hooks/useOnError";
import { reportGeneratorSchema, type ReportGeneratorSchema } from "@/schema/reportGenerator.schema";
import { useProjectTaskFacilitationStore } from "@/store/projectTaskFacilitationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export default function ReportGenerator() {
  const form: UseFormReturn<ReportGeneratorSchema> = useForm<ReportGeneratorSchema>({
    resolver: zodResolver(reportGeneratorSchema)
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<string | null>("");

  useEffect(() => {
    setShowChatbot(false);
    setStatusMessage(null);
    setLoading(false);
  }, [])
  const { handleTerm } = useProjectTaskFacilitationStore();
  const onSubmit = async (data: ReportGeneratorSchema) => {
    setData("");
    const formData = new FormData();
    formData.append("lessonPlanFile", data.lessonPlanFile[0]); // It's an array
    formData.append("submittedOnTime", data.submittedOnTime || "");
    formData.append("submittedViaCorrectChannel", data.submittedViaCorrectChannel || "");
    formData.append("directedToCorrectAuthority", data.directedToCorrectAuthority || "");
    formData.append("classType", data.classType);
    formData.append("term", data.term);
    formData.append("termTheme", data.termTheme || "");
    formData.append("associatedPBLTask", data.associatedPBLTask || "");
    formData.append("teacherNameOrID", data.teacherNameOrID || "");
    toast.success("Not ready");
    // const res = await onSubmitFile({
    //   api: "getReport", // 👈 use the correct API slug
    //   payload: formData,
    //   setStatusMessage,
    //   setShowPlan: setShowChatbot,
    //   setData,
    //   setLoading
    // });
    // if (res?.error) {
    //   console.error("🔥 API Error:", `${res.error}${res.status}`);
    //   toast.error(`${res.error}-"${res.status}"`);
    //   return;
    // }
    // form.reset(resetPlanValues(reportGeneratorSchema))
  };

  return (
    <>
      <ScrollAnimate scrollRef={scrollRef} />
      <ContainerPlan
        showPanel={showChatbot}
      >
        <PlanCard title="Assessment Report" ref={scrollRef}>
          <div className="h-[500px] relative overflow-y-scroll">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, useOnError())}
                className="flex flex-col gap-8 mx-3">
                <Container>
                  <Row gaps="lg">
                    <FileUploader
                      label="Lesson Plan Input File"
                      multiple={false}
                      accept=".pdf,.doc,.docx,.txt"
                      form={form}
                      className="w-full"
                      name="lessonPlanFile"
                    />
                    <CustomSelectField
                      name="classType"
                      form={form}
                      isRequired
                      fieldName="Class Type"
                      className="w-full"
                      list={yearClassMappings.flatMap((yearClass) => yearClass.normalized)}
                      placeholder="Select a class type"
                    />
                    <Grid>
                      <CustomSelectField
                        form={form}
                        isRequired
                        name="term"
                        fieldName="Associated Term"
                        placeholder="Select a Term"
                        onChange={() => handleTerm(form)}
                        list={termOptions}
                      />
                      {form.watch("term") && <CustomInputField
                        form={form}
                        name="termTheme"
                        fieldName="Term Theme"
                      />}
                      <CustomInputField
                        name="associatedPBLTask"
                        form={form}
                        fieldName="Associated Project-Based Learning (PBL) Task"
                        placeholder="Enter the project-based learning task"
                      />
                      <CustomInputField
                        name="teacherNameOrID"
                        form={form}
                        // isRequired
                        isDisabled={false}
                        fieldName="Teacher's Name / ID"
                        placeholder="Enter the teacher's name or ID"
                      />
                    </Grid>
                  </Row>
                </Container>
                <SubmitButton variant="primary"
                  loading={loading}
                  text="Assessment Report"
                  statusMessage={statusMessage}
                />
              </form>
            </FormProvider>
          </div>
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
