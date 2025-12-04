'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Loader2,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
  Globe,
} from 'lucide-react'
import {
  queryRAG,
  uploadDocument,
  uploadImage,
} from '@/lib/api'

type Message = {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ filename: string; page: string | number; similarity_score: number }>
  timestamp: Date
}

const suggestedQueries = [
  'Explain fundamental rights with key articles',
  "What were India's commitments at COP28?",
  'Analyse the MSP reforms 2024',
  'Help me practice a mains answer on Uniform Civil Code',
]

export default function MentorPage() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    setUploadedFiles((prev) => [...prev, ...Array.from(event.target.files!)])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!query.trim() && uploadedFiles.length === 0) return

    const userMessage = query.trim()
    
    // Add user message to chat
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage || 'Please analyze the uploaded documents',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newUserMessage])
    setQuery('')
    setLoading(true)
    setError(null)

    try {
      if (uploadedFiles.length > 0) {
        setUploading(true)
        for (const file of uploadedFiles) {
          try {
            if (file.type.startsWith('image/')) {
              await uploadImage(file)
            } else if (file.type === 'application/pdf') {
              await uploadDocument(file)
            }
          } catch (uploadErr) {
            console.warn(`Failed to upload ${file.name}`, uploadErr)
          }
        }
        setUploading(false)
        setUploadedFiles([])
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      const data = await queryRAG({
        query: userMessage || 'Analyse the uploaded documents',
        document_type: 'textbook',
        use_llm: false,  // Disabled until OpenAI key is configured on backend
        use_web_search: useWebSearch,
        top_k: 5,
      })

      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || data.context || 'I apologize, but I could not generate a response. Please try again.',
        sources: data.sources,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to fetch response. Please try again.'
      )
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Welcome to Ignize AI
              </h2>
              <p className="mb-8 text-center text-gray-600">
                Your AI-powered UPSC assistant. Ask me anything or upload documents to get started.
              </p>
              
              <div className="w-full space-y-3">
                <p className="text-sm font-semibold text-gray-700">Try asking:</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestedQueries.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition hover:border-primary/30 hover:bg-primary/5"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message History */
            messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 bg-white text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  
                  {showSources && message.sources && message.sources.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                      <p className="text-xs font-semibold text-gray-500">Sources:</p>
                      {message.sources.map((source, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-lg bg-gray-50 px-3 py-2 text-xs"
                        >
                          <p className="font-medium text-gray-700">{source.filename}</p>
                          <p className="text-gray-500">Page {source.page}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t border-gray-200 bg-red-50 px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                  >
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="max-w-[200px] truncate text-gray-700">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-end gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Upload Buttons */}
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100">
                    <ImageIcon className="h-4 w-4" />
                    <span>Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </label>
                  
                  {/* Web Search Toggle */}
                  <button
                    type="button"
                    onClick={() => setUseWebSearch(!useWebSearch)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      useWebSearch
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Web Search</span>
                  </button>
                  
                  {/* Show Sources Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowSources(!showSources)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      showSources
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Sources</span>
                  </button>
                </div>
                
                {/* Text Input */}
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Ask anything about UPSC preparation..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={3}
                  disabled={loading}
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || uploading || (!query.trim() && uploadedFiles.length === 0)}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading || uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
