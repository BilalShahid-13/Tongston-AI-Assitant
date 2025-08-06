import { backendApi, type ApiType } from "@/lib/constant";
import { animateStatusMessages } from "./showFieldError";
interface IOnSubmit {
  api: ApiType,
  payload: any,
  setStatusMessage: (message: string | null) => void,
  setShowPlan: (show: boolean) => void,
  setData: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: (show: boolean) => void,
}

export const onSubmitFile = async ({ payload, api,
  setStatusMessage, setShowPlan, setData, setLoading }:
  IOnSubmit) => {
  try {
    setLoading(true);

    // ✅ Create FormData for file + text data
    const formData = new FormData();

    // 📦 If payload contains a file
    if (payload.lessonPlanFile) {
      formData.append("lessonPlanFile", payload.lessonPlanFile[0]); // or just .file
    }

    // 📝 Append other fields to FormData
    for (const key in payload) {
      if (key !== "lessonPlanFile" && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    }

    const response = await fetch(`${backendApi}/api/${api}`, {
      method: "POST",
      body: formData, // 🚫 No headers needed here
    });

    await animateStatusMessages(setStatusMessage);

    if (!response.ok) {
      const errorText: { error: string; missingFields: string[] } = await response.json();
      return {
        error: errorText.error,
        status: errorText.missingFields,
      };
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("ReadableStream not supported");

    const decoder = new TextDecoder("utf-8");
    let done = false;
    let lessonPlan = "";
    setShowPlan(true);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        lessonPlan += chunk;
        setData((prev) => prev + chunk);
      }
    }
  } catch (error) {
    console.error("Failed to fetch plan:", error);
  } finally {
    setLoading(false);
  }
};
