"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Download, Navigation } from "lucide-react";
import { MiniNavbar } from "./ui/mini-navbar";
import dynamic from 'next/dynamic';
import { LocationCard } from "./LocationCard";
import { NDVIStatsPanel } from "./NDVIStatsPanel";
import { DataSourceInfoInline } from "@/components/DataSourceDisclaimer";
import { MapSidebar } from "@/components/map/MapSidebar";
import { LayerLoadingOverlay } from "@/components/map/LayerLoadingOverlay";
import { MapDataProvider } from "@/contexts/MapDataContext";
import { useAppData } from "@/contexts/AppDataContext";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useLayerControl } from "@/hooks/useLayerControl";
import type { GIBSLayerType } from "@/types/gibs-layers";

// Dynamically import InteractiveMap (client-side only)
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-900/20">
            <div className="text-center">
                <div className="animate-spin text-6xl mb-4">🌍</div>
                <div className="text-white text-lg">Loading Interactive Map...</div>
            </div>
        </div>
    ),
});

interface MapPageProps {
    onPageChange: (page: string) => void;
    currentPage: string;
}

export function MapPage({ onPageChange, currentPage }: MapPageProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { setLocationData, setMapData } = useAppData();

    // Use custom hooks for cleaner state management
    const { location: userLocation, recenter, detectLocation } = useUserLocation({
        autoDetect: true,
    });

    const {
        activeLayer,
        selectedDate,
        showAirQuality,
        ndviOpacity,
        ndviCellSize,
        isLayerLoading,
        setActiveLayer,
        setSelectedDate,
        setShowAirQuality,
        setNdviOpacity,
        setNdviCellSize,
    } = useLayerControl({
        initialLayer: "truecolor",
        initialDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        initialShowAirQuality: true,
    });

    // Base map style controlled at page level
    const [baseMapStyle, setBaseMapStyle] = useState<'osm' | 'mapbox-streets' | 'mapbox-satellite' | 'cartodb' | 'esri'>('osm');

    // Update AppDataContext when location changes
    useEffect(() => {
        if (userLocation) {
            setLocationData({
                lat: userLocation.lat,
                lng: userLocation.lng,
                city: userLocation.city,
            });
        }
    }, [userLocation, setLocationData]);

    // Update map data when relevant data changes
    useEffect(() => {
        if (userLocation) {
            setMapData({
                selectedDate,
                // NDVI and other data will be updated by child components via context
            });
        }
    }, [selectedDate, userLocation, setMapData]);

    return (
        <MapDataProvider location={userLocation} selectedDate={selectedDate}>
            <div className="min-h-screen bg-gradient-to-br from-greenish-dark via-greenish-muted to-greenish-mid pt-20">
                <MiniNavbar currentPage={currentPage} onPageChange={onPageChange} />

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
                    {/* Header Section */}
                    <motion.section
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-emerald-200/90 text-sm uppercase tracking-wider">WebGIS Carbon Monitor</span>
                                    {/* Data Source Info */}
                                    <div className="ml-auto">
                                        <DataSourceInfoInline />
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    🗺️ Carbon Map
                                </h1>
                                <p className="text-white/70 text-lg">
                                    Real-time GPS-based carbon detection with interactive visualization
                                </p>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={recenter}
                                    className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-lg text-white text-sm font-semibold transition-all duration-200 flex items-center gap-2 hover:scale-105"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Recenter GPS
                                </button>
                            </div>
                        </div>
                    </motion.section>

                    {/* Main Layout Grid: Stats Kiri, Map Kanan */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* LEFT SIDEBAR - Stats Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Location Card */}
                            {userLocation && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <LocationCard
                                        location={userLocation}
                                        selectedDate={selectedDate}
                                    />
                                </motion.div>
                            )}

                            {/* NDVI Statistics Panel */}
                            {userLocation && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <NDVIStatsPanel
                                        latitude={userLocation.lat}
                                        longitude={userLocation.lng}
                                        locationName={userLocation.city}
                                        selectedDate={selectedDate}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* RIGHT SECTION - Map */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
                                {/* Map Header */}
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-emerald-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Interactive Carbon Map</h3>
                                            <p className="text-white/60 text-xs">
                                                {userLocation
                                                    ? `Showing data for ${userLocation.city}`
                                                    : "Detecting your location..."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Indicators */}
                                    <div className="flex items-center gap-3">
                                        {/* Date Badge */}
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-400/30">
                                            <span className="text-lg">📅</span>
                                            <span className="text-indigo-300 text-xs font-semibold">
                                                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-400/30">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-300 text-xs font-semibold">GPS Active</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-400/30">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-blue-300 text-xs font-semibold">Live Data</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Container - Fullscreen with floating sidebar */}
                                <div className="relative h-[700px] max-h-[700px] rounded-xl overflow-hidden">
                                    {/* Floating Collapsible Sidebar - Kiri Atas */}
                                    <MapSidebar
                                        activeLayer={activeLayer}
                                        onLayerChange={setActiveLayer}
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                        showAirQuality={showAirQuality}
                                        onToggleAirQuality={setShowAirQuality}
                                        ndviOpacity={ndviOpacity}
                                        onNDVIOpacityChange={setNdviOpacity}
                                        ndviCellSize={ndviCellSize}
                                        onNDVICellSizeChange={setNdviCellSize}
                                        isCollapsed={isSidebarCollapsed}
                                        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    />

                                    {/* Floating Base Map Selector - Kanan Atas */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="absolute top-4 right-4 z-[1000] w-56"
                                    >
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-emerald-300" />
                                                <h3 className="text-white font-bold text-sm flex items-center gap-2">🗺️ Base Map</h3>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => setBaseMapStyle('osm')}
                                                    className={`px-2 py-1.5 text-xs rounded transition-all font-medium ${baseMapStyle === 'osm'
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'bg-gray-200 hover:bg-gray-300 text-black/80'
                                                        }`}
                                                    title="OpenStreetMap"
                                                >
                                                    OSM
                                                </button>
                                                <button
                                                    onClick={() => setBaseMapStyle('cartodb')}
                                                    className={`px-2 py-1.5 text-xs rounded transition-all font-medium ${baseMapStyle === 'cartodb'
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'bg-gray-200 hover:bg-gray-300 text-black/80'
                                                        }`}
                                                    title="CartoDB Voyager"
                                                >
                                                    CartoDB
                                                </button>
                                                <button
                                                    onClick={() => setBaseMapStyle('esri')}
                                                    className={`px-2 py-1.5 text-xs rounded transition-all font-medium ${baseMapStyle === 'esri'
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'bg-gray-200 hover:bg-gray-300 text-black/80'
                                                        }`}
                                                    title="Esri World Imagery"
                                                >
                                                    Esri
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Map */}
                                    <InteractiveMap
                                        defaultCenter={[-2.5, 118.0]}
                                        defaultZoom={5}
                                        defaultLayer={activeLayer}
                                        height="100%"
                                        showControls={false}
                                        externalLayer={activeLayer}
                                        externalDate={selectedDate}
                                        externalShowAirQuality={showAirQuality}
                                        externalBaseMapStyle={baseMapStyle}
                                        userLocation={userLocation}
                                        onLocationDetected={detectLocation}
                                    />

                                    {/* Loading Overlay */}
                                    <LayerLoadingOverlay
                                        isLoading={isLayerLoading}
                                        layerName={activeLayer === 'ndvi' ? 'Vegetation (NDVI)' : 'True Color Satellite'}
                                    />
                                </div>

                                {/* Map Footer - Legend & Info */}
                                <div className="mt-4 space-y-3">
                                    <div className="pt-3 border-t border-white/10">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <p className="text-white/80 text-xs font-semibold mb-2">PM2.5 Air Quality Index:</p>
                                                <div className="flex items-center gap-4 text-xs text-white/70">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <span>Good (0-12 μg/m³)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                        <span>Moderate (12-35)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                                        <span>Unhealthy (35-55)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <span>Very Unhealthy (55+)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="text-xs text-white/50">
                                                    🛰️ NASA GIBS • 🌫️ Open-Meteo
                                                </div>
                                                <div className="text-xs text-indigo-300 font-semibold">
                                                    Viewing: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MapDataProvider>
    );
}
