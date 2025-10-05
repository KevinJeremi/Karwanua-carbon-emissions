"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function TutorialCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 group cursor-pointer"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Plant Care Tutorial</h3>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow"
                >
                    <Play size={16} fill="currentColor" />
                </motion.button>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👨‍🔬</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">Specialist Botanist</p>
                    <p className="text-xs text-gray-500">Plant Care Expert</p>
                </div>
            </div>

            <div className="relative mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-green-200 to-emerald-300 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20"
                        animate={{
                            background: [
                                "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))",
                                "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.2))"
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <div className="relative z-10 text-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                            <Play size={24} fill="currentColor" className="text-green-600 ml-1" />
                        </div>
                        <p className="text-xs font-medium text-green-800">Watch Tutorial</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium text-gray-900">3m 12s</span>
            </div>
        </motion.div>
    );
}
