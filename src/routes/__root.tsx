import App from '@/App'
import ChatbotFaq from '@/components/chatbotFaq'
import { createRootRoute } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />
})

function RootComponent() {
  return (
    <React.Fragment>
      <ChatbotFaq />
      <App />
    </React.Fragment>
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
