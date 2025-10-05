"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertCircle, Leaf, TrendingUp, Brain, Loader2, Sparkles } from "lucide-react";
import { useAirQuality } from "@/hooks/useAirQuality";
import { useNDVI } from "@/hooks/useNDVI";
import { useAI } from "@/contexts/AIContext";
import { useAppData } from "@/contexts/AppDataContext";

interface LocationCardProps {
    location: { lat: number; lng: number; city: string } | null;
    carbonData?: {
        co2: number;
        status: "optimal" | "warning" | "critical";
        treesNeeded: number;
    };
    selectedDate?: string; // YYYY-MM-DD format
}

interface AIOffsetSolution {
    treesNeeded: number;
    treeSpecies: string;
    absorptionRate: number;
    recommendations: string[];
    confidence: number;
}

export function LocationCard({ location, carbonData, selectedDate }: LocationCardProps) {
    const [showSolution, setShowSolution] = useState(false);
    const [aiSolution, setAiSolution] = useState<AIOffsetSolution | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { aiModel } = useAI();
    const { setLocationData, setMapData } = useAppData();

    // Fetch real-time air quality data from Open-Meteo API
    const { data: airQualityData, assessment, isLoading } = useAirQuality({
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        locationName: location?.city || 'Your Location',
        autoFetch: !!location,
        date: selectedDate,
    });

    // Fetch NDVI data from NASA MODIS
    const { data: ndviData, isLoading: ndviLoading } = useNDVI({
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        locationName: location?.city || 'Your Location',
        autoFetch: !!location,
        date: selectedDate,
    });

    // Open-Meteo API returns CO₂ directly in ppm (confirmed from API response)
    const co2Ppm = airQualityData?.data?.current.carbon_dioxide || 415; // Default fallback

    // Calculate carbon offset (trees needed)
    // Formula: CO₂ excess × area × conversion factor
    const globalAverage = 415;
    const co2Excess = Math.max(0, co2Ppm - globalAverage);
    const treesNeeded = Math.max(1, Math.round(co2Excess * 0.5)); // Simplified calculation

    // Determine status based on CO₂ level
    let carbonStatus: "optimal" | "warning" | "critical";
    if (co2Ppm < 410) carbonStatus = "optimal";
    else if (co2Ppm < 420) carbonStatus = "warning";
    else carbonStatus = "critical";

    // Use carbonData if provided, otherwise use real-time data
    const data = carbonData || {
        co2: co2Ppm,
        status: carbonStatus,
        treesNeeded: treesNeeded,
    };

    // Calculate if CO2 is above global average (415 ppm as of 2024)
    // CO₂ is already in ppm from Open-Meteo API
    const currentCO2ppm = airQualityData?.data?.current.carbon_dioxide || co2Ppm;
    const aboveAverage = currentCO2ppm > globalAverage;
    const difference = Math.abs(currentCO2ppm - globalAverage);

    // Update AppDataContext whenever location or air quality data changes
    useEffect(() => {
        if (location) {
            setLocationData({
                lat: location.lat,
                lng: location.lng,
                city: location.city,
            });
        }
    }, [location?.lat, location?.lng, location?.city, setLocationData]);

    useEffect(() => {
        if (location && airQualityData && ndviData) {
            setMapData({
                co2: currentCO2ppm,
                ndvi: ndviData.currentNDVI,
                airQuality: assessment?.status || 'Unknown',
                selectedDate: selectedDate || new Date().toISOString().split('T')[0],
            });
        }
    }, [location?.lat, location?.lng, airQualityData?.data?.current.carbon_dioxide, ndviData?.currentNDVI, assessment?.status, selectedDate, setMapData]);

    const statusConfig = {
        optimal: {
            color: "emerald",
            bgColor: "from-emerald-500/20 to-green-500/20",
            icon: "✅",
            text: "Optimal",
        },
        warning: {
            color: "orange",
            bgColor: "from-orange-500/20 to-yellow-500/20",
            icon: "⚠️",
            text: "Warning",
        },
        critical: {
            color: "red",
            bgColor: "from-red-500/20 to-pink-500/20",
            icon: "🚨",
            text: "Critical",
        },
    };

    const statusDisplay = statusConfig[data.status];

    // AI Offset Analysis Function
    const analyzeWithAI = async () => {
        if (!location) return;

        if (isAnalyzing || aiSolution) {
            setShowSolution(true);
            return;
        }

        setIsAnalyzing(true);
        setShowSolution(true);

        try {
            const response = await fetch('/api/ai/offset-solution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    co2Level: currentCO2ppm,
                    location: location.city,
                    ndvi: ndviData?.currentNDVI || 0.5,
                    airQuality: assessment?.status || 'Unknown',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAiSolution(data.solution);
            } else {
                // Fallback solution
                setAiSolution({
                    treesNeeded: Math.max(1, Math.ceil(currentCO2ppm / 22)),
                    treeSpecies: "Mangrove",
                    absorptionRate: 22,
                    recommendations: [
                        "Plant mangrove trees in coastal areas",
                        "Support local reforestation programs",
                        "Reduce personal carbon footprint",
                    ],
                    confidence: 85,
                });
            }
        } catch (error) {
            console.error('AI analysis error:', error);
            setAiSolution({
                treesNeeded: Math.max(1, Math.ceil(currentCO2ppm / 22)),
                treeSpecies: "Mangrove",
                absorptionRate: 22,
                recommendations: [
                    "Plant mangrove trees in coastal areas",
                    "Support local reforestation programs",
                    "Reduce personal carbon footprint",
                ],
                confidence: 85,
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!location) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
            >
                <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-greenish-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/70 text-sm">Detecting your location...</p>
                    <p className="text-white/50 text-xs mt-2">Please allow GPS access</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-greenish-dark to-greenish-mid rounded-2xl p-6 border border-white/20 shadow-2xl text-white overflow-hidden relative"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-emerald-300" />
                    <h3 className="text-lg font-bold">📍 Lokasi Anda</h3>
                </div>

                {/* Location Info */}
                <div className="mb-6">
                    <p className="text-2xl font-bold mb-1">{location.city}</p>
                    <p className="text-white/60 text-sm">
                        {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
                    </p>
                </div>

                {/* Air Quality Status */}
                <div className={`bg-gradient-to-r ${assessment ? `from-${assessment.color}-500/20 to-${assessment.color}-600/10` : 'from-blue-500/20 to-blue-600/10'} rounded-xl p-4 mb-4 border border-white/10 relative`}>
                    {/* Loading overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-semibold">Updating data...</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🌫️</span>
                            <span className="text-sm text-white/70">Air Quality</span>
                        </div>
                        <span className={`px-3 py-1 ${assessment ? `bg-${assessment.color}-500/30` : 'bg-blue-500/30'} rounded-full text-xs font-semibold`}>
                            {assessment?.status || 'Loading...'}
                        </span>
                    </div>

                    {/* Air Quality Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-white/60 mb-1">CO₂</p>
                            <p className="text-lg font-bold">
                                {currentCO2ppm.toFixed(1)} ppm
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-white/60 mb-1">PM2.5</p>
                            <p className="text-lg font-bold">
                                {airQualityData?.data?.current.pm2_5?.toFixed(1) || '0.0'} μg/m³
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-white/60 mb-1">PM10</p>
                            <p className="text-lg font-bold">
                                {airQualityData?.data?.current.pm10?.toFixed(1) || '0.0'} μg/m³
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-white/60 mb-1">CO</p>
                            <p className="text-lg font-bold">
                                {airQualityData?.data?.current.carbon_monoxide ? Math.round(airQualityData.data.current.carbon_monoxide) : 0} μg/m³
                            </p>
                        </div>
                    </div>
                </div>

                {/* NDVI (Vegetation Health) Card */}
                {ndviData && (
                    <div
                        className="rounded-xl p-4 mb-4 border border-white/10 relative"
                        style={{ background: `linear-gradient(to right, ${ndviData.colorCode}20, ${ndviData.colorCode}10)` }}
                    >
                        {/* Loading overlay */}
                        {ndviLoading && (
                            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                                <div className="flex items-center gap-2 text-white">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-semibold">Updating NDVI...</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🌳</span>
                                <span className="text-sm text-white/70">Vegetation Health (NDVI)</span>
                            </div>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: `${ndviData.colorCode}30` }}
                            >
                                {ndviData.vegetationHealth}
                            </span>
                        </div>

                        <div className="mb-2">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold">{ndviData.currentNDVI.toFixed(3)}</span>
                                <span className="text-sm text-white/60">NDVI Index</span>
                            </div>
                            <p className="text-sm text-white/70">{ndviData.ndviStatus}</p>
                        </div>

                        {/* NDVI Trend Mini Chart */}
                        {ndviData.trend && ndviData.trend.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="flex items-center gap-1 mb-2">
                                    <TrendingUp className="w-3 h-3 text-white/60" />
                                    <span className="text-xs text-white/60">8-Day Trend</span>
                                </div>
                                <div className="flex items-end justify-between gap-1 h-12">
                                    {ndviData.trend.slice(-7).map((point, idx) => {
                                        const height = (point.ndvi / 1) * 100; // NDVI max = 1
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full rounded-t transition-all hover:opacity-80"
                                                    style={{
                                                        height: `${height}%`,
                                                        backgroundColor: ndviData.colorCode,
                                                        minHeight: '4px'
                                                    }}
                                                    title={`${point.date}: ${point.ndvi.toFixed(3)}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-white/40 mt-2">
                            🛰️ {ndviData.source}
                        </p>
                    </div>
                )}

                {/* CO2 Comparison with Global Average */}
                <div className={`bg-gradient-to-r ${statusDisplay.bgColor} rounded-xl p-4 mb-4 border border-white/10`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{statusDisplay.icon}</span>
                            <span className="text-sm text-white/70">CO₂ vs Global Avg</span>
                        </div>
                        <span className={`px-3 py-1 bg-${statusDisplay.color}-500/30 rounded-full text-xs font-semibold`}>
                            {statusDisplay.text}
                        </span>
                    </div>
                    <p className="text-3xl font-bold mb-1">
                        {currentCO2ppm.toFixed(1)} ppm
                    </p>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                            {aboveAverage
                                ? `${difference.toFixed(1)} ppm di atas rata-rata global`
                                : `${difference.toFixed(1)} ppm di bawah rata-rata global`}
                        </span>
                    </div>
                </div>

                {/* Carbon Offset CTA */}
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl p-5 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-purple-300" />
                        <span className="text-sm font-semibold text-purple-200">AI-Powered Carbon Offset</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Need a Carbon Solution?
                    </h3>
                    <p className="text-sm text-white/70 mb-4">
                        Get AI-powered recommendations to offset your carbon footprint with precise tree planting solutions.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-purple-300">
                        <Sparkles className="w-3 h-3" />
                        <span>Powered by {aiModel === "groq-llama" ? "Groq Llama 3.1" : aiModel}</span>
                    </div>
                </div>

                {/* Action Button - AI Solution */}
                <div className="mt-6">
                    <button
                        onClick={analyzeWithAI}
                        disabled={isAnalyzing}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 hover:from-purple-500/40 hover:to-indigo-500/40 border border-purple-400/50 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing with AI...
                            </>
                        ) : aiSolution ? (
                            <>
                                <Sparkles className="w-4 h-4" />
                                View AI Solution
                            </>
                        ) : (
                            <>
                                <Brain className="w-4 h-4" />
                                Get AI Carbon Offset Solution
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* AI Solution Modal */}
            <AnimatePresence>
                {showSolution && aiSolution && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setShowSolution(false)}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl my-auto max-h-[95vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                                            AI Carbon Offset Solution
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate">
                                            Powered by Groq API
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowSolution(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 w-8 h-8 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Location & CO2 Info */}
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 sm:p-4 mb-4 border border-emerald-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-gray-700">{location?.city}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                        {currentCO2ppm.toFixed(1)}
                                    </span>
                                    <span className="text-sm text-gray-600">ppm CO₂</span>
                                </div>
                            </div>

                            {/* AI Analysis Result */}
                            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 sm:p-5 mb-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-white" />
                                    <span className="text-sm font-semibold text-white">Offset yang Dibutuhkan</span>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-4xl sm:text-5xl">🌳</span>
                                    <div>
                                        <span className="text-4xl sm:text-5xl font-bold text-white">
                                            {aiSolution.treesNeeded}
                                        </span>
                                        <p className="text-sm text-emerald-100 mt-1">
                                            pohon {aiSolution.treeSpecies.toLowerCase()}/tahun
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white/20 rounded-lg p-2 mt-3 backdrop-blur-sm">
                                    <p className="text-xs text-white">
                                        💧 Daya serap: <span className="font-semibold">{aiSolution.absorptionRate} kg CO₂/pohon/tahun</span>
                                    </p>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="mb-4 sm:mb-5">
                                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="text-lg">💡</span>
                                    Rekomendasi AI
                                </h4>
                                <div className="space-y-2">
                                    {aiSolution.recommendations.map((rec, idx) => (
                                        <div key={idx} className="flex items-start gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 transition-colors">
                                            <span className="text-emerald-600 font-bold text-sm flex-shrink-0">{idx + 1}.</span>
                                            <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Confidence Score */}
                            <div className="mb-4 sm:mb-5 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600">AI Confidence Level</span>
                                    <span className="text-sm font-bold text-emerald-600">{aiSolution.confidence}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                                        style={{ width: `${aiSolution.confidence}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => setShowSolution(false)}
                                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </motion.div>
    );
}
