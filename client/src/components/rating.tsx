import { Rating as ReactRating, ThinStar } from "@smastrom/react-rating"
import '@smastrom/react-rating/style.css'
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { backendApi } from "@/lib/constant";
import { Loader2 } from "lucide-react";

interface CreateRatingPayload {
  userId: string;
  value: number;
}

const useCreateRating = () => {
  return useMutation({
    mutationFn: async (data: CreateRatingPayload) => {
      const res = await axios.post(`${backendApi}/api/createRating`, data);
      return res.data;
    },
  });
};

export default function StarRating({
  open,
  setOpen = () => { }
}: {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [rating, setRating] = useState(0)
  const { mutate, isPending } = useCreateRating()
  function onContinue() {
    mutate(
      { userId: "64f1c2a9e8b5a2d3f0a1b7c1", value: rating },
      {
        onSuccess: () => {
          toast.success("Thank you for your feedback!");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to submit rating. Please try again.");
        },
      }
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rate Your Experience</AlertDialogTitle>
          <AlertDialogDescription>
            We’d love to hear your feedback! Please rate your experience below:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Rating Component inside Dialog */}
        <div className="flex justify-center py-4">
          <ReactRating
            itemStyles={{
              itemShapes: ThinStar,
              activeFillColor: '#ffb700',
              inactiveFillColor: '#fbf1a9'
            }}
            style={{ maxWidth: 250 }}
            value={rating}
            onChange={setRating}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue} disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
