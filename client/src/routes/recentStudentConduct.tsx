import RecentPlan from '@/components/recentPlans'
import { latestStudentConductPlan } from '@/lib/constant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recentStudentConduct')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecentPlan planNames={latestStudentConductPlan} />

}
