import { toast } from "sonner";

export const showFieldErrors = (errors: Record<string, any>) => {
  console.log('show field errors', errors);
  Object.entries(errors).forEach(([field, error]) => {
    if (error?.message) {
      toast.error(`${field}: ${error.message}`,
        {
          action: {
            label: `Go to ${field} field`,
            onClick: () => {
              const el = document.getElementById(field);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                (el as HTMLElement).focus();
              }
            }
          },
        },

      );
    }
  });
};

const statusMessages = [
  "Fetching data...",
  "Polishing data...",
  "Getting data from Tongston knowledge bank..."
];

export async function animateStatusMessages(setStatusMessage: (message: string | null) => void) {
  for (const message of statusMessages) {
    setStatusMessage(message);
    await new Promise((resolve) => setTimeout(resolve, 100)); // 1.2 seconds per message
  }
  setStatusMessage(null);
}