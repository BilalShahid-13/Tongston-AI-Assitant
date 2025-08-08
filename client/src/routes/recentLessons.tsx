import RecentLessonPlan from '@/components/recentLessonPlan'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recentLessons')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecentLessonPlan />
}
