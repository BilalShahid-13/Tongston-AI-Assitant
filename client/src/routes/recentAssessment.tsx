import RecentPlan from '@/components/recentPlans'
import { latestAssessmentPlan } from '@/lib/constant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recentAssessment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecentPlan planNames={latestAssessmentPlan} />
}
