"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TreeDeciduous, Info, TrendingDown, X } from "lucide-react";

interface CarbonCalculatorProps {
    co2Level?: number; // in ppm
    userLocation?: string;
    onClose?: () => void;
}

// Tree species data dengan carbon absorption rate (kg CO2/year per tree)
const TREE_SPECIES = [
    {
        id: "mangrove",
        name: "Mangrove",
        icon: "🌴",
        absorptionRate: 12.3, // kg CO2/year/tree
        description: "Excellent for coastal areas, high carbon sequestration",
        growthYears: 5,
    },
    {
        id: "oak",
        name: "Oak Tree",
        icon: "🌳",
        absorptionRate: 22.0,
        description: "Long-lived, great for temperate climates",
        growthYears: 10,
    },
    {
        id: "pine",
        name: "Pine Tree",
        icon: "🌲",
        absorptionRate: 10.0,
        description: "Fast-growing, suitable for various climates",
        growthYears: 7,
    },
    {
        id: "bamboo",
        name: "Bamboo",
        icon: "🎋",
        absorptionRate: 35.0,
        description: "Fastest carbon absorber, renewable resource",
        growthYears: 3,
    },
    {
        id: "eucalyptus",
        name: "Eucalyptus",
        icon: "🌿",
        absorptionRate: 18.5,
        description: "Fast-growing, drought-resistant",
        growthYears: 5,
    },
];

export function CarbonCalculator({ co2Level = 412, userLocation = "Your Area", onClose }: CarbonCalculatorProps) {
    const [selectedSpecies, setSelectedSpecies] = useState(TREE_SPECIES[0]);
    const [timeHorizon, setTimeHorizon] = useState(10); // years
    const [area, setArea] = useState(1000); // square meters

    // Calculate emissions based on CO2 level
    // Assumption: excess CO2 above 350 ppm baseline
    const baselineCO2 = 350; // pre-industrial level
    const excessCO2 = Math.max(0, co2Level - baselineCO2);

    // Rough calculation: ppm to tons CO2 for a local area
    // This is simplified; in reality, needs atmospheric volume calculation
    const estimatedEmissionsTons = useMemo(() => {
        // Very rough estimate: 1 ppm excess ≈ 0.5 tons CO2 for 1km² area
        const areaKm2 = area / 1_000_000;
        return (excessCO2 * 0.5 * areaKm2).toFixed(2);
    }, [excessCO2, area]);

    // Calculate trees needed
    const treesNeeded = useMemo(() => {
        const annualEmissions = parseFloat(estimatedEmissionsTons);
        const treesPerYear = annualEmissions * 1000 / selectedSpecies.absorptionRate; // convert tons to kg
        return Math.ceil(treesPerYear);
    }, [estimatedEmissionsTons, selectedSpecies]);

    // Calculate total offset over time horizon
    const totalOffsetTons = useMemo(() => {
        return ((treesNeeded * selectedSpecies.absorptionRate * timeHorizon) / 1000).toFixed(2);
    }, [treesNeeded, selectedSpecies, timeHorizon]);

    const percentage = useMemo(() => {
        const offset = parseFloat(totalOffsetTons);
        const emissions = parseFloat(estimatedEmissionsTons) * timeHorizon;
        return Math.min(100, ((offset / emissions) * 100)).toFixed(0);
    }, [totalOffsetTons, estimatedEmissionsTons, timeHorizon]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="relative bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 rounded-t-3xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Calculator className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Carbon Offset Calculator</h2>
                                <p className="text-emerald-100 text-sm">Calculate trees needed to offset emissions</p>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Current Status */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Current Carbon Status</h3>
                                <p className="text-sm text-gray-600">{userLocation}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">CO₂ Level</p>
                                <p className="text-2xl font-bold text-orange-600">{co2Level} ppm</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Excess CO₂</p>
                                <p className="text-2xl font-bold text-red-600">{excessCO2} ppm</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">Est. Emissions</p>
                                <p className="text-2xl font-bold text-gray-800">{estimatedEmissionsTons} tons/yr</p>
                            </div>
                        </div>
                    </div>

                    {/* Area Input */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200">
                        <label className="block mb-3">
                            <span className="text-sm font-semibold text-gray-700">Area to Offset (m²)</span>
                            <div className="flex items-center gap-4 mt-2">
                                <input
                                    type="range"
                                    min="100"
                                    max="10000"
                                    step="100"
                                    value={area}
                                    onChange={(e) => setArea(parseInt(e.target.value))}
                                    className="flex-1 accent-emerald-600"
                                />
                                <span className="text-lg font-bold text-emerald-600 min-w-[100px]">
                                    {area.toLocaleString()} m²
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                ≈ {(area / 10000).toFixed(2)} hectares
                            </p>
                        </label>
                    </div>

                    {/* Tree Species Selection */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <TreeDeciduous className="w-5 h-5 text-emerald-600" />
                            Select Tree Species
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {TREE_SPECIES.map((species) => (
                                <button
                                    key={species.id}
                                    onClick={() => setSelectedSpecies(species)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${selectedSpecies.id === species.id
                                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                                            : "border-gray-200 hover:border-emerald-300 bg-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{species.icon}</span>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{species.name}</h4>
                                            <p className="text-xs text-emerald-600 font-semibold">
                                                {species.absorptionRate} kg CO₂/yr
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">{species.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Horizon */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200">
                        <label className="block">
                            <span className="text-sm font-semibold text-gray-700">Time Horizon (years)</span>
                            <div className="flex items-center gap-4 mt-2">
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={timeHorizon}
                                    onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                                    className="flex-1 accent-emerald-600"
                                />
                                <span className="text-lg font-bold text-emerald-600 min-w-[80px]">
                                    {timeHorizon} years
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Results */}
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📊</span> Calculation Results
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <p className="text-emerald-100 text-sm mb-1">Trees Needed (Annual)</p>
                                <p className="text-4xl font-bold">{treesNeeded.toLocaleString()}</p>
                                <p className="text-emerald-100 text-xs mt-1">{selectedSpecies.name} trees</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <p className="text-emerald-100 text-sm mb-1">Total Offset ({timeHorizon} years)</p>
                                <p className="text-4xl font-bold">{totalOffsetTons}</p>
                                <p className="text-emerald-100 text-xs mt-1">tons CO₂</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/20 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold">Offset Coverage</span>
                                <span className="text-2xl font-bold">{percentage}%</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-4">
                                <div
                                    className="bg-white h-4 rounded-full transition-all duration-500 flex items-center justify-end px-2"
                                    style={{ width: `${percentage}%` }}
                                >
                                    <span className="text-emerald-600 text-xs font-bold">
                                        {parseInt(percentage) >= 20 && `${percentage}%`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Methodology & Disclaimer */}
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700 space-y-2">
                                <h4 className="font-bold text-gray-800">Methodology & Assumptions</h4>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>
                                        Carbon absorption rates based on mature trees (age {selectedSpecies.growthYears}+ years)
                                    </li>
                                    <li>
                                        Calculation uses {baselineCO2} ppm as pre-industrial baseline
                                    </li>
                                    <li>
                                        Estimates assume optimal growing conditions and tree survival
                                    </li>
                                    <li>
                                        Area-based emissions are simplified approximations
                                    </li>
                                    <li>
                                        Actual carbon sequestration varies by climate, soil, and management
                                    </li>
                                </ul>
                                <p className="text-xs text-blue-600 font-semibold mt-3">
                                    ⚠️ This calculator provides estimates for educational purposes. Consult environmental
                                    experts for precise carbon offset planning.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                            <span>📄</span> Download Report
                        </button>
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                            <span>🌱</span> Find Planting Programs
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
