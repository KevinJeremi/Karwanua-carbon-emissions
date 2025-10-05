/**
 * MapSidebar Component
 * Collapsible sidebar with layer controls, date picker, and settings
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Info, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { GIBSLayerType } from '@/types/gibs-layers';

interface MapSidebarProps {
    activeLayer: GIBSLayerType;
    onLayerChange: (layer: GIBSLayerType) => void;
    selectedDate: string;
    onDateChange: (date: string) => void;
    showAirQuality: boolean;
    onToggleAirQuality: (show: boolean) => void;
    ndviOpacity?: number;
    onNDVIOpacityChange?: (opacity: number) => void;
    ndviCellSize?: number;
    onNDVICellSizeChange?: (size: number) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export function MapSidebar({
    activeLayer,
    onLayerChange,
    selectedDate,
    onDateChange,
    showAirQuality,
    onToggleAirQuality,
    ndviOpacity = 0.7,
    onNDVIOpacityChange,
    ndviCellSize = 0.003,
    onNDVICellSizeChange,
    isCollapsed = false,
    onToggleCollapse,
}: MapSidebarProps) {
    const layers = [
        { id: 'truecolor' as GIBSLayerType, name: 'True Color Satellite', icon: '🌍', color: 'blue' },
        { id: 'ndvi' as GIBSLayerType, name: 'Vegetation (NDVI)', icon: '🌳', color: 'green' },
    ];

    if (isCollapsed) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 left-4 z-[1000]"
            >
                <button
                    onClick={onToggleCollapse}
                    className="p-3 bg-white/95 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-all border border-white/20"
                >
                    <Layers className="w-5 h-5 text-greenish-mid" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 z-[1000] w-80 max-h-[calc(100vh-8rem)] overflow-y-auto"
        >
            <div className="bg-gradient-to-br from-greenish-dark to-greenish-mid backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-300" />
                        <h3 className="text-white font-bold">Map Controls</h3>
                    </div>
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className="p-1 hover:bg-white/10 rounded transition-all"
                        >
                            <X className="w-4 h-4 text-white/70 hover:text-white" />
                        </button>
                    )}
                </div>

                {/* Accordion Sections */}
                <Accordion type="multiple" defaultValue={['layers', 'date']} className="space-y-2">
                    {/* Layer Selection */}
                    <AccordionItem value="layers" className="border-white/10">
                        <AccordionTrigger className="text-white hover:bg-white/5">
                            <span className="flex items-center gap-2">
                                <span className="text-xl">🛰️</span>
                                <span>Satellite Layers</span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {layers.map((layer) => (
                                    <label
                                        key={layer.id}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border ${activeLayer === layer.id
                                                ? 'bg-emerald-500/30 border-emerald-400/50'
                                                : 'bg-white/5 hover:bg-white/10 border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="layer"
                                                checked={activeLayer === layer.id}
                                                onChange={() => onLayerChange(layer.id)}
                                                className="w-4 h-4 rounded accent-emerald-500"
                                            />
                                            <span className="text-2xl">{layer.icon}</span>
                                            <span className="text-white text-sm font-medium">{layer.name}</span>
                                        </div>
                                    </label>
                                ))}

                                {/* Air Quality Toggle */}
                                <div className="pt-2 mt-2 border-t border-white/10">
                                    <label className="flex items-center justify-between p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg cursor-pointer transition-all duration-200 border border-blue-400/30">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={showAirQuality}
                                                onChange={(e) => onToggleAirQuality(e.target.checked)}
                                                className="w-4 h-4 rounded accent-blue-500"
                                            />
                                            <span className="text-2xl">🌫️</span>
                                            <span className="text-white text-sm font-medium">Air Quality Markers</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Date Picker */}
                    <AccordionItem value="date" className="border-white/10">
                        <AccordionTrigger className="text-white hover:bg-white/5">
                            <span className="flex items-center gap-2">
                                <span className="text-xl">📅</span>
                                <span>Satellite Date</span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => onDateChange(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    min="2012-05-08"
                                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:bg-white/15 cursor-pointer"
                                    style={{ colorScheme: 'dark' }}
                                />
                                <p className="text-white/70 text-xs">
                                    Selected:{' '}
                                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>

                                {/* Quick Date Buttons */}
                                <div className="grid grid-cols-3 gap-1.5">
                                    <button
                                        onClick={() =>
                                            onDateChange(new Date(Date.now() - 86400000).toISOString().split('T')[0])
                                        }
                                        className="px-2 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
                                    >
                                        Yesterday
                                    </button>
                                    <button
                                        onClick={() =>
                                            onDateChange(new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0])
                                        }
                                        className="px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
                                    >
                                        7 Days
                                    </button>
                                    <button
                                        onClick={() =>
                                            onDateChange(
                                                new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
                                            )
                                        }
                                        className="px-2 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
                                    >
                                        30 Days
                                    </button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* NDVI Settings - Only visible when NDVI layer is active */}
                    {activeLayer === 'ndvi' && (
                        <AccordionItem value="ndvi" className="border-white/10">
                            <AccordionTrigger className="text-white hover:bg-white/5">
                                <span className="flex items-center gap-2">
                                    <span className="text-xl">🌳</span>
                                    <span>NDVI Settings</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    {/* Opacity Control */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm font-semibold mb-2 text-white">
                                            <span>💧 Opacity</span>
                                            <span className="text-emerald-300">{Math.round(ndviOpacity * 100)}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0.2"
                                            max="1"
                                            step="0.05"
                                            value={ndviOpacity}
                                            onChange={(e) => onNDVIOpacityChange?.(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>

                                    {/* Resolution Control */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-white">
                                            🔍 Grid Resolution
                                        </label>
                                        <select
                                            value={ndviCellSize}
                                            onChange={(e) => onNDVICellSizeChange?.(parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="0.002">🔬 Ultra High (~220m)</option>
                                            <option value="0.003">🔍 Very High (~330m)</option>
                                            <option value="0.005">📊 High (~550m)</option>
                                            <option value="0.01">🌐 Medium (~1km)</option>
                                        </select>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Map Info */}
                    <AccordionItem value="info" className="border-white/10">
                        <AccordionTrigger className="text-white hover:bg-white/5">
                            <span className="flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                <span>Map Info</span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 text-sm text-white/80">
                                <p>🎯 Click markers for details</p>
                                <p>🔍 Scroll to zoom in/out</p>
                                <p>🗺️ Drag to pan the map</p>
                                <p>📍 Allow GPS for accurate location</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Last Updated */}
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/50 text-center">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </motion.div>
    );
}
