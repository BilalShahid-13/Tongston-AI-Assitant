import z from "zod"

export const faqSchema = z.object({
  id: z.string().optional(),
  heading: z.string().min(1, "Heading is required").max(200, "Heading must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(1, "Category is required"),
})

export const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  uploadDate: z.string(),
  category: z.string(),
})

export type FAQ = z.infer<typeof faqSchema>
export type UploadedFile = z.infer<typeof fileSchema>