import { backendApi, feedbackGeneratorCount, type ApiType } from "@/lib/constant";
import { useNavigate } from "@tanstack/react-router";
import { animateStatusMessages } from "./showFieldError";
import { useRatingStore } from "@/store/ratingStore";

interface IOnSubmit {
  api: ApiType,
  payload: any,
  setStatusMessage: (message: string | null) => void,
  setShowPlan: (show: boolean) => void,
  setData: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: (show: boolean) => void,
  navigate: ReturnType<typeof useNavigate>; // 👈 add here
}

export const onSubmitFn = async ({ payload, api, navigate,
  setStatusMessage, setShowPlan, setData, setLoading }:
  IOnSubmit) => {
  let feedbackCountStr = localStorage.getItem('feedbackCount');
  let feedbackCount = feedbackCountStr ? parseInt(feedbackCountStr, 10) : 0;
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
      const errorText: { error: string, missingFields: string[] } = await response.json();
      return {
        error: errorText.error,
        status: errorText.missingFields
      }
      // throw new Error(`Error ${response.status}: ${errorText}`);
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
      }
    }
    feedbackCount += 1;
    localStorage.setItem("feedbackCount", feedbackCount.toString());
    // If user has generated 3 plans, show feedback section
    if (feedbackCount >= feedbackGeneratorCount) {
      localStorage.setItem("feedbackCount", "0"); // ✅ reset count
      navigate({ to: "/feedback" });
    }

  } catch (error) {
    console.error("Failed to fetch plan:", error);
  }
  finally {
    setLoading(false);
  }
}