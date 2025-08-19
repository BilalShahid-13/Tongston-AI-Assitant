import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Search, FileText, FileX, Grid3X3, List } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

// Import icons (adjust if you use a different library)
import {
  AiOutlineFile,
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileText,
} from "react-icons/ai"

type Document = {
  _id: string
  originalName: string
  fileUrl: string
  // add other props if needed
}

// Returns appropriate icon based on file extension
export function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
      return <AiOutlineFileImage className="text-blue-500 text-4xl mb-3" />
    case "pdf":
      return <AiOutlineFilePdf className="text-red-500 text-4xl mb-3" />
    case "doc":
    case "docx":
      return <AiOutlineFileWord className="text-blue-600 text-4xl mb-3" />
    case "txt":
      return <AiOutlineFileText className="text-gray-500 text-4xl mb-3" />
    default:
      return <AiOutlineFile className="text-gray-500 text-4xl mb-3" />
  }
}

export function UploadedDocumentsGrid({ files }: { files: Document[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return files
    return files.filter((doc) => doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [files, searchTerm])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full max-w-7xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-white via-amber-50/20 to-orange-50/20 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border-0 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffb900] to-[#fe9a00]"></div>

        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#ffb900] to-[#fe9a00] rounded-xl shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#ffb900] to-[#fe9a00] bg-clip-text text-transparent">
                Document Library
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {filteredDocuments.length} of {files.length} documents
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-3 rounded-xl border-2 focus:border-[#ffb900] transition-colors w-full lg:w-[320px] bg-white/80 dark:bg-gray-700/80 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-[#ffb900] text-white" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${viewMode === "list" ? "bg-[#ffb900] text-white" : ""}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {filteredDocuments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ffb900]/20
               to-[#fe9a00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileX className="w-12 h-12 text-[#ffb900]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {files.length === 0 ? "No documents uploaded yet" : "No documents found"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {files.length === 0
                  ? "Upload your first document to get started with building your knowledge base"
                  : "Try adjusting your search terms or upload more documents"}
              </p>
            </motion.div>
          ) : (
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                }`}
            >
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card
                    className={`h-full bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-gray-700 border-2 border-transparent hover:border-[#ffb900]/30 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-[#ffb900]/20 ${viewMode === "list" ? "flex flex-row items-center p-4" : "flex flex-col items-center p-6"
                      }`}
                  >
                    <div
                      className={`transform group-hover:scale-110 transition-transform duration-200 ${viewMode === "list" ? "mr-4" : "mb-4"
                        }`}
                    >
                      {getFileIcon(doc.originalName)}
                    </div>

                    <div className={`max-w-sm flex-1 text-center ${viewMode === "list" ? "text-left mr-4" : "mb-4"}`}>
                      <p
                        className={`max-w-sm font-medium capitalize text-foreground mb-2 ${viewMode === "list" ? "text-base" : "text-sm w-full px-2 break-words"
                          }`}
                      >
                        {doc.originalName}
                      </p>
                      <div className="max-w-sm flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <span className="max-w-sm px-2 py-1 bg-[#ffb900]/10 text-[#ffb900] rounded-full font-medium">
                          {doc.originalName.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={viewMode === "list" ? "flex-shrink-0" : "w-full"}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-[#ffb900] to-[#fe9a00] hover:from-[#e6a600] hover:to-[#e58900] text-white border-0 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        asChild
                      >
                        <a href={doc.fileUrl} download={doc.originalName} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
