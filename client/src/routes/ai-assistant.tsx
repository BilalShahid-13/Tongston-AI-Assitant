import { ReactTourProvider } from '@/components/reactTourComponents'
import AiAssistantHeader from '@/components/welcome/aiAssistantHeader'
import { homePageWalkthroughSteps } from '@/lib/constant'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-assistant')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <ReactTourProvider
      walkthroughSteps={homePageWalkthroughSteps}
    >
      {/* <AiAssitstantHeader /> */}
      <AiAssistantHeader />
    </ReactTourProvider>
  </>
}
