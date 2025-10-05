'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { useAirQuality } from '@/hooks/useAirQuality';
import { NDVILegend } from '@/components/NDVILegend';
import { NDVIGridOverlay } from '@/components/NDVIGridOverlay';
import type { GIBSLayerType, MapLocation } from '@/types/gibs-layers';
import { GIBS_LAYERS, MONITORING_LOCATIONS } from '@/types/gibs-layers';

// Custom CSS untuk animasi dan zoom
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
        .user-location-marker div {
            pointer-events: auto;
        }
        .leaflet-container {
            cursor: grab;
        }
        .leaflet-container:active {
            cursor: grabbing;
        }
        .leaflet-touch .leaflet-bar {
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);
}

// Fix Leaflet default marker icon issue with Next.js
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

interface LayerControlPanelProps {
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
}

function LayerControlPanel({
    activeLayer,
    onLayerChange,
    selectedDate,
    onDateChange,
    showAirQuality,
    onToggleAirQuality,
    ndviOpacity = 0.7,
    onNDVIOpacityChange,
    ndviCellSize = 0.01,
    onNDVICellSizeChange,
}: LayerControlPanelProps) {
    return (
        <Card className="absolute top-4 right-4 z-[1000] p-4 bg-white/95 backdrop-blur-sm shadow-lg max-w-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🛰️ Satellite Layers
            </h3>

            {/* Layer Selection */}
            <div className="space-y-2 mb-4">
                {Object.values(GIBS_LAYERS).map((layer) => (
                    <button
                        key={layer.id}
                        onClick={() => onLayerChange(layer.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${activeLayer === layer.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{layer.icon}</span>
                            <div className="flex-1">
                                <div className="font-semibold text-sm">{layer.name}</div>
                                <div className="text-xs opacity-75">{layer.description}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* NDVI Controls - Show only when NDVI layer is active */}
            {activeLayer === 'ndvi' && (
                <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 shadow-md">
                    <div className="text-sm font-bold mb-2 text-green-900 flex items-center gap-2">
                        <span className="text-lg">🌳</span>
                        <span>NDVI Visualization Settings</span>
                    </div>

                    {/* Info Banner */}
                    <div className="mb-3 p-3 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🛰️</span>
                            <span>NASA MODIS Terra/Aqua</span>
                        </div>
                        <div className="opacity-90">
                            Real-time vegetation health monitoring
                        </div>
                    </div>

                    <div className="text-xs text-gray-700 mb-4 bg-amber-50 p-2 rounded border border-amber-200 font-semibold">
                        📍 Analysis Area: <strong className="text-amber-800">8km radius</strong> (16x16km grid)
                    </div>

                    {/* Opacity Control */}
                    <div className="mb-4 p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                        <label className="flex items-center justify-between text-sm font-bold mb-2 text-gray-800">
                            <span>💧 Opacity</span>
                            <span className="text-green-600">{Math.round(ndviOpacity * 100)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0.2"
                            max="1"
                            step="0.05"
                            value={ndviOpacity}
                            onChange={(e) => onNDVIOpacityChange?.(parseFloat(e.target.value))}
                            className="w-full h-3 bg-gradient-to-r from-green-100 to-green-400 rounded-lg appearance-none cursor-pointer accent-green-600"
                            style={{
                                background: `linear-gradient(to right, #dcfce7 0%, #22c55e ${ndviOpacity * 100}%, #e5e7eb ${ndviOpacity * 100}%, #e5e7eb 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Transparent</span>
                            <span>Opaque</span>
                        </div>
                    </div>

                    {/* Resolution Control */}
                    <div className="p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                        <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-800">
                            <span>🔍</span>
                            <span>Grid Resolution</span>
                        </label>
                        <select
                            value={ndviCellSize}
                            onChange={(e) => onNDVICellSizeChange?.(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-semibold"
                        >
                            <option value="0.002">🔬 Ultra High (~220m)</option>
                            <option value="0.003">🔍 Very High (~330m) - Recommended</option>
                            <option value="0.005">📊 High (~550m)</option>
                            <option value="0.01">🌐 Medium (~1km)</option>
                        </select>
                        <div className="flex items-center gap-1 text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
                            <span>⚠️</span>
                            <span>Higher resolution = slower rendering</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Date Picker */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">📅 Date</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Air Quality Toggle */}
            <div className="border-t pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showAirQuality}
                        onChange={(e) => onToggleAirQuality(e.target.checked)}
                        className="w-4 h-4 text-blue-500 rounded"
                    />
                    <span className="text-sm font-semibold">
                        🌫️ Show Air Quality Markers
                    </span>
                </label>
            </div>

            {/* Layer Info */}
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                <div className="font-semibold text-blue-900">
                    {GIBS_LAYERS[activeLayer].icon} {GIBS_LAYERS[activeLayer].name}
                </div>
                <div className="text-blue-700 mt-1">
                    {GIBS_LAYERS[activeLayer].attribution}
                </div>
            </div>
        </Card>
    );
}

// Component to update map view when layer changes
function GIBSTileLayer({
    layerType,
    date
}: {
    layerType: GIBSLayerType;
    date: string;
}) {
    const map = useMap();
    const config = GIBS_LAYERS[layerType];

    const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${config.layer}/default/${date}/${config.tileMatrixSet}/{z}/{y}/{x}.${config.format}`;

    return (
        <TileLayer
            key={`${layerType}-${date}`} // Force re-render when layer or date changes
            url={gibsUrl}
            attribution={config.attribution}
            maxZoom={config.maxZoom}
            tileSize={512}
            zoomOffset={-1}
        />
    );
}

// Component to track zoom level
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    const map = useMap();

    useEffect(() => {
        const updateZoom = () => {
            onZoomChange(map.getZoom());
        };

        map.on('zoomend', updateZoom);
        updateZoom(); // Initial zoom

        return () => {
            map.off('zoomend', updateZoom);
        };
    }, [map, onZoomChange]);

    return null;
}

// Air Quality Marker Component
function AirQualityMarker({ location, selectedDate }: { location: MapLocation; selectedDate?: string }) {
    const { data, isLoading, assessment } = useAirQuality({
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.name,
        autoFetch: true,
        date: selectedDate,
    });

    // Custom icon based on air quality status
    const getMarkerIcon = () => {
        const color = assessment?.color || '#3b82f6';
        const iconHtml = `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        🌫️
      </div>
    `;

        return L.divIcon({
            html: iconHtml,
            className: 'custom-air-quality-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
        });
    };

    return (
        <Marker
            position={[location.latitude, location.longitude]}
            icon={getMarkerIcon()}
        >
            <Popup>
                <div className="min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2">📍 {location.name}</h3>

                    {isLoading ? (
                        <div className="text-sm text-gray-500">Loading air quality...</div>
                    ) : data?.data ? (
                        <div className="space-y-2">
                            {assessment && (
                                <div
                                    className="p-2 rounded font-semibold text-white"
                                    style={{ backgroundColor: assessment.color }}
                                >
                                    {assessment.status}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <div className="text-xs text-gray-500">CO₂</div>
                                    <div className="font-semibold">
                                        {data.data.current.carbon_dioxide?.toFixed(1) || 'N/A'} ppm
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">PM2.5</div>
                                    <div className="font-semibold">
                                        {data.data.current.pm2_5?.toFixed(1) || 'N/A'} μg/m³
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">PM10</div>
                                    <div className="font-semibold">
                                        {data.data.current.pm10?.toFixed(1) || 'N/A'} μg/m³
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">CO</div>
                                    <div className="font-semibold">
                                        {data.data.current.carbon_monoxide?.toFixed(0) || 'N/A'} μg/m³
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-2">
                                Updated: {new Date(data.data.current.time).toLocaleString('id-ID')}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-red-500">Failed to load data</div>
                    )}
                </div>
            </Popup>
        </Marker>
    );
}

interface InteractiveMapProps {
    defaultCenter?: [number, number];
    defaultZoom?: number;
    defaultLayer?: GIBSLayerType;
    height?: string;
    showControls?: boolean; // Option to hide the built-in controls
    externalLayer?: GIBSLayerType; // Control layer from outside
    externalDate?: string; // Control date from outside
    externalShowAirQuality?: boolean; // Control air quality from outside
    externalBaseMapStyle?: 'osm' | 'mapbox-streets' | 'mapbox-satellite' | 'cartodb' | 'esri';
    userLocation?: { lat: number; lng: number; city: string } | null; // User GPS location
    onLocationDetected?: (location: { lat: number; lng: number; city: string }) => void;
}

// Component to handle user location marker
function UserLocationMarker({
    location,
    onLocationDetected,
    selectedDate
}: {
    location: { lat: number; lng: number; city: string } | null;
    onLocationDetected?: (location: { lat: number; lng: number; city: string }) => void;
    selectedDate?: string;
}) {
    const map = useMap();
    const [position, setPosition] = useState<[number, number] | null>(
        location ? [location.lat, location.lng] : null
    );
    const [locationName, setLocationName] = useState<string>(location?.city || 'Your Location');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Get air quality data for user location
    const { data: airQualityData, assessment } = useAirQuality({
        latitude: position ? position[0] : 0,
        longitude: position ? position[1] : 0,
        locationName: locationName,
        autoFetch: !!position,
        date: selectedDate, // Use the same date as LocationCard
    });

    // Fetch reverse geocoding
    const fetchLocationName = async (lat: number, lng: number) => {
        try {
            setIsLoadingLocation(true);
            const response = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    return result.data.fullName || 'Your Location';
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsLoadingLocation(false);
        }
        return 'Your Location';
    };

    useEffect(() => {
        if (!location && onLocationDetected) {
            // Auto-detect user location
            map.locate({ setView: true, maxZoom: 10 });

            const onLocationFound = async (e: L.LocationEvent) => {
                const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);

                // Reverse geocoding untuk mendapatkan nama kota lengkap
                const cityName = await fetchLocationName(e.latlng.lat, e.latlng.lng);
                setLocationName(cityName);

                onLocationDetected({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    city: cityName
                });
            };

            map.on('locationfound', onLocationFound);

            return () => {
                map.off('locationfound', onLocationFound);
            };
        } else if (location) {
            setPosition([location.lat, location.lng]);
            setLocationName(location.city);
            map.setView([location.lat, location.lng], 10);
        }
    }, [map, location, onLocationDetected]);

    if (!position) return null;

    // Custom icon untuk user location with air quality color
    const bgColor = assessment?.color || '#3b82f6';
    const userIcon = L.divIcon({
        html: `
            <div style="
                background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                position: relative;
            ">
                📍
                <div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid ${bgColor};
                    animation: ripple 2s infinite;
                "></div>
            </div>
        `,
        className: 'user-location-marker',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
    });

    return (
        <Marker position={position} icon={userIcon} zIndexOffset={1000}>
            <Popup>
                <div className="min-w-[250px]">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        📍 Lokasi Anda
                    </h3>

                    <div className="text-sm space-y-2">
                        <div className="pb-2 border-b">
                            {isLoadingLocation ? (
                                <p className="text-gray-500 italic">Memuat nama lokasi...</p>
                            ) : (
                                <p className="font-semibold text-base mb-1">{locationName}</p>
                            )}
                            <p className="text-gray-600">{position[0].toFixed(4)}°N, {position[1].toFixed(4)}°E</p>
                        </div>

                        {/* Air Quality Data */}
                        {assessment && (
                            <div
                                className="p-2 rounded font-semibold text-white text-center"
                                style={{ backgroundColor: assessment.color }}
                            >
                                Air Quality: {assessment.status}
                            </div>
                        )}

                        {airQualityData?.data && (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-blue-50 p-2 rounded">
                                    <div className="text-xs text-blue-600 font-semibold">CO₂</div>
                                    <div className="font-bold text-blue-900 text-sm">
                                        {airQualityData.data.current.carbon_dioxide ?
                                            airQualityData.data.current.carbon_dioxide.toFixed(1) : 'N/A'
                                        } ppm
                                    </div>
                                </div>
                                <div className="bg-orange-50 p-2 rounded">
                                    <div className="text-xs text-orange-600 font-semibold">PM2.5</div>
                                    <div className="font-bold text-orange-900 text-sm">
                                        {airQualityData.data.current.pm2_5?.toFixed(1) || 'N/A'} μg/m³
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-2 rounded">
                                    <div className="text-xs text-purple-600 font-semibold">PM10</div>
                                    <div className="font-bold text-purple-900 text-sm">
                                        {airQualityData.data.current.pm10?.toFixed(1) || 'N/A'} μg/m³
                                    </div>
                                </div>
                                <div className="bg-red-50 p-2 rounded">
                                    <div className="text-xs text-red-600 font-semibold">CO</div>
                                    <div className="font-bold text-red-900 text-sm">
                                        {airQualityData.data.current.carbon_monoxide?.toFixed(0) || 'N/A'} μg/m³
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-gray-400 text-center pt-2 border-t">
                            🌫️ Real-time air quality data
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default function InteractiveMap({
    defaultCenter = [-2.5, 118.0], // Indonesia center
    defaultZoom = 5,
    defaultLayer = 'truecolor',
    height = '600px',
    showControls = true,
    externalLayer,
    externalDate,
    externalShowAirQuality,
    externalBaseMapStyle,
    userLocation,
    onLocationDetected,
}: InteractiveMapProps) {
    const [mounted, setMounted] = useState(false);
    const [activeLayer, setActiveLayer] = useState<GIBSLayerType>(defaultLayer);
    const [selectedDate, setSelectedDate] = useState(
        new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
    );
    const [showAirQuality, setShowAirQuality] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
    const [mapZoom, setMapZoom] = useState(defaultZoom);
    const [baseMapStyle, setBaseMapStyle] = useState<'osm' | 'mapbox-streets' | 'mapbox-satellite' | 'cartodb' | 'esri'>(() => externalBaseMapStyle ?? 'osm');
    const [currentZoom, setCurrentZoom] = useState(defaultZoom);

    // Ref untuk menyimpan instance Leaflet map
    const [map, setMap] = useState<L.Map | null>(null);

    // NDVI visualization controls
    const [ndviOpacity, setNdviOpacity] = useState(0.7);
    const [ndviCellSize, setNdviCellSize] = useState(0.003); // Default: 330m resolution for 5km area

    // Update center when userLocation changes
    useEffect(() => {
        if (userLocation) {
            setMapCenter([userLocation.lat, userLocation.lng]);
            setMapZoom(10);
        }
    }, [userLocation]);

    useEffect(() => {
        if (map && activeLayer) {
            const config = GIBS_LAYERS[activeLayer];
            if (config && typeof config.maxZoom === 'number') {
                // Only increase maxZoom if the layer supports a higher value.
                // Avoid lowering the map maxZoom which can make zooming feel stuck.
                try {
                    const currentMax = (map as any).getMaxZoom ? map.getMaxZoom() : undefined;
                    if (typeof currentMax === 'number') {
                        if (config.maxZoom > currentMax) {
                            console.log(`Increasing map maxZoom from ${currentMax} to ${config.maxZoom}`);
                            map.setMaxZoom(config.maxZoom);
                        }
                    } else {
                        // Fallback: set maxZoom if we can't read current value
                        map.setMaxZoom(config.maxZoom);
                    }
                } catch (e) {
                    // Defensive: if any error occurs, still attempt to set maxZoom
                    console.warn('Error reading current map maxZoom, setting to layer value', e);
                    map.setMaxZoom(config.maxZoom);
                }
            }
        }
    }, [map, activeLayer]);

    // Sync with external controls if provided
    useEffect(() => {
        if (externalLayer) setActiveLayer(externalLayer);
    }, [externalLayer]);

    useEffect(() => {
        if (externalDate) setSelectedDate(externalDate);
    }, [externalDate]);

    useEffect(() => {
        if (externalShowAirQuality !== undefined) setShowAirQuality(externalShowAirQuality);
    }, [externalShowAirQuality]);    // Only render map on client-side

    // Sync external base map style when provided
    useEffect(() => {
        if (externalBaseMapStyle && externalBaseMapStyle !== baseMapStyle) {
            setBaseMapStyle(externalBaseMapStyle);
        }
    }, [externalBaseMapStyle]);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className="w-full bg-gray-100 flex items-center justify-center rounded-lg"
                style={{ height }}
            >
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">🌍</div>
                    <div className="text-gray-600">Loading map...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full" style={{ height }}>
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="w-full h-full rounded-lg shadow-lg"
                style={{ height: '100%' }}
                zoomControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                touchZoom={true}
                dragging={true}
                minZoom={2}
                maxZoom={18}
                wheelPxPerZoomLevel={60}
                zoomSnap={0.5}
                zoomDelta={0.5}
                wheelDebounceTime={40}
                ref={setMap}
            >
                {/* Zoom Tracker */}
                <ZoomTracker onZoomChange={setCurrentZoom} />
                {/* Base Layer - Multiple Options */}
                {baseMapStyle === 'osm' && (
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        opacity={activeLayer === 'ndvi' ? 0.5 : 1}
                    />
                )}

                {baseMapStyle === 'mapbox-streets' && (
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
                        opacity={activeLayer === 'ndvi' ? 0.5 : 1}
                        tileSize={512}
                        zoomOffset={-1}
                    />
                )}

                {baseMapStyle === 'mapbox-satellite' && (
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
                        opacity={activeLayer === 'ndvi' ? 0.5 : 1}
                        tileSize={512}
                        zoomOffset={-1}
                    />
                )}

                {baseMapStyle === 'cartodb' && (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        opacity={activeLayer === 'ndvi' ? 0.5 : 1}
                        maxZoom={20}
                    />
                )}

                {baseMapStyle === 'esri' && (
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        opacity={activeLayer === 'ndvi' ? 0.5 : 1}
                        maxZoom={18}
                    />
                )}

                {/* NASA GIBS Layer - hanya untuk layer non-NDVI */}
                {activeLayer !== 'ndvi' && (
                    <GIBSTileLayer layerType={activeLayer} date={selectedDate} />
                )}

                {/* NDVI Grid Overlay - tampilkan saat layer NDVI aktif */}
                {activeLayer === 'ndvi' && (
                    <NDVIGridOverlay
                        latitude={mapCenter[0]}
                        longitude={mapCenter[1]}
                        gridSize={0.07}
                        cellSize={ndviCellSize}
                        opacity={ndviOpacity}
                        selectedDate={selectedDate}
                        key={`ndvi-${mapCenter[0]}-${mapCenter[1]}-${ndviCellSize}-${selectedDate}`}
                    />
                )}

                {/* User Location Marker */}
                <UserLocationMarker
                    location={userLocation || null}
                    onLocationDetected={onLocationDetected}
                    selectedDate={selectedDate}
                />

                {/* Air Quality Markers */}
                {showAirQuality && MONITORING_LOCATIONS.map((location) => (
                    <AirQualityMarker
                        key={location.id}
                        location={location}
                        selectedDate={selectedDate}
                    />
                ))}
            </MapContainer>

            {/* Base Map Selector moved to parent (MapPage) - controlled through externalBaseMapStyle prop */}

            {/* Zoom Control */}
            <Card className="absolute bottom-24 right-4 z-[1000] p-2 bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => {
                            if (map) {
                                map.zoomIn();
                            }
                        }}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all shadow-sm hover:shadow-md"
                        title="Zoom In"
                    >
                        +
                    </button>
                    <div className="px-3 py-1 bg-gray-100 text-center text-xs font-semibold rounded">
                        {currentZoom.toFixed(0)}
                    </div>
                    <button
                        onClick={() => {
                            if (map) {
                                map.zoomOut();
                            }
                        }}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all shadow-sm hover:shadow-md"
                        title="Zoom Out"
                    >
                        −
                    </button>
                </div>
            </Card>

            {/* Layer Control Panel - Only show if showControls is true */}
            {showControls && (
                <LayerControlPanel
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
                />
            )}

            {/* Legend - Only show if showControls is true */}
            {showControls && (
                <>
                    {/* NDVI Legend - Show when NDVI layer is active */}
                    {activeLayer === 'ndvi' && <NDVILegend isVisible={true} />}

                    {/* Air Quality Legend - Show when not NDVI layer */}
                    {activeLayer !== 'ndvi' && (
                        <Card className="absolute bottom-4 left-4 z-[1000] p-3 bg-white/95 backdrop-blur-sm shadow-lg">
                            <div className="text-xs font-semibold mb-2">Air Quality Legend</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                    <span>Good (0-12 μg/m³)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                                    <span>Moderate (12-35 μg/m³)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                                    <span>Unhealthy (35-55 μg/m³)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                    <span>Very Unhealthy (55+ μg/m³)</span>
                                </div>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
