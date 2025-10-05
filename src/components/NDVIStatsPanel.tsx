"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Leaf } from 'lucide-react';
import { useNDVI } from '@/hooks/useNDVI';

interface NDVIStatsPanelProps {
    latitude: number;
    longitude: number;
    locationName?: string;
    selectedDate?: string; // YYYY-MM-DD format
}

export function NDVIStatsPanel({ latitude, longitude, locationName, selectedDate }: NDVIStatsPanelProps) {
    const { data: ndviData, isLoading } = useNDVI({
        latitude,
        longitude,
        locationName,
        autoFetch: true,
        date: selectedDate,
    });

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl"
            >
                <div className="animate-pulse">
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-white/10 rounded mb-3"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                </div>
            </motion.div>
        );
    }

    if (!ndviData) {
        return null;
    }

    // Calculate trend (comparing latest with previous value)
    const latestNDVI = ndviData.trend[ndviData.trend.length - 1]?.ndvi || 0;
    const previousNDVI = ndviData.trend[ndviData.trend.length - 2]?.ndvi || 0;
    const trendChange = latestNDVI - previousNDVI;
    const trendPercentage = previousNDVI !== 0 ? (trendChange / previousNDVI) * 100 : 0;

    const getTrendIcon = () => {
        if (trendChange > 0.01) return <TrendingUp className="w-4 h-4 text-green-400" />;
        if (trendChange < -0.01) return <TrendingDown className="w-4 h-4 text-red-400" />;
        return <Minus className="w-4 h-4 text-yellow-400" />;
    };

    const getTrendColor = () => {
        if (trendChange > 0.01) return 'text-green-400';
        if (trendChange < -0.01) return 'text-red-400';
        return 'text-yellow-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-5 border border-green-400/30 shadow-xl relative"
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-white">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-semibold">Updating NDVI...</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-green-300" />
                <h3 className="text-white font-bold">NDVI Statistics</h3>
            </div>

            {/* Main NDVI Value */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-white">
                        {ndviData.currentNDVI.toFixed(3)}
                    </span>
                    <div className="flex items-center gap-1">
                        {getTrendIcon()}
                        <span className={`text-sm font-semibold ${getTrendColor()}`}>
                            {trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <p className="text-white/70 text-sm">{ndviData.ndviStatus}</p>
            </div>

            {/* Health Status Badge */}
            <div
                className="px-4 py-2 rounded-lg mb-4 text-center font-semibold"
                style={{
                    backgroundColor: `${ndviData.colorCode}30`,
                    border: `1px solid ${ndviData.colorCode}60`
                }}
            >
                <span className="text-white text-sm">{ndviData.vegetationHealth} Health</span>
            </div>

            {/* Trend Chart */}
            <div className="bg-white/5 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">8-Day Trend</span>
                    <span className="text-xs text-white/60">NDVI Index</span>
                </div>

                <div className="flex items-end justify-between gap-1 h-20">
                    {ndviData.trend.map((point, idx) => {
                        const height = (point.ndvi / 1) * 100; // Max NDVI = 1
                        const isLatest = idx === ndviData.trend.length - 1;

                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center group">
                                <div
                                    className={`w-full rounded-t transition-all ${isLatest ? 'ring-2 ring-white/50' : ''}`}
                                    style={{
                                        height: `${height}%`,
                                        backgroundColor: ndviData.colorCode,
                                        opacity: isLatest ? 1 : 0.6,
                                        minHeight: '8px'
                                    }}
                                />
                                {/* Tooltip on hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-full -mt-16 bg-black/80 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap">
                                    {point.date.split('-').slice(1).join('/')}: {point.ndvi.toFixed(3)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Date labels */}
                <div className="flex justify-between mt-1 text-[10px] text-white/40">
                    <span>{ndviData.trend[0]?.date.split('-').slice(1).join('/')}</span>
                    <span>Latest</span>
                </div>
            </div>

            {/* Info Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 rounded p-2">
                    <div className="text-white/60 mb-1">Min</div>
                    <div className="text-white font-semibold">
                        {Math.min(...ndviData.trend.map(t => t.ndvi)).toFixed(3)}
                    </div>
                </div>
                <div className="bg-white/5 rounded p-2">
                    <div className="text-white/60 mb-1">Max</div>
                    <div className="text-white font-semibold">
                        {Math.max(...ndviData.trend.map(t => t.ndvi)).toFixed(3)}
                    </div>
                </div>
            </div>

            {/* Source */}
            <p className="text-xs text-white/40 mt-3 text-center">
                🛰️ NASA MODIS Terra/Aqua
            </p>
        </motion.div>
    );
}
