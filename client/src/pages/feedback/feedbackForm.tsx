import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import React, { useState, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Import your custom components
import CustomInputField from "@/components/CustomFields/CustomInputField"
import CustomSelectField from "@/components/CustomFields/CustomSelectField"
import CustomTextArea from "@/components/CustomFields/CustomTextArea"
import { FileUploader } from "@/components/fileUploader"

// Import your general layout components
import { Container, Grid, Row } from "@/components/GenralComponents"
import PlanCard from "@/components/planCard"

import CustomCheckBox from "@/components/CustomFields/CustomCheckBox"
import { allCountryNames, subjectLists, yearClasses } from "@/constants/lessonPlanConstant"
import { backendApi } from "@/lib/constant"
import { feedbackSchema, type IFeedbackSchema } from "@/schema/feedback.schema"; // Removed 'type' keyword
import { toast } from "sonner"
import BreadCrumb from "@/components/breadcrumb"
const useOnError = () => (errors: any) => {
  console.error("Form errors:", errors)
  toast.error("Please correct the errors in the form.")
}
const roles = [
  "Teacher",
  "Educational Service Provider (e.g., Education Consultant, Ed Tech Provider)",
  "School Administrator / Vice Principal / Principal / Head Teacher",
  "Government Personnel",
  "Parent/Guardian",
  "Other",
]

const sectionOptions = [
  "Lesson plan marking & report generator",
  "Subject lesson plan & notes generator",
  "Subject continuous assessment / end of term assessment generator",
  "Student conduct & character KPIs lesson plan & notes generator",
  "Student conduct & character KPIs continuous assessment / end of term assessment generator",
  "Projects (tasks) generator",
  "Projects (tasks) weekly lesson facilitation plan & notes generator",
  "My Files",
  "Analytics",
  "Help & FAQs",
  "Settings",
  "Other (please specify)",
]

const problemOccurredAtOptions = [
  "Input fields",
  "Dropdown list",
  "File upload",
  "Download / export",
  "Save",
  "Output Preview / Output",
  "Navigation/UX/usability",
  "Other (please specify)",
]

const issueCheckboxesOptions = [
  "The output wasn’t accurate or precise enough",
  "The dropdown I needed was missing",
  "I couldn’t complete the generation process",
  "Something didn’t load or respond",
  "I wasn’t sure what to do next",
  "It gave an error or froze",
  "Other (please describe)",
]

const suggestionTypeOptions = [
  "New feature",
  "Better output formatting",
  "Add more subjects",
  "Add more lesson notes and resources",
  "Fix a recurring issue",
  "UI or layout improvement",
  "Add helpful files or templates",
  "Content enhancement",
  "Workflow improvement",
  "Layout/user interface",
  "Additional resource (e.g., templates, files)",
  "Integration with other tools",
  "Other",
]

const FormSection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6 p-6 border rounded-lg bg-white dark:bg-zinc-800 shadow-sm"
  >
    <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-100">{title}</h3>
    {description && <p className="text-sm text-gray-600 dark:text-neutral-200">{description}</p>}
    {children}
  </motion.div>
)

export default function FeedbackForm() {
  const methods = useForm<IFeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: "",
      yearClassLevel: "",
      role: "",
      country: "",
      followUp: false,
      email: "",
      sectionReferringTo: "",
      feedbackCategory: undefined,
      positiveMessage: "",
      issueDescription: "",
      issueScreenshot: undefined,
      problemOccurredAt: "",
      issueCheckboxes: [],
      issueDetails: "",
      suggestionType: "",
      suggestionMessage: "",
      suggestionAppearance: "",
      suggestionScreenshot: undefined,
    },
  })

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = methods

  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()

  const feedbackCategory = watch("feedbackCategory")
  const problemOccurredAt = watch("problemOccurredAt")
  const issueCheckboxes = watch("issueCheckboxes")
  const suggestionType = watch("suggestionType")

  // Determine if "Can you tell us more about this?" should be shown
  const showIssueDetails =
    issueCheckboxes &&
    issueCheckboxes.length > 0 &&
    issueCheckboxes.some(
      (val) =>
        val.includes("Other") ||
        val.includes("Something didn’t load") ||
        val.includes("I wasn’t sure") ||
        val.includes("It gave an error"),
    )

  const onSubmit = async (data: IFeedbackSchema) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        // Append all non-file fields
        for (const key in data) {
          const value = (data as any)[key];
          if (
            value !== undefined &&
            value !== null &&
            key !== "issueScreenshot" &&
            key !== "suggestionScreenshot"
          ) {
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            } else if (typeof value === "boolean") {
              formData.append(key, value ? "true" : "false");
            } else {
              formData.append(key, String(value));
            }
          }
        }

        // Append files
        if (data.issueScreenshot && data.issueScreenshot.length > 0) {
          data.issueScreenshot.forEach((file: any) => {
            formData.append("issueScreenshot", file);
          });
        }
        if (data.suggestionScreenshot && data.suggestionScreenshot.length > 0) {
          data.suggestionScreenshot.forEach((file: any) => {
            formData.append("suggestionScreenshot", file);
          });
        }

        // Send request via Axios
        const res = await axios.post(`${backendApi}/api/insertFeedback`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          toast.success(res.data.message);
          reset();
          setCurrentStep(1);
        } else {
          toast.error(res.data.error || "Failed to submit feedback.");
        }
      } catch (error: any) {
        console.error("Submit feedback error:", error);
        toast.error("Failed to submit feedback. Please try again.");
      }
    })
  }

  const handleNextStep = async () => {
    let isValid = false
    if (currentStep === 1) {
      isValid = await trigger(["subject", "yearClassLevel", "role", "country", "email"])
    } else if (currentStep === 2) {
      isValid = await trigger("sectionReferringTo")
    } else if (currentStep === 3) {
      isValid = await trigger("feedbackCategory")
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  return (
    <>
      <BreadCrumb section="Feedback" className="text-white" />
      <PlanCard title="Feedback Form"
        des="Help us improve your experience on the platform."
        className="my-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, useOnError())}
            className="flex flex-col gap-8 mx-3">
            <Container >
              <Row gaps="lg" >
                {/* Step 1: About You */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <FormSection key="step1"
                      title="Step 1: Tell us a bit about you">
                      <Grid>
                        <CustomSelectField<IFeedbackSchema>
                          form={methods}
                          className="w-full"
                          fieldName="Subject you teach"
                          placeholder="Select a subject"
                          name="subject"
                          list={subjectLists.map((item) => item.subject)}
                          isRequired
                        />

                        <CustomSelectField<IFeedbackSchema>
                          form={methods}
                          className="w-full"
                          fieldName="Year/Class Level"
                          placeholder="Select level"
                          name="yearClassLevel"
                          list={yearClasses}
                          isRequired
                        />

                        <CustomSelectField<IFeedbackSchema>
                          form={methods}
                          className="w-[65%]"
                          fieldName="Role"
                          placeholder="Select your role"
                          name="role"
                          list={roles}
                          isRequired
                        />

                        <CustomSelectField<IFeedbackSchema>
                          form={methods}
                          className="w-full"
                          fieldName="Country / Location"
                          placeholder="Select your country"
                          name="country"
                          list={allCountryNames}
                          isRequired
                        />
                      </Grid>

                      {/* <div className="flex items-center space-x-2 mt-4">
                        <Checkbox
                          id="followUp"
                          checked={followUp}
                          onCheckedChange={(checked) => {
                            setValue("followUp", !!checked)
                            if (!checked) setValue("email", "") // Clear email if unchecked
                            trigger("email") // Re-validate email field
                          }}
                        />
                        <Label htmlFor="followUp">Would you like us to follow up with you?</Label>
                      </div> */}
                      <AnimatePresence>
                        {methods.watch("followUp") && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <CustomInputField<IFeedbackSchema>
                              form={methods}
                              fieldName="Email"
                              placeholder="your@email.com"
                              name="email"
                              isDisabled={false}
                              isRequired
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormSection>
                  )}

                  {/* Step 2: Which section are you referring to? */}
                  {currentStep === 2 && (
                    <FormSection key="step2" title="Step 2: Which section are you referring to?">
                      <CustomSelectField<IFeedbackSchema>
                        form={methods}
                        className="w-full"
                        fieldName="Section"
                        placeholder="Select a section"
                        name="sectionReferringTo"
                        list={sectionOptions}
                        isRequired
                      />
                      <AnimatePresence>
                        {watch("sectionReferringTo") === "Other (please specify)" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <CustomInputField<IFeedbackSchema>
                              form={methods}
                              isDisabled={false}
                              fieldName="Please specify"
                              placeholder="e.g., Dashboard"
                              name="otherSectionDetail"
                              isRequired
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormSection>
                  )}

                  {/* Step 3: Feedback Category */}
                  {currentStep === 3 && (
                    <FormSection key="step3"
                      title="Step 3: What kind of feedback would you like to share?">
                      <RadioGroup
                        onValueChange={(value: "positive" | "issue" | "suggestion") => {
                          setValue("feedbackCategory", value, { shouldValidate: true })
                        }}
                        value={feedbackCategory}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <Label
                          htmlFor="positive"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-[#ffb900]"
                        >
                          <RadioGroupItem value="positive" id="positive" className="sr-only" />
                          <span className="text-4xl mb-2">😊</span>
                          <span>I want to share something that’s working well</span>
                        </Label>
                        <Label
                          htmlFor="issue"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-[#ffb900]"
                        >
                          <RadioGroupItem value="issue" id="issue" className="sr-only" />
                          <span className="text-4xl mb-2">⚠️</span>
                          <span>I’m facing an issue or difficulty using the platform</span>
                        </Label>
                        <Label
                          htmlFor="suggestion"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-[#ffb900]"
                        >
                          <RadioGroupItem value="suggestion" id="suggestion" className="sr-only" />
                          <span className="text-4xl mb-2">💡</span>
                          <span>I have a suggestion or upgrade idea</span>
                        </Label>
                      </RadioGroup>
                      {errors.feedbackCategory && (
                        <p className="text-red-500 text-sm mt-1">{errors.feedbackCategory.message}</p>
                      )}
                    </FormSection>
                  )}

                  {/* Conditional Feedback Sections */}
                  {currentStep === 4 && (
                    <>
                      {/* {feedbackCategory === "positive" && (
                            <FormSection key="positive-feedback" title="Positive Feedback">
                              <div className="flex items-center space-x-2">
                                <Label htmlFor="recommendColleague">Would you recommend this to a colleague?</Label>
                                <Switch
                                  id="recommendColleague"
                                  checked={recommendColleague}
                                  onCheckedChange={(checked) => {
                                    setValue("recommendColleague", checked)
                                    if (!checked) setValue("colleagueEmails", [""]) // Clear emails if unchecked
                                  }}
                                />
                              </div>
                              <AnimatePresence>
                                {recommendColleague && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden space-y-2"
                                  >
                                    <Label className="block">Colleague Email(s)</Label>
                                    {colleagueEmailFields.map((field, index) => (
                                      <div key={field.id} className="flex items-center space-x-2">
                                        <CustomInputField<IFeedbackSchema>
                                          form={methods}
                                          isDisabled={false}
                                          fieldName="" // Label is handled by parent Label
                                          placeholder="colleague@example.com"
                                          name={`colleagueEmails.${index}`}
                                          isRequired
                                        />
                                        {colleagueEmailFields.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeColleagueEmail(index)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={() => appendColleagueEmail("")}>
                                      <Plus className="h-4 w-4 mr-2" /> Add another email
                                    </Button>
                                    {errors.colleagueEmails && (
                                      <p className="text-red-500 text-sm mt-1">{errors.colleagueEmails.message}</p>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <CustomTextArea<IFeedbackSchema>
                                form={methods}
                                fieldName="Tell us what worked well for you (Optional)"
                                placeholder="Your feedback here..."
                                name="positiveMessage"
                              />
                            </FormSection>
                          )} */}

                      {feedbackCategory === "issue" && (
                        <FormSection key="issue-feedback" title="Issue or Difficulty">
                          <CustomTextArea<IFeedbackSchema>
                            form={methods}
                            fieldName="Briefly describe the issue or difficulty"
                            placeholder="Describe the problem..."
                            name="issueDescription"
                            isRequired
                          />

                          <FileUploader
                            form={methods}
                            name="issueScreenshot"
                            label="Upload a screenshot or image (Optional)"
                            multiple={false}
                            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                          />

                          <CustomSelectField<IFeedbackSchema>
                            form={methods}
                            className="w-full"
                            fieldName="Where did the problem occur?"
                            placeholder="Select where the problem occurred"
                            name="problemOccurredAt"
                            list={problemOccurredAtOptions}
                            isRequired
                          />
                          <AnimatePresence>
                            {problemOccurredAt === "Other (please specify)" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <CustomInputField<IFeedbackSchema>
                                  form={methods}
                                  isDisabled={false}
                                  fieldName="Please specify"
                                  placeholder="e.g., Login page"
                                  name="otherProblemOccurredAtDetail"
                                  isRequired
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="space-y-2">
                            <CustomCheckBox<IFeedbackSchema>
                              name="issueCheckboxes"
                              form={methods}
                              fieldName="Optional checkboxes"
                              list={issueCheckboxesOptions}
                            />
                          </div>

                          <AnimatePresence>
                            {showIssueDetails && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <CustomTextArea<IFeedbackSchema>
                                  form={methods}
                                  fieldName="Can you tell us more about this?"
                                  placeholder="Provide more details..."
                                  name="issueDetails"
                                  isRequired
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormSection>
                      )}

                      {feedbackCategory === "suggestion" && (
                        <FormSection key="suggestion-feedback" title="Suggestion or Upgrade">
                          <CustomSelectField<IFeedbackSchema>
                            form={methods}
                            className="w-full"
                            fieldName="Type of suggestion"
                            placeholder="Select type of suggestion"
                            name="suggestionType"
                            list={suggestionTypeOptions}
                            isRequired
                          />
                          <AnimatePresence>
                            {suggestionType === "Other" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <CustomInputField<IFeedbackSchema>
                                  form={methods}
                                  fieldName="Please specify"
                                  placeholder="e.g., New integration"
                                  name="otherSuggestionTypeDetail"
                                  isRequired
                                  isDisabled={false}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <CustomTextArea<IFeedbackSchema>
                            form={methods}
                            fieldName="What would you like to see improved or added in the future?"
                            placeholder="Describe your idea..."
                            name="suggestionMessage"
                            isRequired
                          />

                          <CustomTextArea<IFeedbackSchema>
                            form={methods}
                            fieldName="How would you like this improvement to work or appear on the platform? (Optional)"
                            placeholder="e.g., What should it look like? When should it show up? What should it include?"
                            name="suggestionAppearance"
                          />

                          <FileUploader
                            form={methods}
                            name="suggestionScreenshot"
                            label="Would you like to upload a screenshot to help us understand better? (Optional)"
                            multiple={false}
                            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                          />
                        </FormSection>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </Row>
              {/* Navigation Buttons */}
              <Grid>
                {currentStep > 1 && (
                  <Button className="w-full" type="button" variant="outline" onClick={handlePrevStep}>
                    Previous
                  </Button>
                )}
                {currentStep < 4 && (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full ml-auto bg-[#ffb900]
                      hover:bg-[#ffb900]/90 text-white"
                  >
                    Next
                  </Button>
                )}
                {currentStep == 4 && (
                  <Button type="submit" className="w-full ml-auto bg-[#ffb900]
                      hover:bg-[#ffb900]/90 text-white">
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Submitting
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                )}
              </Grid>
            </Container>
          </form>
        </FormProvider>
        {/* </ScrollArea> */}
      </PlanCard>
    </>
  )
}
