import { useCallback } from "react";
import { toast } from "sonner";

export const useOnError = () => {
  return useCallback((errors: Record<string, any>) => {
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        toast.error(`${field}: ${error.message}`, {
          action: {
            label: `Go to ${field}`,
            onClick: () => {
              const el = document.getElementById(field);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                (el as HTMLElement).focus();
              }
            },
          },
        });
      }
    });
  }, []);
};
