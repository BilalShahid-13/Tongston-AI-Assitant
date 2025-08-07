import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { backendApi } from "@/lib/constant"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle, Send, Sparkles, X } from "lucide-react"
import type React from "react"
import { useLayoutEffect, useRef, useState } from "react"
import Markdown from "./markdown"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

// interface FAQResponse {
//   answer: string
//   query: string
// }

// const suggestedQuestions = [
//   "What's the result of this video?",
//   "What happened?",
//   "What's their training style?",
//   "How can I improve my skills?",
//   "What are the best practices?",
// ]

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      const eventSource = new EventSource(
        `${backendApi}/api/getFaq?q=${encodeURIComponent(question)}`
      );

      eventSource.onmessage = (event) => {
        if (event.data === "[END]") {
          eventSource.close();
          setIsLoading(false);
          return;
        }
        // Append streamed words to the bot message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? { ...msg, content: msg.content + event.data }
              : msg
          )
        );
      };

      eventSource.onerror = (err) => {
        console.error("❌ Stream error:", err);
        eventSource.close();
        setIsLoading(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id
              ? {
                ...msg,
                content:
                  "I'm sorry, I'm having trouble connecting right now. Please try again later.",
              }
              : msg
          )
        );
      };
    } catch (error) {
      console.error("Error initializing stream:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50); // tweak delay if needed (e.g., 30-100ms)
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-yellow-600 hover:bg-yellow-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {/* Chatbot Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="fixed top-0 right-0 h-full w-96 z-50 shadow-2xl"
          >
            <Card className="h-full flex flex-col bg-white border-l">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">AI Assist</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto gap-3
              p-4 space-y-4 bg-gray-50/30">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4"
                    >
                      <Sparkles className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ask anything about your lesson or topic</h3>

                  </div>
                ) : (
                  <div className="gap-3 flex flex-col">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start gap-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback
                              className={message.type === "user" ? "bg-yellow-500 text-white" : "bg-gray-200"}
                            >
                              {message.type === "user" ? "U" : "AI"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 ${message.type === "user"
                              ? "bg-yellow-500 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                              }`}
                          >
                            {/* {message.type === "bot" ? */}
                            <Markdown isButtonEnable={false}>{message.content}
                            </Markdown>
                            {/* <p className="text-sm leading-relaxed">{message.content}</p> */}
                            {/* } */}
                            {/* <p className="text-sm leading-relaxed">
                              {message.content}
                              {message.type === "bot" && isLoading && message.id === messages[messages.length - 1]?.id && (
                                <span className="animate-pulse">|</span>
                              )}
                            </p> */}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex items-start gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200">AI</AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything"
                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
