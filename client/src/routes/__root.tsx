import App from '@/App'
import AdminLayout from '@/components/admin/adminLayout'
import ChatbotFaq from '@/components/chatbotFaq'
import { createRootRoute, useRouterState } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />
})

function RootComponent() {
  const currentPath = useRouterState().location.pathname
  const isAdmin = currentPath.startsWith("/admin")
  return isAdmin ? (
    <AdminLayout />
  ) : (
    <>
      <ChatbotFaq />
      <App />
    </>
  )
}

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-yellow-300 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-800">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
      </div>
    </div>
  )
}
