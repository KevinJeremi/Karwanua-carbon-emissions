"use client";

import { motion } from "framer-motion";
import { User, Settings, Clock, Brain, Globe, Languages, Key } from "lucide-react";
import { MiniNavbar } from "./ui/mini-navbar";

interface ProfilePageProps {
    currentPage?: string;
    onPageChange?: (page: string) => void;
}

const analysisHistory = [
    { id: 1, title: "CO₂ Trends in Southeast Asia", model: "GPT-4o", date: "2 hours ago", confidence: 87 },
    { id: 2, title: "NDVI Analysis Amazon Rainforest", model: "DeepSeek", date: "1 day ago", confidence: 92 },
    { id: 3, title: "Temperature Anomaly Arctic", model: "Llama 3", date: "2 days ago", confidence: 85 },
    { id: 4, title: "Emission Report Europe", model: "GPT-4o", date: "3 days ago", confidence: 89 },
];

export function ProfilePage({ onPageChange, currentPage }: ProfilePageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-greenish-dark to-greenish-mid">
            <MiniNavbar currentPage={currentPage} onPageChange={onPageChange} />

            {/* Header Section */}
            <section className="w-full relative bg-gradient-to-br from-greenish-dark via-greenish-mid to-emerald-600 text-white rounded-b-3xl overflow-hidden mb-8 pt-24">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                        <span className="text-emerald-200/90 text-sm uppercase tracking-wider">User Profile</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">Profile & Settings</h1>
                    <p className="text-white/80 text-lg">
                        Manage your account and AI preferences
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                        JD
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
                                <p className="text-gray-500 mt-1">Climate Researcher</p>
                                <p className="text-gray-400 text-sm mt-2">john.doe@karwanua.org</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="border-t pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Member since</span>
                                    <span className="text-gray-800 font-semibold">Jan 2024</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Total Analysis</span>
                                    <span className="text-emerald-600 font-bold">142</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Reports Generated</span>
                                    <span className="text-emerald-600 font-bold">48</span>
                                </div>
                            </div>

                            {/* Edit Profile Button */}
                            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg">
                                Edit Profile
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column - Settings & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Settings Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Settings className="text-emerald-600" size={28} />
                                <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Default AI Model */}
                                <div className="flex items-start justify-between pb-6 border-b">
                                    <div className="flex items-start gap-3">
                                        <Brain className="text-purple-600 mt-1" size={24} />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-1">Default AI Model</h4>
                                            <p className="text-gray-500 text-sm">Choose your preferred AI engine</p>
                                        </div>
                                    </div>
                                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                        <option>GPT-4o</option>
                                        <option>DeepSeek</option>
                                        <option>Llama 3</option>
                                    </select>
                                </div>

                                {/* Default Region */}
                                <div className="flex items-start justify-between pb-6 border-b">
                                    <div className="flex items-start gap-3">
                                        <Globe className="text-blue-600 mt-1" size={24} />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-1">Default Region</h4>
                                            <p className="text-gray-500 text-sm">Your primary analysis region</p>
                                        </div>
                                    </div>
                                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                        <option>Southeast Asia</option>
                                        <option>North America</option>
                                        <option>Europe</option>
                                        <option>South America</option>
                                        <option>Africa</option>
                                        <option>Oceania</option>
                                    </select>
                                </div>

                                {/* Language Preference */}
                                <div className="flex items-start justify-between pb-6 border-b">
                                    <div className="flex items-start gap-3">
                                        <Languages className="text-green-600 mt-1" size={24} />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-1">Language Preference</h4>
                                            <p className="text-gray-500 text-sm">Interface language</p>
                                        </div>
                                    </div>
                                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                        <option>English</option>
                                        <option>Bahasa Indonesia</option>
                                        <option>简体中文</option>
                                        <option>Español</option>
                                    </select>
                                </div>

                                {/* API Usage Quota */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <Key className="text-orange-600 mt-1" size={24} />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-1">API Usage Quota</h4>
                                            <p className="text-gray-500 text-sm">Monthly AI requests</p>
                                            <div className="mt-3 w-64">
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>648 / 1000 requests</span>
                                                    <span>65%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Analysis History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-emerald-600" size={28} />
                                <h3 className="text-2xl font-bold text-gray-800">Recent Analysis History</h3>
                            </div>

                            <div className="space-y-4">
                                {analysisHistory.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Brain size={14} className="text-purple-600" />
                                                    {item.model}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {item.date}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1">Confidence</div>
                                            <div className="text-lg font-bold text-emerald-600">{item.confidence}%</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button className="w-full mt-6 px-4 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300">
                                View All History
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
