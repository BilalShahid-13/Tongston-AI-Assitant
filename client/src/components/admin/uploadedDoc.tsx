import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
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
      return <AiOutlineFileImage className="text-[#3B82F6] text-4xl mb-2" /> // Blue
    case "pdf":
      return <AiOutlineFilePdf className="text-[#EF4444] text-4xl mb-2" /> // Red
    case "doc":
    case "docx":
      return <AiOutlineFileWord className="text-[#2563EB] text-4xl mb-2" /> // Blue
    case "txt":
      return <AiOutlineFileText className="text-[#6B7280] text-4xl mb-2" /> // Gray
    default:
      return <AiOutlineFile className="text-[#6B7280] text-4xl mb-2" /> // Default gray
  }
}

export function UploadedDocumentsGrid({ files }: { files: Document[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return files
    return files.filter((doc) =>
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [files, searchTerm])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <Card className="bg-white dark:bg-[#2C2C2C]">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-[#1F2937] dark:text-[#F9FAFB]">
            Uploaded Documents
          </CardTitle>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-9 pr-4 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#4B5563] bg-[#F9FAFB] dark:bg-[#3A3A3A] text-[#374151] dark:text-[#D1D5DB] focus:ring-[#ffb900] focus:border-[#ffb900] w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <p className="text-center text-[#6B7280] dark:text-[#9CA3AF] py-8">
              No documents found matching your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc._id}
                  className="flex flex-col items-center p-4 bg-[#F9FAFB] dark:bg-[#3A3A3A] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg shadow-sm"
                >
                  {/* File icon */}
                  {getFileIcon(doc.originalName)}

                  <p className="text-sm font-medium text-center truncate w-full px-2 text-[#374151] dark:text-[#D1D5DB]">
                    {doc.originalName}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-[#6B7280] hover:bg-[#ffb900] hover:text-white dark:text-[#9CA3AF] dark:hover:bg-[#ffb900] dark:hover:text-white border-[#D1D5DB] dark:border-[#4B5563] bg-transparent"
                    asChild
                  >
                    <a href={doc.fileUrl} download={doc.originalName} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
