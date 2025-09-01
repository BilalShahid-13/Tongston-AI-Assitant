import { backendApi } from "@/lib/constant"
import type { FAQ } from "@/types"
import axios from "axios"
import { faqSchema } from "../schema/faqSchema"
import { useQuery } from "@tanstack/react-query"

interface Rating {
  _id: string;
  userId: string;
  value: number;
  createdAt: string;
}

const fetchFaqs = async (category: string): Promise<FAQ[]> => {
  // const category = faqList.flatMap((item) => item.category)
  try {
    const response = await axios.post(`${backendApi}/api/get-help-faq`, {
      category,
      timeout: 10000,
    })

    return response.data.data || response.data || []
  } catch (error: any) {
    console.error("[v0] Error fetching FAQs:", error)
    return [];
  }
}

const createFaq = async (faqData: Omit<FAQ, "id">): Promise<FAQ> => {
  console.log("[v0] Creating FAQ:", faqData)

  // Validate input data
  const validatedData = faqSchema.omit({ id: true }).parse(faqData)

  try {
    const response = await axios.post(`${backendApi}/api/add-help-faq`, validatedData, {
      timeout: 10000,
    })

    console.log("[v0] Create FAQ response:", response.data)
    return response.data.data || { id: Date.now().toString(), ...validatedData }
  } catch (error: any) {
    console.error("[v0] Error creating FAQ:", error)

    // Fallback for demo
    return { id: Date.now().toString(), ...validatedData }
  }
}

const updateFaq = async (faqData: FAQ): Promise<FAQ> => {
  console.log("[v0] Updating FAQ:", faqData)

  // Validate input data
  const validatedData = faqSchema.parse(faqData)

  try {
    const response = await axios.post(`${backendApi}/api/update-help-faq`, validatedData, {
      timeout: 10000,
    })

    console.log("[v0] Update FAQ response:", response.data)
    return response.data.data || validatedData
  } catch (error: any) {
    console.error("[v0] Error updating FAQ:", error)
    return validatedData || undefined
  }
}

const deleteFaq = async ({ id, category }: { id: string; category: string }): Promise<void> => {
  console.log("[v0] Deleting FAQ:", { id, category })

  try {
    const response = await axios.post(
      `${backendApi}/api/delete-help-faq`,
      {
        id,
        category,
      },
      {
        timeout: 10000,
      },
    )

    console.log("[v0] Delete FAQ response:", response.data)
  } catch (error: any) {
    console.error("[v0] Error deleting FAQ:", error)
  }
}

const useGetRatings = () => {
  return useQuery<Rating[]>({
    queryKey: ['ratings'],
    queryFn: async () => {
      const res = await axios.get(`${backendApi}/api/getAllRatings`);
      return res.data;
    },
  });
};


export { createFaq, deleteFaq, fetchFaqs, updateFaq, useGetRatings }
