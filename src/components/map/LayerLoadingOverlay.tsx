/**
 * LayerLoadingOverlay Component
 * Shows loading state when switching map layers
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayerLoadingOverlayProps {
    isLoading: boolean;
    layerName?: string;
}

export function LayerLoadingOverlay({ isLoading, layerName }: LayerLoadingOverlayProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] rounded-xl"
                >
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="text-6xl"
                            >
                                🌍
                            </motion.div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Loading Layer</h3>
                                {layerName && <p className="text-sm text-gray-600">{layerName}</p>}
                            </div>
                            <div className="flex gap-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                    className="w-2 h-2 bg-emerald-500 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    className="w-2 h-2 bg-emerald-500 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    className="w-2 h-2 bg-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
