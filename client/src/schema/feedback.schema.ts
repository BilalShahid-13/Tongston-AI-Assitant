import z from "zod";
export const feedbackSchema = z
  .object({
    // Step 1 fields
    subject: z.string().min(1, "Please select a subject."),
    yearClassLevel: z.string().min(1, "Please select a year/class level."),
    role: z.string().min(1, "Please select your role."),
    country: z.string().min(1, "Please select your country."),
    followUp: z.boolean(),
    email: z.string().email("Invalid email address.").optional().or(z.literal("")),

    // Step 2 field
    sectionReferringTo: z.string().min(1, "Please select a section."),
    otherSectionDetail: z.string().optional(),

    // Step 3 field
    feedbackCategory: z.enum(["positive", "issue", "suggestion"], {
      error: "Please select a feedback category.",
    }),
    positiveMessage: z.string().optional(),
    inspirationUrl: z.string().optional(),
    // Issue Feedback fields
    issueDescription: z.string().optional(),
    issueScreenshot: z.any().optional(), // FileList type
    problemOccurredAt: z.string().optional(),
    otherProblemOccurredAtDetail: z.string().optional(),
    issueCheckboxes: z.array(z.string()).optional(),
    issueDetails: z.string().optional(),

    // Suggestion Feedback fields
    suggestionType: z.string().optional(),
    otherSuggestionTypeDetail: z.string().optional(),
    suggestionMessage: z.string().optional(),
    suggestionAppearance: z.string().optional(),
    suggestionScreenshot: z.any().optional(), // FileList type
  })
  .superRefine((data, ctx) => {
    // Conditional validation for email
    if (data.followUp && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required if you want us to follow up.",
        path: ["email"],
      })
    }

    // Conditional validation for issue feedback
    if (data.feedbackCategory === "issue") {
      if (!data.issueDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please describe the issue.",
          path: ["issueDescription"],
        })
      }
      if (!data.problemOccurredAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please specify where the problem occurred.",
          path: ["problemOccurredAt"],
        })
      }
      if (
        data.issueCheckboxes?.includes("Other (please describe)") &&
        !data.issueDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please tell us more about the selected issues.",
          path: ["issueDetails"],
        })
      }
    }

    // Conditional validation for suggestion feedback
    if (data.feedbackCategory === "suggestion") {
      if (!data.suggestionType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a type of suggestion.",
          path: ["suggestionType"],
        })
      }
      if (!data.suggestionMessage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please describe your suggestion.",
          path: ["suggestionMessage"],
        })
      }
    }
  })

export type IFeedbackSchema = z.infer<typeof feedbackSchema>