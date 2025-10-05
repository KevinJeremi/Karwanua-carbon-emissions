// src/contexts/AppDataContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LocationData {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
    address?: string;
}

interface MapData {
    ndvi?: number;
    co2?: number;
    temperature?: number;
    airQuality?: string;
    selectedDate?: string;
}

interface AnalyticsData {
    co2Average?: number;
    emissionChange?: number;
    ndviIndex?: number;
    tempAnomaly?: number;
    aiSummary?: string;
    aiConfidence?: number;
    lastUpdated?: string;
}

interface AppDataContextType {
    locationData: LocationData | null;
    setLocationData: (data: LocationData | null) => void;

    mapData: MapData | null;
    setMapData: (data: MapData | null) => void;

    analyticsData: AnalyticsData | null;
    setAnalyticsData: (data: AnalyticsData | null) => void;

    // Helper untuk mendapatkan semua context untuk AI
    getFullContext: () => string;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [mapData, setMapData] = useState<MapData | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    const getFullContext = () => {
        let context = "User Context:\n";

        if (locationData) {
            context += `\n📍 Location: ${locationData.city || 'Unknown'}`;
            context += `\n   Coordinates: ${locationData.lat.toFixed(4)}°N, ${locationData.lng.toFixed(4)}°E`;
        }

        if (mapData) {
            context += `\n\n🌍 Real-Time Environmental Data (Date: ${mapData.selectedDate || 'N/A'}):`;
            if (mapData.co2 !== undefined) {
                context += `\n   - CO₂ Level: ${mapData.co2.toFixed(1)} ppm (Source: Open-Meteo Air Quality API)`;
                const globalAvg = 415;
                const diff = mapData.co2 - globalAvg;
                if (diff > 0) {
                    context += `\n   - Status: ${diff.toFixed(1)} ppm above global average (${globalAvg} ppm)`;
                } else {
                    context += `\n   - Status: ${Math.abs(diff).toFixed(1)} ppm below global average (${globalAvg} ppm)`;
                }
            }
            if (mapData.ndvi !== undefined) context += `\n   - NDVI (Vegetation Index): ${mapData.ndvi.toFixed(3)}`;
            if (mapData.temperature !== undefined) context += `\n   - Temperature: ${mapData.temperature}°C`;
            if (mapData.airQuality) context += `\n   - Air Quality Status: ${mapData.airQuality}`;
        }

        if (analyticsData) {
            context += `\n\n📊 Analytics Overview:`;
            if (analyticsData.co2Average !== undefined) context += `\n   - Global CO₂ Average: ${analyticsData.co2Average} ppm`;
            if (analyticsData.emissionChange !== undefined) context += `\n   - Emission Change: +${analyticsData.emissionChange.toFixed(1)}%`;
            if (analyticsData.ndviIndex !== undefined) context += `\n   - NDVI Index: ${analyticsData.ndviIndex.toFixed(2)}`;
            if (analyticsData.tempAnomaly !== undefined) context += `\n   - Temperature Anomaly: +${analyticsData.tempAnomaly.toFixed(1)}°C`;
            if (analyticsData.aiSummary) context += `\n\n🧠 AI Summary: ${analyticsData.aiSummary}`;
        }

        return context || "No context data available yet.";
    };

    return (
        <AppDataContext.Provider
            value={{
                locationData,
                setLocationData,
                mapData,
                setMapData,
                analyticsData,
                setAnalyticsData,
                getFullContext,
            }}
        >
            {children}
        </AppDataContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error("useAppData must be used within AppDataProvider");
    }
    return context;
}
