'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  BookOpen, 
  FileText, 
  Newspaper, 
  Brain,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  sources?: any[];
  timestamp: Date;
};

type Mode = 'general' | 'prelims' | 'mains' | 'current_affairs';

const modes: { id: Mode; label: string; icon: any; description: string }[] = [
  { id: 'general', label: 'General', icon: Brain, description: 'Ask anything about UPSC' },
  { id: 'prelims', label: 'Prelims', icon: Target, description: 'MCQ practice & explanations' },
  { id: 'mains', label: 'Mains', icon: FileText, description: 'Answer writing practice' },
  { id: 'current_affairs', label: 'Current Affairs', icon: Newspaper, description: 'Latest news & analysis' },
];

const stats = [
  { label: 'Prelims Accuracy', value: '94.2%', icon: Target },
  { label: 'Topics Covered', value: '10,000+', icon: BookOpen },
  { label: 'Daily Users', value: '50K+', icon: TrendingUp },
  { label: 'Avg. Response', value: '2.3s', icon: Clock },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('general');
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      mode,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          mode,
          use_rag: true,
          use_reranker: true,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'I apologize, but I encountered an error. Please try again.',
        mode,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please check if the server is running.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center glow-saffron">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">IGNIZE AI</h1>
              <p className="text-xs text-gray-400">India's #1 UPSC AI Mentor</p>
            </div>
          </div>

          {/* Stats - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-saffron-500" />
                <div>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 rounded-lg glass"
          >
            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Mode Selection */}
        <AnimatePresence>
          {(showSidebar || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed lg:sticky top-[73px] left-0 w-72 h-[calc(100vh-73px)] glass p-4 z-40 overflow-y-auto"
            >
              <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                Select Mode
              </h2>
              <div className="space-y-2">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      setShowSidebar(false);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      mode === m.id
                        ? 'bg-gradient-to-r from-saffron-500/20 to-saffron-600/10 border border-saffron-500/50'
                        : 'glass hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        mode === m.id ? 'bg-saffron-500' : 'bg-navy-700'
                      }`}>
                        <m.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                  Quick Start
                </h2>
                <div className="space-y-2">
                  {[
                    'Explain Article 370',
                    'GST and federalism',
                    'Climate change on agriculture',
                    'Judicial activism pros & cons',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(prompt)}
                      className="w-full p-3 rounded-lg glass text-left text-sm hover:bg-white/10 flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-saffron-500" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center mb-6 glow-saffron">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome to <span className="gradient-text">IGNIZE AI</span>
                </h2>
                <p className="text-gray-400 max-w-md mb-8">
                  Your AI-powered UPSC mentor. Ask me anything about Prelims, Mains, 
                  or Current Affairs. I'll provide accurate, well-researched answers.
                </p>
                
                {/* Mode badges */}
                <div className="flex flex-wrap justify-center gap-3">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        mode === m.id
                          ? 'bg-saffron-500 text-white'
                          : 'glass hover:bg-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 rounded-br-sm'
                        : 'glass rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-400 mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.slice(0, 3).map((source, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-md bg-navy-700 text-xs"
                            >
                              {source.filename || source.source || `Source ${i + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass p-4 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-saffron-500 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-saffron-500 typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-saffron-500 typing-dot" />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 glass-strong">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask about ${mode === 'prelims' ? 'Prelims MCQs' : mode === 'mains' ? 'Mains answers' : 'UPSC topics'}...`}
                  className="w-full p-4 pr-12 rounded-xl bg-navy-800 border border-white/10 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 outline-none resize-none text-white placeholder-gray-500"
                  rows={1}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-4 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-saffron"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              IGNIZE AI uses RAG with reranking for accurate, source-backed answers.
              Mode: <span className="text-saffron-500 font-medium">{mode}</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
