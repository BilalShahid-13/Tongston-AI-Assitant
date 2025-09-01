import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Database, FileText, Sparkles, TrendingUp, Upload } from "lucide-react"
import { AdminForm } from "./AdminForm"
import { UploadedDocumentsGrid } from "./uploadedDoc"
import axios from "axios"
import { backendApi } from "@/lib/constant"
import { useQuery } from "@tanstack/react-query"
import { Error, Loader } from "../Loader"

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
export default function KnowledgeBaseContent() {

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
    <>
      <div className="px-6 py-12 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffb900]/20 to-[#fe9a00]/20 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[var(--k12-primary)] to-[var(--k12-accent)] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-[var(--k12-primary)]" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Documents</p>
              <p className="text-4xl font-bold text-[var(--k12-tertiary)] mb-2">{data?.totalCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Files in knowledge base</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">System Status</p>
              <p className="text-2xl font-bold text-green-600 mb-2">Online</p>
              <p className="text-xs text-muted-foreground">Ready for uploads</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Supported Formats</p>
              <p className="text-lg font-bold text-blue-600 mb-2">PDF, DOC, TXT</p>
              <p className="text-xs text-muted-foreground">Multiple file types</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Section */}
        <AdminForm onUploadSuccess={refetch} />

        {/* Documents Grid */}
        <UploadedDocumentsGrid files={data?.files || []}/>
      </div>
    </>
  )
}
