
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, RotateCcw } from "lucide-react"
import type React from "react"
import { useTransition } from "react"
import { Button } from "./ui/button"

interface StatsCardDialogProps {
  label: string, children: React.ReactNode, title: string
  onReset: () => void
}

export default function StatsCardDialog({ label, children, title, onReset }: StatsCardDialogProps) {
  const [transitioning, setTransitioning] = useTransition();
  const handleReset = () => {
    setTransitioning(() => {
      if (onReset) onReset();
    })
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"}
            className="flex items-center gap-2 cursor-pointer">
            <Eye className="h-4 w-4" />
            {label}
          </Button>

        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="space-y-5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {children}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleReset}
              variant="primary"
              className="hover:bg-amber-400 flex items-center gap-2"
            >
              <RotateCcw className={`h-4 w-4 ${transitioning ? "animate-spin" : ""}`} />
              Reset Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
