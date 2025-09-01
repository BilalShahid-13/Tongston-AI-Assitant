import { Button } from "@/components/ui/button"
import { useLessonStore } from "@/store/lessonStore"
import { useRouter } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { ArrowLeft, FileText } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import BreadCrumb from "./breadcrumb"
import Markdown from "./markdown"
import Watermark from "./watermark"

export default function LessonPage() {
  const { navigate } = useRouter()
  const { currentLesson, clearCurrentLesson } = useLessonStore()
  const contentRef = useRef<HTMLDivElement>(null);
  const [watermarkCount, setWatermarkCount] = useState(0);

  useEffect(() => {
    if (!currentLesson) {
      navigate({ to: "/myFiles" })
    }
  }, [currentLesson, navigate])

  if (!currentLesson) {
    return null
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert("Action disabled for protected content.");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight; // total content height
      const watermarksNeeded = Math.ceil(height / 200) * 4;
      // 200px per row, 4 columns
      setWatermarkCount(watermarksNeeded);
    }
  }, [currentLesson]);


  // Extract lesson info from markdown content
  const extractInfo = (content: string) => {
    const lines = content.split("\n")
    const info = {
      subject: "",
      yearClass: "",
      age: "",
      location: "",
      topic: "",
      time: "",
      classSize: "",
    }

    lines.forEach((line) => {
      if (line.includes("**Subject & Discipline**:")) {
        info.subject = line.split(":")[1]?.trim() || ""
      } else if (line.includes("**Year/Class**:")) {
        info.yearClass = line.split(":")[1]?.trim() || ""
      } else if (line.includes("**Student Average Age**:")) {
        info.age = line.split(":")[1]?.trim() || ""
      } else if (line.includes("**Location**:")) {
        info.location = line.split(":")[1]?.trim() || ""
      } else if (line.includes("**Topic/Sub-topic**:")) {
        info.topic = line.split(":")[1]?.trim() || ""
      } else if (line.includes("**Time Available**:")) {
        info.time = line.split(":")[1]?.trim() || ""
      } else if (line.includes("**Class Size**:")) {
        info.classSize = line.split(":")[1]?.trim() || ""
      }
    })

    return info
  }

  const lessonInfo = extractInfo(currentLesson.answer)

  const handleBack = () => {
    clearCurrentLesson()
    navigate({ to: "/myFiles" })
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-800">
      <BreadCrumb
        section="My Files"
        currentPage={lessonInfo.topic || "Lesson Plan"}
        className="text-white font-medium"
      />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to My Files
            </Button>

            {/* <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-[#ffb900] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ffb900]"
            >
              <Download className="h-4 w-4" />
              Download
            </Button> */}
          </div>

          {/* Lesson Plan Content */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
            {/* Title Header */}
            <div className="bg-gradient-to-r from-[var(--k12-primary)] via-[var(--k12-secondary)]
             to-[#ff8c00] text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{lessonInfo.topic || "Lesson Plan"}</h1>
                  <p className="text-orange-100 text-lg">{lessonInfo.subject}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 select-none relative">
              <div className="absolute grid grid-cols-4 gap-32 z-0 justify-center items-center w-full h-full">
                {Array.from({ length: watermarkCount }).map((_, i) => (
                  <Watermark key={i} textSize="1rem" imageSize="40px" />
                ))}
              </div>

              <div ref={contentRef} className="prose prose-lg max-w-none dark:prose-invert">
                <Markdown>
                  {currentLesson.answer}
                </Markdown>
              </div>
              <div className="print-blocked hidden">
                Printing is disabled for this protected lesson.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
