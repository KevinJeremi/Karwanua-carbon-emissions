"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface NDVILegendProps {
    isVisible?: boolean;
}

export function NDVILegend({ isVisible = true }: NDVILegendProps) {
    if (!isVisible) return null;

    const legendItems = [
        {
            color: '#006400', // Dark Green
            label: 'Dense Vegetation',
            range: '0.6 - 1.0',
            description: 'Healthy forests, crops'
        },
        {
            color: '#228B22', // Forest Green
            label: 'Moderate Vegetation',
            range: '0.4 - 0.6',
            description: 'Grasslands, moderate growth'
        },
        {
            color: '#ADFF2F', // Green Yellow
            label: 'Sparse Vegetation',
            range: '0.2 - 0.4',
            description: 'Shrubs, dry grass'
        },
        {
            color: '#FFD700', // Gold
            label: 'Urban / Light Vegetation',
            range: '0.1 - 0.3',
            description: '🏙️ Cities (Jakarta, Surabaya)'
        },
        {
            color: '#CD853F', // Peru/Brown
            label: 'Bare Soil',
            range: '0.0 - 0.1',
            description: 'Exposed soil, rocks'
        },
        {
            color: '#0000CD', // Medium Blue
            label: 'Water',
            range: '< 0.0',
            description: 'Rivers, lakes, ocean'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 max-w-xs border border-gray-200"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🌳</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">NDVI Color Scale</h3>
                    <p className="text-xs text-gray-500">Vegetation Index</p>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
            </div>

            {/* Legend Items */}
            <div className="space-y-2">
                {legendItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 group hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                    >
                        {/* Color Box */}
                        <div
                            className="w-6 h-6 rounded border border-gray-300 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                        />

                        {/* Label & Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-semibold text-gray-700 truncate">
                                    {item.label}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">
                                    {item.range}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-start gap-2">
                    <span className="text-xs">💡</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>NDVI</strong> (Normalized Difference Vegetation Index) measures plant health.
                        Higher values indicate denser, healthier vegetation.
                    </p>
                </div>
            </div>

            {/* Source */}
            <div className="mt-2 text-center">
                <p className="text-[10px] text-gray-400">
                    🛰️ NASA GIBS / MODIS Terra 8-Day
                </p>
            </div>
        </motion.div>
    );
}
