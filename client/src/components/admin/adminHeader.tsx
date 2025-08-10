import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"
import { Error, Loader } from "../Loader"
import { AdminForm } from "./AdminForm"
import { UploadedDocumentsGrid } from "./uploadedDoc"
import { backendApi } from "@/lib/constant"

// Fetch both APIs together
async function fetchKnowledgeBaseData() {
  const [filesRes, countRes] = await Promise.all([
    axios.get(`${backendApi}/api/getKnowledgeBaseFiles`),
    axios.get(`${backendApi}/api/getKnowledgeBaseFileLength`),
  ])

  return {
    files: filesRes.data.data,
    totalCount: countRes.data.data,
  }
}

export default function AdminHeader() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["knowledgeBaseData"],
    queryFn: fetchKnowledgeBaseData,
  })

  if (isLoading) return <Loader />

  if (error instanceof Error)
    return (
      <Error />
    )

  return (
    <main className="w-full flex flex-col justify-center items-center">
      {/* Total Documents Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="min-w-3xl"
      >
        <Card className=" bg-white dark:bg-[#2C2C2C] h-full flex flex-col justify-between">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] mb-2">
                Total Uploaded Documents
              </p>
              <p className="text-5xl font-bold text-[#ffb900]">
                {data?.totalCount ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload New Documents Section */}
      <AdminForm onUploadSuccess={refetch} />

      {/* Uploaded Documents List */}
      <UploadedDocumentsGrid files={data?.files || []} />
    </main>
  )
}
