import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"
import { Error, Loader } from "../Loader"
import { AdminForm } from "./AdminForm"
import { UploadedDocumentsGrid } from "./uploadedDoc"
import { backendApi } from "@/lib/constant"
import { Crown, Database, FileText, Sparkles, TrendingUp, Upload } from "lucide-react"

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
    <main className="w-full min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#ffb900] via-[#fe9a00] to-[#ff8c00] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Admin Dashboard</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Manage your knowledge base with elegance and power
            </p>
            <div className="flex justify-center items-center gap-2 text-white/80">
              <Sparkles className="w-5 h-5" />
              <span className="text-lg">Professional Document Management</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 fill-amber-50 dark:fill-gray-900"
          >
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </div>

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
                <div className="p-3 bg-gradient-to-br from-[#ffb900] to-[#fe9a00] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-[#ffb900]" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Documents</p>
              <p className="text-4xl font-bold text-[#ffb900] mb-2">{data?.totalCount ?? 0}</p>
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
        <UploadedDocumentsGrid files={data?.files || []} />
      </div>
    </main>
  )
}
