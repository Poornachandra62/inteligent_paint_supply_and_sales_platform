import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader, Sparkles, Bot, User } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  role: 'owner' | 'salesperson' | 'distributor';
  businessData?: any;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ role, businessData = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: getWelcomeMessage(role),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function getWelcomeMessage(userRole: string): string {
    if (userRole === 'owner') {
      return "👋 Hi! I'm Chroma, your AI Business Advisor. Ask me anything about your business strategy, growth opportunities, or data analysis!";
    } else if (userRole === 'salesperson') {
      return "👋 Hey there! I'm Chroma, your AI Sales Coach. Ask me about customer handling, product recommendations, or sales techniques!";
    } else if (userRole === 'distributor') {
      return "👋 Hello! I'm Chroma, your AI Logistics Expert. Ask me about inventory, delivery routes, or supply chain optimization!";
    }
    return "👋 Hi! I'm Chroma. How can I help you today?";
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAI(inputValue, {
        role,
        businessData,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.success && response.data ? response.data : 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I had trouble processing that. Please try again!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = getSuggestedQuestions(role);

  function getSuggestedQuestions(userRole: string): string[] {
    if (userRole === 'owner') {
      return [
        "What's driving my sales growth?",
        "How can I improve profit margins?",
        "Which products should I promote?",
        "What are my top customer segments?"
      ];
    } else if (userRole === 'salesperson') {
      return [
        "How do I handle price objections?",
        "What should I upsell with white paint?",
        "How to approach premium customers?",
        "Best products for quick sales?"
      ];
    } else if (userRole === 'distributor') {
      return [
        "Which shops need restocking today?",
        "How to optimize delivery routes?",
        "What's the demand forecast?",
        "How to reduce logistics costs?"
      ];
    }
    return [];
  }

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getRoleColor = () => {
    if (role === 'owner') return 'from-purple-500 to-pink-500';
    if (role === 'salesperson') return 'from-blue-500 to-cyan-500';
    if (role === 'distributor') return 'from-green-500 to-teal-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r ${getRoleColor()} text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl hover:rotate-3 transition-all duration-300 flex items-center justify-center z-50 group animate-bounce-slow`}
          title="Chat with Chroma"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 rotate-45 group-hover:rotate-180 transition-transform duration-1000"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              Ask Chroma
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col z-50 border border-white/30 hover:bg-white/85 transition-all duration-300 animate-slide-up">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getRoleColor()} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Chroma</h3>
                <p className="text-xs opacity-90">
                  {role === 'owner' && 'AI Business Advisor'}
                  {role === 'salesperson' && 'AI Sales Coach'}
                  {role === 'distributor' && 'AI Logistics Expert'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'ai'
                      ? `bg-gradient-to-r ${getRoleColor()} text-white`
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {message.type === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.type === 'ai'
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : `bg-gradient-to-r ${getRoleColor()} text-white`
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-2 block ${message.type === 'ai' ? 'text-gray-500' : 'text-white/80'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getRoleColor()} text-white`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-gray-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 mb-2">💡 Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`px-4 py-3 bg-gradient-to-r ${getRoleColor()} text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
