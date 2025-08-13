import { z } from "zod";

export const reportGeneratorSchema = z.object({
  // 1. Lesson Plan Document
  lessonPlanFile: z
    .any()
    .refine(
      (files) => {
        return (
          Array.isArray(files) &&
          files.length > 0 &&
          files[0] instanceof File &&
          ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(files[0].type)
        );
      },
      {
        message: "Only PDF, DOCX, or TXT files are accepted.",
      }
    ),
  // 2. Contextual Information
  submittedOnTime: z.enum(["Yes", "No"]).optional(),
  submittedViaCorrectChannel: z.enum(["Yes", "No"]).optional(),
  directedToCorrectAuthority: z.enum(["Yes", "No"]).optional(),

  classType: z
    .string()
    .min(1, "Class type is required (e.g., Primary 3, JSS2).").nonempty(),

  term: z.string({error:"Associated term is required."}),
  termTheme: z.string().optional(),

  associatedPBLTask: z.string().optional(), // optional free text or dropdown

  teacherNameOrID: z
    .string()
    .min(1, "Teacher's name or ID is required.").optional(),

  // 3. Action Button is just a trigger, so not part of schema
});

export type ReportGeneratorSchema = z.infer<typeof reportGeneratorSchema>;
