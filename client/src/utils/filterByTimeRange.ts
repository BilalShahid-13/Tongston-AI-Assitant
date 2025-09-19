import type { TimeFilter } from "@/components/CardFilterDropdown";
import type { AnalyticsItem } from "@/types";

export function filterByTimeRange(
  data: AnalyticsItem[],
  range: TimeFilter
): AnalyticsItem[] {
  const now = new Date();

  const ranges: Record<TimeFilter, Date> = {
    Day: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),     // last 24h
    Week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),   // last 7 days
    Month: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),  // last 30 days
    Quarter: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),// last 3 months
    Year: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),   // last 12 months
  };

  const cutoff = ranges[range];

  return data.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return createdAt >= cutoff && createdAt <= now;
  });
}
