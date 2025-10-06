"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Globe, LineChart, BarChart3, Brain, RefreshCw, Loader2 } from "lucide-react";
import { MiniNavbar } from "./ui/mini-navbar";
import { useAI } from "@/contexts/AIContext";
import { useAppData } from "@/contexts/AppDataContext";

interface AnalyticsPageProps {
    currentPage?: string;
    onPageChange?: (page: string) => void;
}

// API Response Types
interface RegionalData {
    region: string;
    co2: string;
    co2Value: number;
    emission: string;
    emissionValue: number;
    ndvi: string;
    ndviValue: number;
    status: 'Optimal' | 'Warning' | 'Critical';
    statusColor: 'green' | 'orange' | 'red';
    updated: string;
    temperature?: number;
    temperatureAnomaly?: number;
}

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'notice';
    category: string;
    title: string;
    description: string;
    icon: string;
}

interface EmissionTrend {
    date: string;
    co2: number;
    emission: number;
}

export function AnalyticsPage({ currentPage, onPageChange }: AnalyticsPageProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("All Regions");
    const [isLoading, setIsLoading] = useState(true);

    // AI Analysis State
    const [aiSummary, setAiSummary] = useState<string>("");
    const [aiConfidence, setAiConfidence] = useState<number>(87);
    const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const { aiModel } = useAI();
    const { setAnalyticsData } = useAppData();

    // State for API data
    const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [emissionTrends, setEmissionTrends] = useState<EmissionTrend[]>([]);
    const [metrics, setMetrics] = useState({
        co2Average: 418,
        emissionChange: 12,
        ndviIndex: 0.68,
        tempAnomaly: 1.2,
    });

    // Fetch all data
    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch Regional Emissions
            const regionalRes = await fetch('/api/regional-emissions');
            const regionalJson = await regionalRes.json();
            if (regionalJson.success) {
                setRegionalData(regionalJson.regions);
                setMetrics(prev => ({
                    ...prev,
                    co2Average: regionalJson.globalAverage.co2,
                    ndviIndex: regionalJson.globalAverage.ndvi,
                    emissionChange: regionalJson.globalAverage.emission,
                }));
            }

            // Fetch AI-generated Alerts (using real data analysis)
            const alertsRes = await fetch('/api/ai/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analyticsData: {
                        co2Average: regionalJson.globalAverage?.co2,
                        emissionChange: regionalJson.globalAverage?.emission,
                        ndviIndex: regionalJson.globalAverage?.ndvi,
                    }
                })
            });
            const alertsJson = await alertsRes.json();
            if (alertsJson.success && alertsJson.alerts) {
                setAlerts(alertsJson.alerts.slice(0, 3));
            }

            // Fetch Emission Trends
            const trendsRes = await fetch('/api/emission-trends?region=All Regions&startYear=2015');
            const trendsJson = await trendsRes.json();
            if (trendsJson.success) {
                setEmissionTrends(trendsJson.trend);
            }

            // Fetch Temperature Anomaly
            const tempRes = await fetch('/api/temperature-anomaly?region=Global');
            const tempJson = await tempRes.json();
            if (tempJson.success) {
                setMetrics(prev => ({
                    ...prev,
                    tempAnomaly: tempJson.currentAnomaly,
                }));
            }

        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // AI Analysis Function
    const analyzeWithAI = async () => {
        if (isAnalyzingAI) return;

        setIsAnalyzingAI(true);
        try {
            const response = await fetch('/api/ai/analytics-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metrics,
                    regionalData: regionalData.slice(0, 3),
                    alerts: alerts.slice(0, 2),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAiSummary(data.summary || "Analysis complete.");
                setAiConfidence(data.confidence || 87);
                setHasAnalyzed(true);

                // Update AppDataContext
                setAnalyticsData({
                    ...metrics,
                    aiSummary: data.summary,
                    aiConfidence: data.confidence,
                    lastUpdated: new Date().toISOString(),
                });
            } else {
                setAiSummary("CO₂ levels increased globally. NDVI indicates moderate vegetation health. Temperature anomaly detected. Immediate action recommended for emission reduction and reforestation programs.");
                setHasAnalyzed(true);
            }
        } catch (error) {
            console.error('AI Analysis error:', error);
            setAiSummary("CO₂ levels increased globally. NDVI indicates moderate vegetation health. Temperature anomaly detected. Immediate action recommended for emission reduction and reforestation programs.");
            setHasAnalyzed(true);
        } finally {
            setIsAnalyzingAI(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-analyze when data is loaded
    useEffect(() => {
        if (!isLoading && !hasAnalyzed && metrics.co2Average > 0) {
            // Auto analyze once when data is ready
            analyzeWithAI();
        }
    }, [isLoading, hasAnalyzed, metrics.co2Average]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData().finally(() => {
            setTimeout(() => setIsRefreshing(false), 1000);
        });
    };

    // Calculate chart data for CO₂ trend (last 9 data points)
    const chartData = emissionTrends.slice(-9).map(item => ({
        height: Math.min(95, Math.max(65, ((item.co2 - 395) / 30) * 100)),
        value: item.co2,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-greenish-dark to-greenish-mid">
            <MiniNavbar currentPage={currentPage} onPageChange={onPageChange} />

            {/* Header Section */}
            <section
                className="w-full relative text-white pt-24 pb-12"
                style={{
                    backgroundImage: 'url(/image/bg_Earth_Monitoring.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-greenish-dark/85 via-greenish-dark/75 to-greenish-mid/85"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-greenish-light rounded-full animate-pulse"></div>
                                <span className="text-greenish-light/80 text-sm uppercase tracking-wider">Earth Monitoring — Overview</span>
                            </div>
                            <h1 className="text-5xl font-bold mb-3">Dashboard Analytics</h1>
                            <p className="text-lg text-white/80 mb-6">
                                Real-time satellite data from NASA Earth Observation
                            </p>

                            {/* Quick Filter */}
                            <div className="flex flex-wrap items-center gap-4">
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all disabled:opacity-50"
                                >
                                    <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
                                    Refresh Data
                                </button>
                            </div>
                        </div>

                        {/* Mini Globe Animation */}
                        <div className="relative flex-shrink-0">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-emerald-300/30"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{ width: '200px', height: '200px', left: '-20px', top: '-20px' }}
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-40 h-40 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl"
                            >
                                <Globe className="text-white" size={80} strokeWidth={1.5} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Cards Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-4xl">🌫️</span>
                            <div className="px-2 py-1 bg-emerald-500/30 rounded-lg">
                                <TrendingUp className="text-white" size={16} />
                            </div>
                        </div>
                        <h3 className="text-white/70 text-sm font-medium mb-1">CO₂ Average</h3>
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? '...' : `${metrics.co2Average} ppm`}
                        </p>
                        <p className="text-xs text-emerald-200 mt-2">From NASA NEO</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-4xl">📈</span>
                            <div className="px-2 py-1 bg-red-500/30 rounded-lg">
                                <AlertTriangle className="text-white" size={16} />
                            </div>
                        </div>
                        <h3 className="text-white/70 text-sm font-medium mb-1">Emission Change</h3>
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? '...' : `+${metrics.emissionChange.toFixed(1)}%`}
                        </p>
                        <p className="text-xs text-red-200 mt-2">Since 2019</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-4xl">🌳</span>
                            <div className="px-2 py-1 bg-green-500/30 rounded-lg">
                                <LineChart className="text-white" size={16} />
                            </div>
                        </div>
                        <h3 className="text-white/70 text-sm font-medium mb-1">NDVI Index</h3>
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? '...' : metrics.ndviIndex.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-200 mt-2">From MODIS</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-4xl">🌡️</span>
                            <div className="px-2 py-1 bg-orange-500/30 rounded-lg">
                                <TrendingUp className="text-white" size={16} />
                            </div>
                        </div>
                        <h3 className="text-white/70 text-sm font-medium mb-1">Temp Anomaly</h3>
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? '...' : `+${metrics.tempAnomaly.toFixed(1)}°C`}
                        </p>
                        <p className="text-xs text-orange-200 mt-2">Above baseline</p>
                    </motion.div>
                </div>
            </div>

            {/* Trend & Visualization Section */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* CO₂ Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white text-lg font-semibold">CO₂ Trend</h3>
                            <LineChart className="text-emerald-400" size={20} />
                        </div>
                        <div className="h-48 flex items-end justify-around gap-2">
                            {isLoading ? (
                                <div className="flex items-center justify-center w-full h-full">
                                    <p className="text-white/50 text-sm">Loading...</p>
                                </div>
                            ) : chartData.length > 0 ? (
                                chartData.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.height}%` }}
                                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                        className="flex-1 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg"
                                        title={`${item.value} ppm`}
                                    />
                                ))
                            ) : (
                                [65, 70, 75, 68, 80, 85, 90, 88, 95].map((height, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                        className="flex-1 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg"
                                    />
                                ))
                            )}
                        </div>
                        <p className="text-white/60 text-xs mt-4">2015 - 2024</p>
                    </motion.div>

                    {/* AI-Powered Alerts Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white text-lg font-semibold">AI Alerts</h3>
                                <div className="px-2 py-0.5 bg-purple-500/30 rounded-full flex items-center gap-1">
                                    <Brain className="w-3 h-3 text-purple-300" />
                                    <span className="text-xs text-purple-200">AI</span>
                                </div>
                            </div>
                            <AlertTriangle className="text-red-400" size={20} />
                        </div>
                        <div className="space-y-3">
                            {isLoading ? (
                                <p className="text-white/50 text-sm text-center py-4">Loading alerts...</p>
                            ) : alerts.length > 0 ? (
                                alerts.slice(0, 3).map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg ${alert.type === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
                                            alert.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/20' :
                                                'bg-yellow-500/10 border border-yellow-500/20'
                                            }`}
                                    >
                                        <span className={`text-xl ${alert.type === 'critical' ? 'text-red-400' :
                                            alert.type === 'warning' ? 'text-orange-400' :
                                                'text-yellow-400'
                                            }`}>{alert.icon}</span>
                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {alert.type === 'critical' ? 'Critical' : alert.type === 'warning' ? 'Warning' : 'Notice'}
                                            </p>
                                            <p className="text-white/60 text-xs">{alert.description.split(',')[0]}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white/50 text-sm text-center py-4">No alerts</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Emission by Region */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white text-lg font-semibold">Emission by Region</h3>
                            <BarChart3 className="text-green-400" size={20} />
                        </div>
                        <div className="space-y-3">
                            {isLoading ? (
                                <p className="text-white/50 text-sm text-center py-4">Loading...</p>
                            ) : regionalData.length > 0 ? (
                                regionalData.slice(0, 5).map((region, i) => {
                                    const color = region.emissionValue >= 10 ? 'red' : region.emissionValue >= 7 ? 'orange' : 'green';
                                    return (
                                        <div key={i}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-white/80 text-sm">{region.region}</span>
                                                <span className="text-white/60 text-xs">{region.emissionValue}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, region.emissionValue * 8)}%` }}
                                                    transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                                                    className={`h-2 rounded-full bg-gradient-to-r ${color === 'red' ? 'from-red-500 to-red-600' :
                                                        color === 'orange' ? 'from-orange-500 to-orange-600' :
                                                            'from-green-500 to-green-600'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                [
                                    { name: "Asia", value: 85, color: "red" },
                                    { name: "Europe", value: 65, color: "orange" },
                                    { name: "N. America", value: 75, color: "orange" },
                                    { name: "S. America", value: 50, color: "green" },
                                    { name: "Africa", value: 70, color: "orange" },
                                ].map((region, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-white/80 text-sm">{region.name}</span>
                                            <span className="text-white/60 text-xs">{region.value}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${region.value}%` }}
                                                transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                                                className={`h-2 rounded-full bg-gradient-to-r ${region.color === "red" ? "from-red-500 to-red-600" :
                                                    region.color === "orange" ? "from-orange-500 to-orange-600" :
                                                        "from-green-500 to-green-600"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* AI Insight Summary (Powered by Grok API) */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-md rounded-2xl p-8 border border-emerald-400/30 shadow-2xl"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Brain className={isAnalyzingAI ? "text-white animate-pulse" : "text-white"} size={28} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h2 className="text-2xl font-bold text-white">AI Insight & Summary</h2>
                                <span className="px-3 py-1 bg-emerald-500/30 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                    Powered by {aiModel === "groq-llama" ? "Groq API" : aiModel.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-white/70 text-sm">
                                {isAnalyzingAI ? (
                                    "Analyzing data with AI..."
                                ) : (
                                    `Analyzed with confidence level: ${aiConfidence}%`
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={analyzeWithAI}
                                disabled={isAnalyzingAI || isLoading}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <RefreshCw className={isAnalyzingAI ? "animate-spin" : ""} size={16} />
                                {isAnalyzingAI ? "Analyzing..." : "Refresh AI"}
                            </button>
                            <button
                                onClick={() => onPageChange?.("insights")}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-sm font-medium transition-all"
                            >
                                Explain More →
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-4">
                        {isAnalyzingAI ? (
                            <div className="flex items-center justify-center gap-3 py-4">
                                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                                <p className="text-white/70">AI is analyzing your climate data...</p>
                            </div>
                        ) : (
                            <p className="text-white text-base leading-relaxed">
                                {aiSummary || (
                                    <>
                                        &quot;CO₂ levels increased <span className="font-semibold text-emerald-300">{metrics.emissionChange.toFixed(1)}%</span> globally since 2019.
                                        NDVI average at <span className="font-semibold text-orange-300">{metrics.ndviIndex.toFixed(2)}</span> indicating moderate vegetation health.
                                        Temperature anomaly detected at <span className="font-semibold text-red-300">+{metrics.tempAnomaly.toFixed(1)}°C</span> above baseline.
                                        Immediate action recommended for emission reduction and reforestation programs.&quot;
                                    </>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Confidence Score Bar */}
                    {!isAnalyzingAI && (
                        <div className="mb-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/70 text-sm">AI Confidence Score</span>
                                <span className="text-white font-semibold">{aiConfidence}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${aiConfidence}%` }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Regional Emission Table */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg overflow-hidden"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Regional Emission Data</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Region</th>
                                    <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">CO₂ (ppm)</th>
                                    <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Emission</th>
                                    <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">NDVI</th>
                                    <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-white/50">
                                            Loading regional data...
                                        </td>
                                    </tr>
                                ) : regionalData.length > 0 ? (
                                    regionalData.map((row, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.9 + i * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-white font-medium">{row.region}</td>
                                            <td className="py-4 px-4 text-white/80">{row.co2}</td>
                                            <td className="py-4 px-4">
                                                <span className={`${row.emission.startsWith('+') ? 'text-red-400' : 'text-green-400'} font-semibold`}>
                                                    {row.emission}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-white/80">{row.ndvi}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor === 'green' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                    row.statusColor === 'orange' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                                        'bg-red-500/20 text-red-300 border border-red-500/30'
                                                    }`}>
                                                    {row.status === 'Critical' && '🚨 '}{row.status === 'Warning' && '⚠️ '}{row.status === 'Optimal' && '✅ '}
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-white/60 text-sm">{row.updated}</td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-white/50">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
