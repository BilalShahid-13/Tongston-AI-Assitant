import FeedbackForm from '@/pages/feedback/feedbackForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feedback')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FeedbackForm />
}
