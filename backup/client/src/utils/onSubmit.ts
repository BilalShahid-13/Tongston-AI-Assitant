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

export const onSubmitFn = async ({ payload, api,
  setStatusMessage, setShowPlan, setData, setLoading }:
  IOnSubmit) => {

  try {
    setLoading(true);
    const response = await fetch(`${backendApi}/api/${api}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    await animateStatusMessages(setStatusMessage);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("ReadableStream not supported or response body is null");
    }
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
        setData(prev => prev + chunk);
        console.log("Received chunk:", chunk);
      }
    }

  } catch (error) {
    console.error("Failed to fetch plan:", error);
  }
  finally {
    setLoading(false);
  }
}