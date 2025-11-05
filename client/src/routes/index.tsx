import AiAssistantHeader from '@/components/welcome/aiAssistantHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})


function RouteComponent() {
  return <>
    {/* <ReactTourProvider
      walkthroughSteps={homePageWalkthroughSteps}
    > */}
    {/* <DashboardSection /> */}
    <AiAssistantHeader />
    {/* </ReactTourProvider> */}
  </>
}
