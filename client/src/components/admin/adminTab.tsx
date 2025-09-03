import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload, MessageSquareQuoteIcon as MessageSquareQuestion,
} from "lucide-react"
import KnowledgeBaseContent from "./KnowledgeBaseContent"
import { HelpFaqAdmin } from "./helpFaqAdmin"
export default function AdminTab() {
  return (
    <>
      <div className="max-w-6xl mx-auto mt-4">
        <Tabs defaultValue="knowledgeBase" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2
          max-sm:grid-cols-1 gap-2 px-1 py-1 rounded-md
             bg-white/80 dark:bg-gray-800/80 h-11
              backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger
              value="knowledgeBase"
              className="data-[state=active]:bg-gradient-to-r
                data-[state=active]:from-[var(--k12-primary)]
                data-[state=active]:to-[var(--k12-secondary)] cursor-pointer
                data-[state=active]:text-black font-semibold"
            >
              <MessageSquareQuestion className="w-4 h-4 mr-2" />
              Knowledge Base Files
            </TabsTrigger>
            <TabsTrigger
              value="faqs"
              className="data-[state=active]:bg-gradient-to-r
                data-[state=active]:from-[var(--k12-primary)]
                data-[state=active]:to-[var(--k12-secondary)] cursor-pointer
                 data-[state=active]:text-black font-semibold"
            >
              <Upload className="w-4 h-4 mr-2" />
              FAQ Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="knowledgeBase">
            <KnowledgeBaseContent />
          </TabsContent>
          <TabsContent value="faqs">
            <HelpFaqAdmin />
          </TabsContent>

        </Tabs>
      </div>
    </>
  )
}
