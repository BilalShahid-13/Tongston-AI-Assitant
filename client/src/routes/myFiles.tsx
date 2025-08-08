import ShowAllPlan from '@/pages/myFiles/showAllPlan'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/myFiles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<>
    <ShowAllPlan />
  </>)
}
