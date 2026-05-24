import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, X, Send, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  recommendedProduct?: Product;
}

interface AiMatchmakerProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  products?: Product[];
}

export default function AiMatchmaker({ onSelectProduct, onAddToCart, products }: AiMatchmakerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Haii! I am Koji-chan, your cute aesthetic AI art curator! 🦊🌸 Tell me what vibe or favorite anime colors you'd like to bring into your space, and I'll find your perfect matched print!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) {
      setHasNewMessage(true);
    }
  }, [isOpen]);

  const quickPrompts = [
    { text: "🧸 Dreamy pastel & soft vibes", val: "dreamy" },
    { text: "🔥 Energetic & radiant hearts", val: "rengoku" },
    { text: "🌸 Cozy flower fields vibe", val: "cozy" },
    { text: "🔮 Dark aesthetic & witchy lines", val: "bayonetta" }
  ];

  const processResponse = (userText: string, updatedHistory: Message[]) => {
    setIsTyping(true);
    
    // We send the current message history to the backend
    fetch("/api/matchmaker/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedHistory.map(m => ({
          sender: m.sender,
          text: m.text
        }))
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Server storm!");
        return res.json();
      })
      .then(data => {
        const catalogList = products || PRODUCTS;
        const recommendedProduct = data.recommendedProductId 
          ? catalogList.find(p => p.id === data.recommendedProductId)
          : undefined;

        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'ai',
            text: data.text || "Haii! There was a tiny cloud block, but I am here! 🌸 How else can I help your aesthetic dreams?",
            timestamp: new Date(),
            recommendedProduct
          }
        ]);
        setIsTyping(false);
      })
      .catch((err) => {
        console.error("Matchmaker Error:", err);
        // Sweet anime-style fallback when the server encounters an issue
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'ai',
            text: "Kyaa! My star signals got crossed under a soft warm cloud. 🌸 But I still love your vibe! Let me know if you want to snuggle up with a sweet peach art style!",
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      });
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    processResponse(text, newHistory);
  };

  return (
    <>
      {/* Floating Sparkle Bubble Launcher */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="btn-ai-launcher"
          onClick={() => {
            setIsOpen(true);
            setHasNewMessage(false);
          }}
          className={`flex items-center gap-2 px-4 py-3 bg-[#82D1C1] text-[#2B2D31] font-bold rounded-full border-2 border-[#2B2D31] shadow-[3px_3px_0px_0px_#FFB3C1] hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer ${isOpen ? 'scale-0' : 'scale-100'}`}
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 animate-bounce" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF8097]"></span>
              </span>
            )}
          </div>
          <span className="font-display text-sm tracking-wide">Koji Vibe Helper</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="panel-ai-chat"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-32px)] h-[520px] bg-[#FDFBF7] border-2 border-[#2B2D31] rounded-2xl shadow-[6px_6px_0px_0px_#2B2D31] z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#FFB3C1] border-b-2 border-[#2B2D31] px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border border-[#2B2D31] bg-[#FDFBF7] flex items-center justify-center font-bold text-lg select-none">
                  🌸
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#2B2D31] flex items-center gap-1">
                    Koji Ai Matchmaker
                    <Sparkles className="h-3 w-3 text-[#FF8097] fill-[#FF8097]" />
                  </h3>
                  <p className="text-[10px] text-[#2B2D31]/80 font-medium">Bubbly Art Assistant • Online</p>
                </div>
              </div>
              <button
                id="btn-close-ai"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#FDFBF7]/30 rounded-full border border-transparent hover:border-[#2B2D31] transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 grid-bg">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2.5 rounded-2xl border text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#82D1C1] text-[#2B2D31] border-[#2B2D31] rounded-tr-none shadow-[2px_2px_0px_0px_#2B2D31]'
                        : 'bg-white text-[#2B2D31] border-[#2B2D31] rounded-tl-none shadow-[2px_2px_0px_0px_#FFB3C1]'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  
                  {/* Recommended Product Card Inside Chat */}
                  {msg.recommendedProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 w-[240px] bg-white border-2 border-[#2B2D31] rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#82D1C1] hover:scale-[1.02] transition-transform duration-200"
                    >
                      <div className="aspect-[3/4] relative bg-[#FDFBF7] border-b border-[#2B2D31]">
                        <img
                          src={msg.recommendedProduct.imageUrl}
                          alt={msg.recommendedProduct.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-[#FFB3C1] text-[#2B2D31] text-[9px] font-bold px-1.5 py-0.5 border border-[#2B2D31] rounded-md">
                          🌸 AI Match
                        </span>
                      </div>
                      <div className="p-2 bg-white">
                        <h4 className="font-display text-xs font-bold truncate text-[#2B2D31]">
                          {msg.recommendedProduct.title}
                        </h4>
                        <p className="text-xs text-[#FF8097] font-bold mt-0.5">
                          ${msg.recommendedProduct.price.toFixed(2)}
                        </p>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          <button
                            id={`btn-ai-view-${msg.recommendedProduct.id}`}
                            onClick={() => {
                              onSelectProduct(msg.recommendedProduct!);
                              setIsOpen(false);
                            }}
                            className="text-[10px] py-1 border border-[#2B2D31] rounded font-bold text-center bg-cream hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-0.5 cursor-pointer"
                          >
                            Details <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                          <button
                            id={`btn-ai-buy-${msg.recommendedProduct.id}`}
                            onClick={() => {
                              onAddToCart(msg.recommendedProduct!, 1);
                            }}
                            className="text-[10px] py-1 border border-[#2B2D31] rounded font-bold text-center bg-[#82D1C1] hover:bg-[#59C1AF] active:scale-95 transition-all text-[#2B2D31] flex items-center justify-center gap-0.5 cursor-pointer"
                          >
                            Add <ShoppingBag className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <span className="text-[9px] text-[#2B2D31]/40 mt-1 px-1 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-white text-[#2B2D31] border border-[#2B2D31] rounded-2xl rounded-tl-none px-3 py-2.5 shadow-[2px_2px_0px_0px_#FFB3C1] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-pink animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 rounded-full bg-pink animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 rounded-full bg-pink animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 3 && (
              <div className="px-3 py-2 border-t border-[#2B2D31]/80 bg-[#FDFBF7] flex flex-wrap gap-1.5 justify-center">
                {quickPrompts.map((q, idx) => (
                  <button
                    id={`btn-prompt-${idx}`}
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    className="text-[10px] px-2 py-1 bg-white hover:bg-[#FFB3C1] border border-[#2B2D31] rounded-full font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              id="ai-chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-2 bg-white border-t-2 border-[#2B2D31] flex gap-1.5 items-center"
            >
              <input
                id="input-ai-text"
                type="text"
                placeholder="Ask about cozy colors or characters..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-cream border border-[#2B2D31] rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#82D1C1] font-medium"
              />
              <button
                id="btn-ai-submit"
                type="submit"
                disabled={!inputValue.trim()}
                className="p-1.5 bg-[#82D1C1] disabled:bg-cream border border-[#2B2D31] text-[#2B2D31] disabled:text-[#2B2D31]/40 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
