"use client"

import { useState } from "react"
import { Bot, X, Send, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export function AIBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI guide for TheWordOf Tools. What are you looking to build today?",
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sendChatMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage = { id: Date.now().toString(), role: "user", content: text }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let done = false
      let responseText = ""

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "" }])

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        responseText += chunkValue
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = responseText
          return newMessages
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitCustom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await sendChatMessage(input)
  }

  const quickReplies = [
    "Help me build a CV",
    "Generate an Invoice",
    "Create a QR Code",
  ]

  const handleQuickReply = (text: string) => {
    sendChatMessage(text)
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50",
          isOpen ? "rotate-90 opacity-0 scale-0 pointer-events-none" : "rotate-0 opacity-100 scale-100"
        )}
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Popover */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] z-50 transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <Card className="h-full flex flex-col shadow-2xl border-primary/20 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">TheWordOf AI Guide</h3>
                <p className="text-xs text-primary-foreground/80">Online & ready to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-white rounded-full h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                  )}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-foreground" />}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-background border border-border rounded-tl-sm"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0">
                    <ReactMarkdown 
                      components={{
                        a: ({ node, ...props }) => <a {...props} className="text-blue-500 hover:underline" />
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Replies if only initial message exists */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-4 ml-10">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-background border border-border hover:border-primary hover:text-primary transition-colors px-3 py-1.5 rounded-full shadow-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center gap-2 max-w-[85%] mr-auto">
                <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-.3s]" />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 border-t bg-background">
            <form onSubmit={handleSubmitCustom} className="flex w-full gap-2 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="pr-10 rounded-full bg-muted/50 focus-visible:ring-primary/20"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isLoading}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
