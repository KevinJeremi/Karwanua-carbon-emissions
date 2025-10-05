"use client";

import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

export function SmartAnalysisCard() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState("1x");

    const speeds = ["0.5x", "1x", "1.5x"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🎵</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Analysis</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">Listen to key points</p>

            {/* Audio Waveform Visualization */}
            <div className="mb-6">
                <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-end gap-1 h-8">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                                style={{
                                    width: '3px',
                                    height: `${Math.random() * 100 + 20}%`,
                                }}
                                animate={{
                                    height: isPlaying ? `${Math.random() * 100 + 20}%` : `${Math.random() * 30 + 10}%`
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: isPlaying ? Infinity : 0,
                                    repeatType: "reverse"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <span className="text-sm font-medium text-gray-700">20:16</span>
                </div>

                <div className="flex items-center gap-2">
                    {speeds.map((speedOption) => (
                        <button
                            key={speedOption}
                            onClick={() => setSpeed(speedOption)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${speed === speedOption
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {speedOption}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
