import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { backendApi } from "@/lib/constant"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { motion } from "framer-motion"
import { CloudUpload, Loader2, Upload, Zap, Link, FileText } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"
import { FileUploader } from "../fileUploader"
import CustomInputField from "../CustomFields/CustomInputField"

const formSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "Please upload at least one file."),
})

const urlFormSchema = z.object({
  url: z.string().url("Please enter a valid Google Docs URL").min(1, "URL is required"),
})

type AdminFormProps = {
  onUploadSuccess?: () => void
}

type AdminFormValues = z.infer<typeof formSchema>
type UrlFormValues = z.infer<typeof urlFormSchema>

export function AdminForm({ onUploadSuccess }: AdminFormProps) {
  const [isUrlUploading, setIsUrlUploading] = useState(false)

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  })

  const urlForm = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  })

  async function onUrlSubmit(values: UrlFormValues) {
    try {
      setIsUrlUploading(true)

      const res = await axios.post(
        `${backendApi}/api/insertFromGoogleDocs`,
        { url: values.url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (res.status === 200) {
        if (onUploadSuccess) {
          onUploadSuccess()
        }
        toast.success("Google Docs content added to knowledge base!")
        urlForm.reset({ url: "" })
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.error || "URL upload failed")
    } finally {
      setIsUrlUploading(false)
    }
  }

  // Existing file upload functionality
  async function onSubmit(values: AdminFormValues) {
    try {
      const formData = new FormData()

      // append category if you need it in backend
      formData.append("folder", "knowledgeBase")

      // append each file
      values.files.forEach((file) => {
        formData.append("file", file) // backend expects "file" from multer.single("file")
      })

      const res = await axios.post(`${backendApi}/api/insertKnowledgeBase`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.status === 200) {
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      }

      console.log("Server response:", res.data)
      toast.success("Knowledge base updated!")
      form.reset({
        files: [],
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.error || "Upload failed")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border-0 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--k12-primary)] to-[var(--k12-secondary)]"></div>

        <CardHeader className="text-center pb-6 pt-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--k-12-primary)] to-[var(--k12-secondary)] rounded-2xl flex items-center justify-center mb-4 shadow-xl"
          >
            <Link className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--k12-tertiary)] to-from-[var(--k12-quaternary)] bg-clip-text text-transparent mb-2">
            Import from Google Docs
          </CardTitle>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Paste a Google Docs URL to automatically import content into your knowledge base.
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Form {...urlForm}>
            <form onSubmit={urlForm.handleSubmit(onUrlSubmit)} className="space-y-6">
              <CustomInputField
                form={urlForm}
                name="url"
                fieldName="Google Docs URL"
                placeholder="https://docs.google.com/document/d/..."
                isRequired={true}
                isDisabled={isUrlUploading}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[var(--k12-secondary)] to-[var(--k12-tertiary)]
                   hover:from-[var(--k12-accent)] hover:to-[var(--k12-tertiary)] text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                  disabled={isUrlUploading}
                >
                  {isUrlUploading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Importing from Google Docs...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-3 h-5 w-5" />
                      Import Document
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing file upload section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border-0 shadow-2xl">
        <div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--k12-primary)]
                to-[var(--k12-secondary)]"
        ></div>

        <CardHeader className="text-center pb-8 pt-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--k12-primary)]
                to-[var(--k12-secondary)] rounded-2xl flex items-center justify-center mb-6 shadow-xl"
          >
            <CloudUpload className="w-10 h-10 text-white" />
          </motion.div>
          <CardTitle
            className="text-3xl font-bold bg-gradient-to-r from-[var(--k12-primary)]
                to-[var(--k12-secondary)] bg-clip-text text-transparent mb-3"
          >
            Upload Documents
          </CardTitle>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Drag and drop your files or click to browse. Expand your knowledge base instantly.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-[#ffb900]" />
            <span>Supports PDF, DOC, DOCX, TXT files</span>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FileUploader
                      form={form}
                      name={field.name}
                      label="Select Files to Upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-[var(--k12-primary)]
                to-[var(--k12-secondary)] hover:from-red-400 hover:to-red-500 text-white font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl rounded-xl"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Processing Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-3 h-6 w-6" />
                      Upload to Knowledge Base
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
