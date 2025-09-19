import { useEffect } from "react"
import { backendApi } from "@/lib/constant"
import { useAnalyticsStore } from "@/store/analyticsStore"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

async function fetchAnalyticsData() {
  const { data } = await axios.get(`${backendApi}/api/getPlanFiles`)
  return data
}

export function useAnalyticsData() {
  const setAnalyticsData = useAnalyticsStore((state) => state.setAnalyticsData)

  const query = useQuery({
    queryKey: ["analyticsData"],
    queryFn: fetchAnalyticsData,
  })

  useEffect(() => {
    if (query.data) {
      setAnalyticsData(query.data)
    }
  }, [query.data, setAnalyticsData])

  return query
}
