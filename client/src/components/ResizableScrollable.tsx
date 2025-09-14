import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import type { IResizableScrollable } from "@/types"
export default function ResizableScrollable({ leftChildren, RightChildren, isOpen }: IResizableScrollable) {
  return (
    <>
      <ResizablePanelGroup direction="horizontal"
     >
        <ResizablePanel
        //
        minSize={40}
        className="p-2">
          {leftChildren}
        </ResizablePanel>

        {isOpen && (
          <>
            <ResizableHandle withHandle/>
            <ResizablePanel
            minSize={40}
            //  minSize={40}
              >
              {RightChildren}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

    </>
  )
}
