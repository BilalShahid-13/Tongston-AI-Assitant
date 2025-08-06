import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export default function FaqAccordion({
  prompt,
  response,
  className
}: {
  prompt: string
  response: string | string[]
  className: string
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full", className)}
    >
      <AccordionItem value="item-1" className="w-full">
        <AccordionTrigger
          className="cursor-pointer text-yellow-500
           w-full text-left px-4 py-2 font-medium capitalize">
          {prompt}
        </AccordionTrigger>
        <AccordionContent className="w-full px-4 py-2 text-muted-foreground">
          {Array.isArray(response) ? (
            <ul className="list-decimal pl-4 space-y-2">
              {response.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{response}</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
