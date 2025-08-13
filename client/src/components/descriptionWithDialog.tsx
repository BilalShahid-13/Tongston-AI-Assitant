import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";
import DownloadMarkdown from "./downloadMarkdown";
import { Button } from "./ui/button";
interface Props {
  des: string;
  setIsOpen: Dispatch<SetStateAction<boolean>> // expects a boolean or a function;
  fileName: string
}

export default function DescriptionWithDialog({ des, setIsOpen, fileName }: Props) {
  // Truncate text to ~150 chars for preview
  const truncated = des.length > 150 ? des.slice(0, 150) + "..." : des;
  console.log('fileName', fileName)
  return (
    <div className="flex-1 p-6 flex flex-col justify-center">
      <div className="transition-all duration-300">
        <span className="text-muted-foreground leading-relaxed">
          <DownloadMarkdown >{truncated}</DownloadMarkdown>
          {/* <Markdown isButtonEnable={false}>{truncated}</Markdown> */}
          {des.length > 150 && (
            <>
              <Button variant={"link"}
                className="text-zinc-500 underline"
                onClick={() => setIsOpen(true)}
              >
                See More
              </Button>
            </>
          )}
        </span>
      </div>


      <DialogContent className="max-w-lg max-h-[70vh] overflow-auto">
        <DialogHeader >
          <DialogTitle className="sticky top-0">Description</DialogTitle>
          <div
            className="dark:border-zinc-900 border-[1px] w-full"></div>
        </DialogHeader>
        <DialogDescription>
          <DownloadMarkdown fileName={fileName}>{des}</DownloadMarkdown>
          {/* </span> */}
        </DialogDescription>
      </DialogContent>
    </div>
  );
}
