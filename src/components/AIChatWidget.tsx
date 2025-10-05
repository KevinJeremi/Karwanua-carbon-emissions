"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAI } from "@/contexts/AIContext";
import { useAppData } from "@/contexts/AppDataContext";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function AIChatWidget() {
    const { aiModel } = useAI();
    const { getFullContext } = useAppData();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! Ask me about CO₂ trends, NDVI data, or climate insights! 🌍" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setError("");

        // Add user message
        const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Get full app context for AI
            const appContext = getFullContext();

            // Call AI API with context
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.slice(-10), // Keep last 10 messages for context
                    temperature: 0.7,
                    maxTokens: 800,
                    systemContext: appContext, // Pass app data to AI
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get AI response");
            }

            const data = await response.json();

            setMessages([...newMessages, {
                role: "assistant",
                content: data.response || "I apologize, but I couldn't generate a response."
            }]);
        } catch (err: any) {
            console.error("Chat error:", err);
            setError(err.message || "Failed to send message");
            setMessages([...newMessages, {
                role: "assistant",
                content: "❌ Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleQuickQuestion = async (question: string) => {
        setInput(question);
        // Trigger send after setting input
        setTimeout(() => sendMessage(), 100);
    };

    return (
        <>
            {/* Chat Bubble Button */}
            <motion.button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform bg-gradient-to-br from-emerald-500 to-green-600 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Open AI Chat"
            >
                <div className="relative">
                    <Sparkles className="w-7 h-7" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🧠</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">AI Assistant</h3>
                                    <p className="text-white/70 text-xs">
                                        Groq Llama 3.1 8B
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.role === "user"
                                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                            : "bg-white text-gray-800 shadow-sm border border-gray-200"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                                            <span className="text-sm text-gray-600">AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="flex justify-center">
                                    <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-xs text-red-600">{error}</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 1 && !isLoading && (
                            <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleQuickQuestion("What's the current CO₂ level in my area?")}
                                        className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-xs hover:bg-gray-50 border border-gray-200"
                                    >
                                        💨 CO₂ in my area
                                    </button>
                                    <button
                                        onClick={() => handleQuickQuestion("Explain NDVI and why it matters")}
                                        className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-xs hover:bg-gray-50 border border-gray-200"
                                    >
                                        🌳 What is NDVI?
                                    </button>
                                    <button
                                        onClick={() => handleQuickQuestion("What climate actions can I take?")}
                                        className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-xs hover:bg-gray-50 border border-gray-200"
                                    >
                                        💡 Climate actions
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about CO₂ trends, NDVI, climate..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                AI may produce inaccurate information
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
