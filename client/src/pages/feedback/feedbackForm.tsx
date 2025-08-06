import CustomInputField from "@/components/CustomFields/CustomInputField";
import CustomSelectField from "@/components/CustomFields/CustomSelectField";
import CustomTextArea from "@/components/CustomFields/CustomTextArea";
import { FileUploader } from "@/components/fileUploader";
import { Container, ContainerPlan, Row } from "@/components/GenralComponents";
import PlanCard from "@/components/planCard";
import ScrollAnimate from "@/components/scrollAnimate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useOnError } from "@/hooks/useOnError";
import { backendApi, type ApiType } from "@/lib/constant";
import { feedbackSchema, type IFeedbackSchema } from "@/schema/feedback.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

const myStyles = {
  itemShapes: Star,
  activeFillColor: '#ffb700',
  inactiveFillColor: '#fbf1a9'
}

export default function FeedbackForm() {
  const form: UseFormReturn<IFeedbackSchema> = useForm<IFeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      message: "",
    }
  });
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const scrollRef = useRef(null);
  const [rating, setRating] = useState(0)
  // const [isLoading,setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setShowChatbot(false);
  }, [])

  useEffect(() => {
    form.register("rating");
  }, [form]);


  const submitFeedback = async (data: IFeedbackSchema | FormData, api: ApiType) => {
    const { data: responseData } = await axios.post(`${backendApi}/api/${api}`, data);
    return responseData;
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);                     // local UI update
    form.setValue("rating", newRating);       // ✅ update RHF form value
    form.trigger("rating");
  };

  const onSubmit = async (data: IFeedbackSchema) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("category", data.category);
        formData.append("message", data.message);
        formData.append("rating", data.rating.toString());
        if (data.otherCategoryDetail) {
          formData.append("otherCategoryDetail", data.otherCategoryDetail);
        }

        if (data.file?.[0]) {
          formData.append("file", data.file[0]); // ✅ append first file
        }

        const res = await submitFeedback(formData, "insertFeedback");

        if (res.success) {
          toast.success(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };


  return (
    <>
      <ScrollAnimate scrollRef={scrollRef} />
      <ContainerPlan
        showPanel={showChatbot}
      >
        <PlanCard title="Feedback Form" className="mt-6">
          <div className="h-[500px] relative overflow-y-scroll" ref={scrollRef}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, useOnError())}
                className="flex flex-col gap-8 mx-3">
                <Container>
                  <Row gaps="lg">
                    <CustomSelectField<IFeedbackSchema>
                      form={form}
                      fieldName="Which section are you facing an issue with?"
                      placeholder="Select a category"
                      name="category"
                      list={[
                        "Subject Lesson Plan",
                        "Subject Assessment Plan",
                        "Student Conduct & Character Plan",
                        "Project Task",
                        "Help & FAQs",
                        "Chatbot",
                        "Other"
                      ]}
                    />
                    {form.watch("category") == "Other" ?
                      <CustomInputField
                        name="category"
                        form={form}
                        isRequired
                        isDisabled={false}
                        placeholder="Enter your category"
                        fieldName="Category"
                      />
                      : null}
                    <FileUploader
                      label="Upload a screenshot (optional)"
                      multiple={false}
                      accept=".png,.jpg,.jpeg"
                      form={form}
                      className="w-full"
                      name="file"
                    />
                    <CustomTextArea
                      name="message"
                      fieldName="Message"
                      isRequired
                      placeholder="Enter your message"
                      form={form}
                    />
                    {/* rating */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rating"
                        className="inline justify-start items-start leading-snug">Rate your experience</Label>
                      <Rating itemStyles={myStyles}
                        id="rating"
                        style={{ maxWidth: 200 }}
                        value={rating}
                        onChange={handleRatingChange} />
                      <span
                        className="input-error text-sm"
                      >{form?.formState?.errors.rating?.message as string}</span>
                    </div>
                  </Row>
                </Container>
                <Button type="submit" variant={"primary"}>
                  {isPending ? <>
                    <Loader2 className="animate-spin" />
                    Submitting
                  </>
                    : "Submit Feedback"}
                </Button>
              </form>
            </FormProvider>
          </div>
        </PlanCard >
      </ContainerPlan >
    </>
  )
}
