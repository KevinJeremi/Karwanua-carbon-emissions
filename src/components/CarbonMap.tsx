"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Info, MapPin, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

// Fix default icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom user location icon
const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface CarbonMapProps {
    userLocation: { lat: number; lng: number } | null;
    onLocationDetected?: (location: { lat: number; lng: number; city: string }) => void;
}

// Component to handle map recenter when location changes
function RecenterMap({ location }: { location: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView([location.lat, location.lng], 10, { animate: true });
        }
    }, [location, map]);
    return null;
}

// Simulated carbon hotspots (in real app, fetch from NASA API)
const carbonHotspots = [
    { lat: 1.4927, lng: 124.8421, co2: 425, name: "Manado Industrial Area", severity: "high" },
    { lat: 1.5074, lng: 124.9214, co2: 418, name: "Malalayang", severity: "medium" },
    { lat: 1.4748, lng: 124.8421, co2: 410, name: "Wenang", severity: "medium" },
    { lat: 1.4558, lng: 124.8095, co2: 432, name: "Port Area", severity: "critical" },
];

export function CarbonMap({ userLocation, onLocationDetected }: CarbonMapProps) {
    const [mounted, setMounted] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [showLegend, setShowLegend] = useState(true);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get city name from coordinates using reverse geocoding
    const getCityName = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
            );
            const data = await response.json();
            return data.address?.city || data.address?.town || data.address?.county || "Unknown Location";
        } catch (error) {
            console.error("Error fetching city name:", error);
            return "Unknown Location";
        }
    };

    // Auto-detect user location on mount
    useEffect(() => {
        if (!userLocation && !isDetecting && mounted) {
            setIsDetecting(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        const city = await getCityName(location.lat, location.lng);
                        if (onLocationDetected) {
                            onLocationDetected({ ...location, city });
                        }
                        setIsDetecting(false);
                    },
                    (error) => {
                        console.error("GPS Error:", error);
                        // Fallback to Manado, Indonesia if GPS denied
                        const fallbackLocation = { lat: 1.4927, lng: 124.8421 };
                        getCityName(fallbackLocation.lat, fallbackLocation.lng).then((city) => {
                            if (onLocationDetected) {
                                onLocationDetected({ ...fallbackLocation, city });
                            }
                        });
                        setIsDetecting(false);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            }
        }
    }, [userLocation, isDetecting, mounted, onLocationDetected]);

    // Don't render map on server-side
    if (!mounted) {
        return (
            <div className="w-full h-full bg-greenish-dark/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-greenish-light border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-greenish-mid font-medium">Loading Map...</p>
                </div>
            </div>
        );
    }

    const defaultCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [1.4927, 124.8421]; // Default to Manado

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            {/* Legend Panel */}
            {showLegend && (
                <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <Info className="w-4 h-4 text-emerald-600" />
                            Map Legend
                        </h3>
                        <button
                            onClick={() => setShowLegend(false)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        {/* User Location */}
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-800">Lokasi Anda</p>
                                <p className="text-gray-600">Marker biru menunjukkan posisi Anda saat ini</p>
                            </div>
                        </div>

                        {/* Detection Radius */}
                        <div className="flex items-start gap-2">
                            <div className="w-4 h-4 border-2 border-emerald-500 border-dashed rounded-full flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-800">Radius Deteksi (5km)</p>
                                <p className="text-gray-600">Area hijau putus-putus untuk deteksi karbon</p>
                            </div>
                        </div>

                        {/* Carbon Hotspots */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                            <p className="font-semibold text-gray-800">Hotspot CO₂:</p>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <span className="font-medium text-gray-800">Critical</span>
                                    <span className="text-gray-500 ml-1">({">"} 430 ppm)</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-500 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <span className="font-medium text-gray-800">High</span>
                                    <span className="text-gray-500 ml-1">(420-430 ppm)</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <span className="font-medium text-gray-800">Medium</span>
                                    <span className="text-gray-500 ml-1">(410-420 ppm)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowGuide(true)}
                        className="w-full mt-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                        📖 Cara Penggunaan
                    </button>
                </div>
            )}

            {/* Toggle Legend Button (when hidden) */}
            {!showLegend && (
                <button
                    onClick={() => setShowLegend(true)}
                    className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2 hover:bg-white transition-colors"
                    title="Show Legend"
                >
                    <Info className="w-5 h-5 text-emerald-600" />
                </button>
            )}

            {/* Usage Guide Modal */}
            {showGuide && (
                <div
                    className="absolute inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowGuide(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                    📖 Panduan Penggunaan Carbon Map
                                </h2>
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="text-white/80 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Step 1 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-600 font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Aktifkan Lokasi GPS</h3>
                                    <p className="text-sm text-gray-600">
                                        Izinkan browser untuk mengakses lokasi Anda agar peta dapat menampilkan posisi dan data karbon di area Anda.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-600 font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Navigasi Peta</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Gunakan kontrol berikut untuk menjelajahi peta:
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1 ml-2">
                                        <li>• <strong>Zoom:</strong> Scroll mouse atau gunakan tombol +/- di peta</li>
                                        <li>• <strong>Pan:</strong> Klik dan drag untuk menggeser peta</li>
                                        <li>• <strong>Reset:</strong> Klik marker biru untuk kembali ke lokasi Anda</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-600 font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Lihat Hotspot CO₂</h3>
                                    <p className="text-sm text-gray-600">
                                        Lingkaran berwarna menunjukkan area dengan konsentrasi CO₂ tinggi. Klik pada lingkaran untuk melihat detail tingkat CO₂ dan severity level.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-600 font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Interpretasi Data</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Pahami level CO₂ berdasarkan warna:
                                    </p>
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex items-center gap-2 bg-red-50 p-2 rounded">
                                            <XCircle className="w-4 h-4 text-red-500" />
                                            <span><strong>Merah (Critical):</strong> Perlu tindakan segera</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-orange-50 p-2 rounded">
                                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                                            <span><strong>Orange (High):</strong> Perhatian khusus diperlukan</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded">
                                            <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                                            <span><strong>Kuning (Medium):</strong> Monitoring rutin</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                                <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                    💡 Tips
                                </h3>
                                <ul className="text-xs text-emerald-700 space-y-1">
                                    <li>• Refresh halaman jika data tidak muncul</li>
                                    <li>• Data diperbarui secara real-time berdasarkan lokasi</li>
                                    <li>• Gunakan fitur AI Assistant untuk analisis lebih lanjut</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setShowGuide(false)}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MapContainer
                center={defaultCenter}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                    <>
                        <RecenterMap location={userLocation} />
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold text-blue-600">📍 You Are Here</p>
                                    <p className="text-xs text-gray-600">
                                        {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Carbon detection radius circle */}
                        <Circle
                            center={[userLocation.lat, userLocation.lng]}
                            radius={5000}
                            pathOptions={{
                                color: "#26a05b",
                                fillColor: "#26a05b",
                                fillOpacity: 0.1,
                                weight: 2,
                                dashArray: "5, 5",
                            }}
                        />
                    </>
                )}

                {/* Carbon hotspots */}
                {carbonHotspots.map((spot, idx) => {
                    const color =
                        spot.severity === "critical"
                            ? "#ef4444"
                            : spot.severity === "high"
                                ? "#f59e0b"
                                : "#fbbf24";

                    return (
                        <Circle
                            key={idx}
                            center={[spot.lat, spot.lng]}
                            radius={2000}
                            pathOptions={{
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.3,
                                weight: 1,
                            }}
                        >
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold text-red-600">{spot.name}</p>
                                    <p className="text-sm">CO₂: {spot.co2} ppm</p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        Severity: {spot.severity}
                                    </p>
                                </div>
                            </Popup>
                        </Circle>
                    );
                })}
            </MapContainer>
        </div>
    );
}
