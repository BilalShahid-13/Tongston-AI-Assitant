"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DownloadMarkdown from "./downloadMarkdown"

interface FullScreenPreviewProps {
  isOpen: boolean
  onClose: () => void
  content: string
  fileName: string
}

export default function FullScreenPreview({ isOpen, onClose, content, fileName }: FullScreenPreviewProps) {
  console.log("[v0] FullScreenPreview render - isOpen:", isOpen, "fileName:", fileName)

  const handleBackdropClick = () => {
    console.log("[v0] Backdrop clicked - closing modal")
    onClose()
  }

  const handleContentClick = (e: React.MouseEvent) => {
    console.log("[v0] Content area clicked - preventing close")
    e.stopPropagation()
  }

  const handleCloseClick = () => {
    console.log("[v0] Close button clicked")
    onClose()
  }

  console.log('isOpen',isOpen)

  return (
    <div>
      {isOpen && (
        <div
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 0.2 }}
          className="fixed z-50 bg-background/95 backdrop-blur-sm w-screen h-screen"
          onClick={handleBackdropClick}
        >
          <div
            // initial={{ scale: 0.95, opacity: 0 }}
            // animate={{ scale: 1, opacity: 1 }}
            // exit={{ scale: 0.95, opacity: 0 }}
            // transition={{ duration: 0.2 }}
            className="fixed inset-4 bg-background border
            rounded-lg shadow-2xl flex flex-col"
            onClick={handleContentClick}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Lesson Plan Preview</h2>
                <p className="text-muted-foreground">{fileName}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseClick} className="h-10 w-10">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="max-w-4xl mx-auto">
                  <DownloadMarkdown fileName={fileName}>{content}</DownloadMarkdown>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
