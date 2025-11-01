import FaqCategoriesTab from '@/pages/helpFaqs/faqCategoriesTab'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/help-faqs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    {/* <ReactTourProvider
      walkthroughSteps={helpWalkthroughSteps}
    > */}
    <FaqCategoriesTab />
    {/* </ReactTourProvider> */}
  </>
}
