import z from "zod";

export const feedbackSchema = z.object({
  category: z.string().nonempty("Category is required"),
  file: z
    .array(z.instanceof(File))
    .max(1, { message: "Only one image file is allowed." })
    .refine(
      (files) =>
        files.length === 0 ||
        ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type),
      {
        message: "Only JPG, PNG, or WEBP image files are accepted.",
      }
    ),
  message: z
    .string()
    .nonempty({ message: "Message is required" })
    .min(10, { message: "Message must be at least 10 characters long" }),
  rating: z.number().min(1, { message: "Rating is required" }).max(5, { message: "Rating must be between 1 and 5" }),
  otherCategoryDetail: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.category === "other" && !data.otherCategoryDetail?.trim()) {
    ctx.addIssue({
      path: ["category"],
      code: "custom",
      message: "Please specify the category detail",
    })
  }
})

export type IFeedbackSchema = z.infer<typeof feedbackSchema>;