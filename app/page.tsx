'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare,
  Newspaper,
  FileEdit,
  CheckSquare,
  Sparkles,
  Image,
  FileText,
  Globe,
  BookOpen,
  Bell,
  HelpCircle,
  ChevronRight,
  Zap
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
  timestamp: Date;
};

const menuItems = [
  { id: 'mentor', label: 'Mentor AI', description: 'Chat-based personalised guidance', icon: MessageSquare, active: true },
  { id: 'current', label: 'Current Affairs', description: 'Daily briefs with web search', icon: Newspaper },
  { id: 'mains', label: 'Mains Evaluation', description: 'Upload answers for instant scoring', icon: FileEdit },
  { id: 'mcq', label: 'MCQ Lab', description: 'Timed prelims simulator', icon: CheckSquare },
];

const suggestedQuestions = [
  'Explain fundamental rights with key articles',
  'What were India\'s commitments at COP28?',
  'Analyse the MSP reforms 2024',
  'Help me practice a mains answer on Uniform Civil Code',
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('mentor');
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useRAG, setUseRAG] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let answer = '';
      let sourcesInfo = '';
      
      // If web search is enabled, first fetch from UPSC sources
      if (useWebSearch) {
        try {
          const webSearchResponse = await fetch('/api/web-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text }),
          });
          
          if (webSearchResponse.ok) {
            const webData = await webSearchResponse.json();
            if (webData.answer) {
              answer = webData.answer;
              sourcesInfo = webData.sources_used?.join(', ') || '';
            }
          }
        } catch (webError) {
          console.log('Web search fallback to LLM:', webError);
        }
      }
      
      // If no web search result, use LLM directly
      if (!answer) {
        // Clean system prompt - no excessive formatting
        let systemPrompt = `You are IGNIZE AI, a UPSC expert mentor. 

IMPORTANT RULES:
- Keep responses crisp and exam-focused
- Use simple bullet points (-)
- Avoid excessive markdown symbols (no **, ##, etc.)
- Include key facts, dates, and figures
- End with "UPSC Relevance: [Paper] - [Topic]"
- Maximum 300 words unless asked for detailed answer`;
        
        if (useRAG) {
          systemPrompt += '\n- Reference relevant sources when available.';
        }
        
        const response = await fetch('/api/vllm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-oss-120b',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        answer = data.choices?.[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
      }

      // Add source indicator if web search was used
      let answerContent = answer;
      if (useWebSearch && sourcesInfo) {
        answerContent = `Sources: ${sourcesInfo}\n\n${answer}`;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answerContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I'm having trouble connecting. ${error.message || 'Please check if the server is running.'}`,
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

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Menu Items */}
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                item.active || activeMenu === item.id
                  ? 'bg-violet-50 border-2 border-violet-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                item.active || activeMenu === item.id ? 'bg-violet-100' : 'bg-gray-100'
              }`}>
                <item.icon className={`w-5 h-5 ${
                  item.active || activeMenu === item.id ? 'text-violet-600' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${
                  item.active || activeMenu === item.id ? 'text-violet-700' : 'text-gray-700'
                }`}>{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Promo Card */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl text-white">
          <p className="text-xs font-semibold tracking-wider opacity-90">PRELIMS 2025</p>
          <p className="font-bold mt-2 text-lg leading-tight">Fast-track your revision with curated tests and mentoring.</p>
          <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-all">
            Upgrade to Ignite+
          </button>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">System status:</span>
            <span className="text-green-500 font-semibold">All green</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Need help?</span>
            <a href="mailto:support@ignize.ai" className="text-violet-600 font-medium">support@ignize.ai</a>
          </div>
          <p className="text-xs text-gray-400 mt-3">© 2025 Ignize AI Labs.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">Mentor AI</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Real-time RAG
            </span>
          </div>
          <p className="text-sm text-gray-500">Conversational RAG copilot for UPSC prelims & mains</p>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Prelims 2025 Sprint
            </button>
            <div className="text-right">
              <p className="text-xs text-gray-400">TODAY</p>
              <p className="text-sm font-semibold text-gray-700">{dayNames[today.getDay()]}, {today.getDate()} {monthNames[today.getMonth()]}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-semibold text-sm">
                SS
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Shushruth</p>
                <p className="text-xs text-gray-400">Ignite+ beta</p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-12">
              {/* Welcome Icon */}
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-violet-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Ignize AI</h2>
              <p className="text-gray-500 mb-8">Your AI-powered UPSC assistant. Ask me anything or upload documents to get started.</p>
              
              {/* Suggested Questions */}
              <div className="text-left mb-8">
                <p className="text-sm font-medium text-gray-600 mb-4">Try asking:</p>
                <div className="grid grid-cols-2 gap-3">
                  {suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(question)}
                      className="p-4 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 hover:border-violet-300 hover:bg-violet-50 transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-all">
                <Image className="w-4 h-4" />
                Photo
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-all">
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button 
                onClick={() => setUseWebSearch(!useWebSearch)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  useWebSearch 
                    ? 'bg-violet-100 text-violet-700 border-2 border-violet-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Globe className="w-4 h-4" />
                Web Search
                {useWebSearch && <span className="ml-1 text-xs">✓</span>}
              </button>
              <button 
                onClick={() => setUseRAG(!useRAG)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  useRAG 
                    ? 'bg-violet-100 text-violet-700 border-2 border-violet-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Sources
                {useRAG && <span className="ml-1 text-xs">✓</span>}
              </button>
            </div>
            
            {/* Input Field */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about UPSC preparation..."
                className="w-full p-4 pr-14 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none resize-none text-gray-800 placeholder-gray-400"
                rows={2}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-3 p-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 rounded-lg text-white transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
