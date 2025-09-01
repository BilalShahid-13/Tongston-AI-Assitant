import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { FAQ } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Info, LoaderCircle } from "lucide-react"
import { fetchFaqs } from "./admin/utils/api"

export default function FaqAccordion({
  category,
  className,
}: {
  category: string
  className?: string
}) {
  const { data: faqs = [], isLoading, isError } = useQuery<FAQ[]>({
    queryKey: ["faqs", category],
    queryFn: () => fetchFaqs(category),
    retry: 1,
  })

  console.log("faqs", faqs)

  if (isLoading) {
    return (
      <div className="w-full h-screen max-lg:h-auto flex justify-center items-center">
        <LoaderCircle className="animate-spin w-8 h-8 text-[var(--k12-tertiary)]" />
      </div>
    )
  }

  if (isError) {
    return <p className="text-red-500">Failed to load FAQs.</p>
  }

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center
       py-10 text-gray-500">
        <Info className="w-10 h-10 mb-3 text-[var(--k12-secondary)]" />
        <p className="text-center">No FAQs available for this category.</p>
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible
      className={cn("w-full", className)}>
      {faqs.map((item, index) => (
        <AccordionItem value={item.id ?? index.toString()} key={item.id ?? index}
          className="w-full space-y-3">
          <AccordionTrigger
            className="cursor-pointer text-[var(--k12-secondary)] hover:text-[var(--k12-secondary)]
           w-full text-left px-4 py-2 font-medium capitalize">
            {item.heading}
          </AccordionTrigger>
          <AccordionContent
            className="w-full px-4 py-2 text-muted-foreground">
            <p>{item.description}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
