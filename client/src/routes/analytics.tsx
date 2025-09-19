import AnalyticsDashboard from '@/pages/analytics/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <><AnalyticsDashboard /></>
}
