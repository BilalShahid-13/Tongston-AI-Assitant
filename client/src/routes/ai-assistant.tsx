import AiAssistantHeader from '@/components/welcome/aiAssistantHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-assistant')({
  component: RouteComponent,
})

function RouteComponent() {
  // const { isOpen, setIsOpen } = useRatingStore()
  return <>
    {/* <StarRating open={isOpen} setOpen={setIsOpen} /> */}
    {/* <ReactTourProvider
      walkthroughSteps={homePageWalkthroughSteps}
    > */}
    <AiAssistantHeader />
    {/* </ReactTourProvider> */}
  </>
}
