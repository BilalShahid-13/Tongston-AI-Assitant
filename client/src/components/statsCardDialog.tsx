import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, RotateCcw } from "lucide-react";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface StatsCardDialogProps {
  label: string;
  children: React.ReactNode;
  title: string;
  onReset: () => void;
}

export default function StatsCardDialog({
  label,
  children,
  title,
  onReset,
}: StatsCardDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(() => {
      onReset?.();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle>{title}</DialogTitle>
          <div className="text-muted-foreground text-sm">
            {children}
          </div>
        </DialogHeader>


        <DialogFooter>
          <Button
            onClick={handleReset}
            variant="default"
            disabled={isPending}
            className="flex items-center gap-2 hover:bg-amber-400"
          >
            <RotateCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Reset Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
