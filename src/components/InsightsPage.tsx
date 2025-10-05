"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, Download, Zap, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { MiniNavbar } from "./ui/mini-navbar";
import { useAI } from "@/contexts/AIContext";
import { AIChatWidget } from "./AIChatWidget";

interface InsightsPageProps {
    onPageChange: (page: string) => void;
    currentPage: string;
}

interface ClimateInsight {
    id?: number;
    title: string;
    summary: string;
    severity: "critical" | "warning" | "positive" | "info";
    date?: string;
    tags: string[];
    confidence: number;
}

export function InsightsPage({ onPageChange, currentPage }: InsightsPageProps) {
    const { aiModel, setAIModel } = useAI();
    const [insightsData, setInsightsData] = useState<ClimateInsight[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);
    const [error, setError] = useState<string>("");

    // Debug: Log AI status
    useEffect(() => {
        console.log('🧠 InsightsPage - AI is always active');
        console.log('🤖 InsightsPage - AI Model:', aiModel);
        console.log('📊 InsightsPage - Insights count:', insightsData.length);
    }, [aiModel, insightsData]);

    // Fetch user location dan climate data on mount
    useEffect(() => {
        console.log('🚀 Fetching AI insights...');
        fetchAIInsights();
    }, []);

    const fetchAIInsights = async () => {
        setIsLoadingInsights(true);
        setError("");

        try {
            // Get user location
            let location = "Global";
            let co2Level = 420; // Default
            let ndvi = 0.65;
            let temperature = 28;

            if (navigator.geolocation) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    location = `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`;
                } catch (geoError) {
                    console.log("Geolocation not available, using global data");
                }
            }

            // Call AI Insights API
            const response = await fetch("/api/ai/insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    co2Level,
                    ndvi,
                    temperature,
                    location,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate AI insights");
            }

            const data = await response.json();

            // Add metadata to insights
            const enrichedInsights = data.insights.map((insight: ClimateInsight, index: number) => ({
                ...insight,
                id: index + 1,
                date: getRelativeTime(index),
            }));

            setInsightsData(enrichedInsights);

            // Generate recommendations based on insights
            fetchRecommendations(enrichedInsights);
        } catch (err: any) {
            console.error("Failed to fetch AI insights:", err);
            setError(err.message || "Failed to generate insights");
            // Clear data on error
            setInsightsData([]);
            setRecommendations([]);
        } finally {
            setIsLoadingInsights(false);
        }
    };

    const fetchRecommendations = async (insights: ClimateInsight[]) => {
        setIsLoadingRecs(true);

        try {
            const response = await fetch("/api/ai/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ insights }),
            });

            if (response.ok) {
                const data = await response.json();
                setRecommendations(data.recommendations || []);
            } else {
                setRecommendations([]);
            }
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
            setRecommendations([]);
        } finally {
            setIsLoadingRecs(false);
        }
    };

    const getRelativeTime = (index: number) => {
        const times = ["2 hours ago", "3 hours ago", "5 hours ago", "1 day ago", "1 day ago", "2 days ago"];
        return times[index] || "Recently";
    };

    // Get model display name
    const getModelDisplayName = (modelId: string) => {
        const modelMap: { [key: string]: string } = {
            "llama-3.1-8b-instant": "Llama 3.1 8B Instant",
            "llama-3.3-70b-versatile": "Llama 3.3 70B Versatile",
            "mixtral-8x7b-32768": "Mixtral 8x7B",
            "gemma2-9b-it": "Gemma 2 9B",
            "llama3-70b-8192": "Llama 3 70B",
        };
        return modelMap[modelId] || modelId;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-greenish-dark to-greenish-mid pt-20">
            <MiniNavbar currentPage={currentPage} onPageChange={onPageChange} />

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Header Section */}
                <section className="relative bg-gradient-to-br from-greenish-dark to-greenish-mid text-white rounded-3xl overflow-hidden shadow-2xl pb-32 mb-8">
                    <div className="px-8 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-2 h-2 bg-greenish-light rounded-full animate-pulse"></div>
                                    <span className="text-greenish-light/80 text-sm uppercase tracking-wider">AI-Powered Analysis</span>
                                    <span className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                        🧠 Confidence 89%
                                    </span>
                                </div>
                                <h1 className="text-5xl font-bold mb-2">AI Insights</h1>
                                <p className="text-lg text-white/80 mb-6">
                                    Climate Intelligence Analysis
                                </p>

                                {/* AI Model Selector - Top 5 Best & Cheapest Groq Models */}
                                <div className="mb-8">
                                    <label className="text-sm text-white/70 mb-2 block">Select Groq AI Model (Top 5 Best & Free)</label>
                                    <div className="flex flex-wrap gap-3">
                                        <select
                                            value={aiModel}
                                            onChange={(e) => setAIModel(e.target.value)}
                                            className="px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-white/15 transition-all cursor-pointer min-w-[320px] [&>option]:text-gray-900 [&>option]:bg-white"
                                        >
                                            <option value="llama-3.1-8b-instant">🚀 Llama 3.1 8B Instant (Fastest & Free - Recommended)</option>
                                            <option value="llama-3.3-70b-versatile">🔥 Llama 3.3 70B Versatile (Most Capable)</option>
                                            <option value="mixtral-8x7b-32768">⚡ Mixtral 8x7B (32K Context - Balanced)</option>
                                            <option value="gemma2-9b-it">✨ Gemma 2 9B (Fast & Efficient)</option>
                                            <option value="llama3-70b-8192">🧠 Llama 3 70B (Powerful Reasoning)</option>
                                        </select>

                                        <button
                                            onClick={() => {
                                                // Click global AI chat widget
                                                const chatButton = document.querySelector('[title="Open AI Chat"]') as HTMLElement;
                                                if (chatButton) {
                                                    chatButton.click();
                                                }
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 border border-white/30 rounded-lg text-white text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            <MessageSquare size={16} />
                                            Ask AI
                                        </button>
                                    </div>

                                    {/* Model Info */}
                                    <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <p className="text-xs text-emerald-200">
                                            ✨ <strong>Current Model:</strong> {getModelDisplayName(aiModel)}
                                        </p>
                                        {aiModel === "llama-3.1-8b-instant" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                🚀 Fastest inference - Perfect for real-time analysis - 100% Free
                                            </p>
                                        )}
                                        {aiModel === "llama-3.3-70b-versatile" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                🔥 Most capable model - Advanced reasoning - 100% Free
                                            </p>
                                        )}
                                        {aiModel === "mixtral-8x7b-32768" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                ⚡ 32K context window - Great for complex queries - 100% Free
                                            </p>
                                        )}
                                        {aiModel === "gemma2-9b-it" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                ✨ Google's efficient model - Fast & accurate - 100% Free
                                            </p>
                                        )}
                                        {aiModel === "llama3-70b-8192" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                🧠 Meta's powerful model - Excellent for reasoning - 100% Free
                                            </p>
                                        )}
                                        {aiModel === "moonshotai/kimi-k2-instruct" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                🌙 262K context window - Excellent for long documents
                                            </p>
                                        )}
                                        {aiModel === "qwen/qwen3-32b" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                🇨🇳 Multilingual support - Strong reasoning capabilities
                                            </p>
                                        )}
                                        {aiModel === "gemma2-9b-it" && (
                                            <p className="text-xs text-white/60 mt-1">
                                                ✨ Google Gemma 2 - Efficient and fast - 14,400 free requests/day
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">🤖</span>
                                                <p className="text-white/70 text-sm font-medium">AI Model</p>
                                            </div>
                                            <p className="text-2xl font-bold text-white">
                                                {getModelDisplayName(aiModel)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">📊</span>
                                                <p className="text-white/70 text-sm font-medium">Insights Generated</p>
                                            </div>
                                            <p className="text-3xl font-bold text-white">{insightsData.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex-shrink-0">
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-emerald-300/30"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.3, 0.7, 0.3],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    style={{ width: "280px", height: "280px", left: "-40px", top: "-40px" }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-white/40"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 12,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    style={{ width: "260px", height: "260px", left: "-30px", top: "-30px" }}
                                >
                                    <div className="w-3 h-3 bg-emerald-300 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-r from-greenish-light/30 to-white/30 rounded-full blur-2xl scale-125"></div>
                                <div className="relative z-10 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                                    <Brain className="text-white" size={120} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Insights Cards */}
                {isLoadingInsights ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-24 relative z-10 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                                <div className="flex items-center justify-center h-64">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                        <p className="text-sm text-gray-500">Generating AI insights...</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="grid grid-cols-1 gap-6 -mt-24 relative z-10 mb-8">
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                                <h3 className="text-lg font-semibold text-red-800">Failed to Generate AI Insights</h3>
                            </div>
                            <p className="text-sm text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchAIInsights}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : insightsData.length === 0 ? (
                    <div className="grid grid-cols-1 gap-6 -mt-24 relative z-10 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 shadow-lg text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700">No Insights Available</h3>
                                <p className="text-gray-500 max-w-md">
                                    AI is enabled but no insights have been generated yet. Click retry to generate insights.
                                </p>
                                <button
                                    onClick={fetchAIInsights}
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
                                >
                                    <Zap size={20} />
                                    Generate AI Insights
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-24 relative z-10 mb-8">
                        {insightsData.map((insight, index) => (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-10 h-10 ${insight.severity === 'critical' ? 'bg-red-100' :
                                        insight.severity === 'warning' ? 'bg-orange-100' :
                                            'bg-green-100'
                                        } rounded-xl flex items-center justify-center`}>
                                        {insight.severity === 'critical' ? (
                                            <AlertTriangle className="text-red-600" size={20} />
                                        ) : insight.severity === 'warning' ? (
                                            <TrendingUp className="text-orange-600" size={20} />
                                        ) : (
                                            <Sparkles className="text-green-600" size={20} />
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">{insight.date}</span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{insight.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{insight.summary}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {insight.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Confidence Bar */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-500">AI Confidence</span>
                                        <span className="text-xs font-semibold text-gray-700">{insight.confidence}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                            style={{ width: `${insight.confidence}%` }}
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                    View Details
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white rounded-2xl p-8 shadow-lg mb-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <Lightbulb className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Recommended Actions</h2>
                                <p className="text-sm text-gray-600">AI-generated climate mitigation strategies</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendations.map((rec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{rec.title}</h3>
                                        <p className="text-sm text-gray-600">{rec.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Export Report Button */}
                {insightsData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="flex justify-center"
                    >
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all">
                            <Download size={20} />
                            Generate AI Report (PDF)
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Global AI Chat Widget - Always available in bottom right corner */}
            <AIChatWidget />
        </div>
    );
}
