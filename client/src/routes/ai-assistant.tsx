import StarRating from '@/components/rating'
import AiAssistantHeader from '@/components/welcome/aiAssistantHeader'
import { useRatingStore } from '@/store/ratingStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-assistant')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isOpen, setIsOpen } = useRatingStore()
  return <>
    <StarRating open={isOpen} setOpen={setIsOpen} />
    {/* <ReactTourProvider
      walkthroughSteps={homePageWalkthroughSteps}
    > */}
    <AiAssistantHeader />
    {/* </ReactTourProvider> */}
  </>
}
