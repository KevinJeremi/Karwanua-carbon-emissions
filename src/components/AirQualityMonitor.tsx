'use client';

import { useAirQuality } from '@/hooks/useAirQuality';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface AirQualityMonitorProps {
    defaultLocation?: {
        name: string;
        latitude: number;
        longitude: number;
    };
    autoRefresh?: boolean;
    refreshInterval?: number; // in milliseconds
}

/**
 * Air Quality Monitor Component
 * Menampilkan data real-time dari Open-Meteo Air Quality API
 * 
 * Features:
 * - Real-time CO₂, CO, PM2.5, PM10 monitoring
 * - Air quality status indicator
 * - Auto-refresh capability
 * - Multiple location support
 */
export default function AirQualityMonitor({
    defaultLocation = {
        name: 'Jakarta',
        latitude: -6.2088,
        longitude: 106.8456,
    },
    autoRefresh = false,
    refreshInterval = 3600000, // 1 hour default
}: AirQualityMonitorProps) {
    const [location, setLocation] = useState(defaultLocation);

    const { data, isLoading, error, refetch, assessment } = useAirQuality({
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.name,
        autoFetch: true,
        refetchInterval: autoRefresh ? refreshInterval : undefined,
    });

    // Predefined locations
    const locations = [
        { name: 'Jakarta', latitude: -6.2088, longitude: 106.8456 },
        { name: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
        { name: 'Bandung', latitude: -6.9175, longitude: 107.6191 },
        { name: 'Medan', latitude: 3.5952, longitude: 98.6722 },
        { name: 'Semarang', latitude: -6.9932, longitude: 110.4203 },
    ];

    const formatValue = (value: number | null | undefined, unit: string = '') => {
        if (value === null || value === undefined) return 'N/A';
        return `${value.toFixed(1)} ${unit}`;
    };

    const formatTime = (timeString: string | undefined) => {
        if (!timeString) return 'N/A';
        try {
            const date = new Date(timeString);
            return date.toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return timeString;
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        🌍 Air Quality Monitor
                        {autoRefresh && (
                            <span className="text-sm font-normal text-green-500 animate-pulse">● Live</span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Real-time air quality data powered by Open-Meteo
                    </p>
                </div>

                {/* Location Selector */}
                <div className="flex gap-2 items-center">
                    <select
                        value={`${location.latitude},${location.longitude}`}
                        onChange={(e) => {
                            const selected = locations.find(
                                (loc) => `${loc.latitude},${loc.longitude}` === e.target.value
                            );
                            if (selected) setLocation(selected);
                        }}
                        className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors"
                    >
                        {locations.map((loc) => (
                            <option key={loc.name} value={`${loc.latitude},${loc.longitude}`}>
                                📍 {loc.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {isLoading ? '⟳ Loading...' : '🔄 Refresh'}
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <Card className="p-6 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Loading State */}
            {isLoading && !data && (
                <Card className="p-12 text-center">
                    <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
                    <p className="text-gray-500">Loading air quality data...</p>
                </Card>
            )}

            {/* Data Display */}
            {data?.data && (
                <div className="space-y-6">
                    {/* Status Card */}
                    {assessment && (
                        <Card
                            className="p-6 border-2 transition-all duration-300"
                            style={{ borderColor: assessment.color }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                        Air Quality Status
                                    </h3>
                                    <p
                                        className="text-3xl font-bold mb-2"
                                        style={{ color: assessment.color }}
                                    >
                                        {assessment.status}
                                    </p>
                                    <p className="text-sm text-gray-600">{assessment.message}</p>
                                </div>
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                                    style={{ backgroundColor: assessment.color }}
                                >
                                    {assessment.pm25Level.toFixed(0)}
                                    <span className="text-xs ml-1">μg/m³</span>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Carbon Dioxide */}
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-600">CO₂</h3>
                                <span className="text-2xl">💨</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatValue(data.data.current.carbon_dioxide, 'μg/m³')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Carbon Dioxide</p>
                        </Card>

                        {/* Carbon Monoxide */}
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-600">CO</h3>
                                <span className="text-2xl">🌫️</span>
                            </div>
                            <p className="text-2xl font-bold text-orange-600">
                                {formatValue(data.data.current.carbon_monoxide, 'μg/m³')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Carbon Monoxide</p>
                        </Card>

                        {/* PM2.5 */}
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-600">PM2.5</h3>
                                <span className="text-2xl">🌫️</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">
                                {formatValue(data.data.current.pm2_5, 'μg/m³')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Fine Particles</p>
                        </Card>

                        {/* PM10 */}
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-600">PM10</h3>
                                <span className="text-2xl">🌫️</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                                {formatValue(data.data.current.pm10, 'μg/m³')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Coarse Particles</p>
                        </Card>
                    </div>

                    {/* Additional Pollutants */}
                    {(data.data.current.nitrogen_dioxide ||
                        data.data.current.sulphur_dioxide ||
                        data.data.current.ozone) && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Additional Pollutants</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {data.data.current.nitrogen_dioxide != null && (
                                        <div>
                                            <p className="text-xs text-gray-500">NO₂</p>
                                            <p className="text-xl font-semibold">
                                                {formatValue(data.data.current.nitrogen_dioxide, 'μg/m³')}
                                            </p>
                                        </div>
                                    )}
                                    {data.data.current.sulphur_dioxide != null && (
                                        <div>
                                            <p className="text-xs text-gray-500">SO₂</p>
                                            <p className="text-xl font-semibold">
                                                {formatValue(data.data.current.sulphur_dioxide, 'μg/m³')}
                                            </p>
                                        </div>
                                    )}
                                    {data.data.current.ozone != null && (
                                        <div>
                                            <p className="text-xs text-gray-500">O₃</p>
                                            <p className="text-xl font-semibold">
                                                {formatValue(data.data.current.ozone, 'μg/m³')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                    {/* Info Footer */}
                    <Card className="p-4 bg-gray-50">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span>
                                    {data.location?.name} ({data.data.latitude.toFixed(4)}, {data.data.longitude.toFixed(4)})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🕒</span>
                                <span>Last updated: {formatTime(data.data.current.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>⏱️</span>
                                <span>Timezone: {data.data.timezone}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Powered By */}
                    <div className="text-center text-xs text-gray-400">
                        Powered by{' '}
                        <a
                            href="https://open-meteo.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-500"
                        >
                            Open-Meteo Air Quality API
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
