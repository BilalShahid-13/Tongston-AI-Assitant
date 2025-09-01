import LessonPage from "@/components/lessonPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/lesson/$lessonId")({
  component: RouteComponent,
})

function RouteComponent() {
  return <LessonPage />
}
