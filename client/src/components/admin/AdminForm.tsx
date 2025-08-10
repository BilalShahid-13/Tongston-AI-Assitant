import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { backendApi } from "@/lib/constant"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { FileUploader } from "../fileUploader"

const formSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "Please upload at least one file."),
});

type AdminFormProps = {
  onUploadSuccess?: () => void
}

type AdminFormValues = z.infer<typeof formSchema>
export function AdminForm({ onUploadSuccess }: AdminFormProps) {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  })
  // inside AdminForm
  async function onSubmit(values: AdminFormValues) {
    try {
      const formData = new FormData();

      // append category if you need it in backend
      formData.append("folder", "knowledgeBase");

      // append each file
      values.files.forEach((file) => {
        formData.append("file", file); // backend expects "file" from multer.single("file")
      });

      const res = await axios.post(
        `${backendApi}/api/insertKnowledgeBase`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }

      console.log("Server response:", res.data);
      toast.success("Knowledge base updated!");
      form.reset({
        files: [],
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Upload failed");
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4 md:p-6"
    >
      <Card className="bg-white dark:bg-[#2C2C2C]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1F2937] dark:text-[#F9FAFB]">
            Admin Panel: Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FileUploader
                      form={form}
                      name={field.name}
                      label="Upload Knowledge Files"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#ffb900] hover:bg-[#fe9a00] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Knowledge Base"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
