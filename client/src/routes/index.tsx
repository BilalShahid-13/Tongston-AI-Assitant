import { ReactTourProvider } from '@/components/reactTourComponents'
import AiAssitstantHeader from '@/components/welcome/aiAssistantHeader'
import { homePageWalkthroughSteps } from '@/lib/constant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})


function RouteComponent() {
  return <>
    <ReactTourProvider
      walkthroughSteps={homePageWalkthroughSteps}
    >
      <AiAssitstantHeader />
    </ReactTourProvider>
  </>
}
