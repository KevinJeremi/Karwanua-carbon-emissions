"use client";

import { useEffect, useState } from 'react';
import { useMap, Rectangle, Popup } from 'react-leaflet';
import L from 'leaflet';

interface NDVIGridOverlayProps {
    latitude: number;
    longitude: number;
    gridSize?: number; // Size of grid in degrees
    cellSize?: number; // Size of each cell in degrees (default: 0.01° ≈ 1km)
    opacity?: number; // Opacity of the grid overlay (0-1)
    selectedDate?: string; // YYYY-MM-DD format for historical data
}

interface NDVICell {
    bounds: L.LatLngBoundsExpression;
    value: number;
    color: string;
    label: string;
}

/**
 * Mengkonversi nilai NDVI ke warna dengan gradasi lebih detail
 * Menggunakan skala warna yang lebih kontras untuk visualisasi optimal
 */
function getNDVIColor(ndvi: number): { color: string; label: string } {
    // Very Dense Vegetation (>0.7)
    if (ndvi >= 0.7) {
        return { color: '#004d00', label: 'Very Dense Vegetation' }; // Very Dark Green
    }
    // Dense Vegetation (0.6-0.7)
    else if (ndvi >= 0.6) {
        return { color: '#006400', label: 'Dense Vegetation' }; // Dark Green
    }
    // Healthy Vegetation (0.5-0.6)
    else if (ndvi >= 0.5) {
        return { color: '#228B22', label: 'Healthy Vegetation' }; // Forest Green
    }
    // Moderate Vegetation (0.4-0.5)
    else if (ndvi >= 0.4) {
        return { color: '#32CD32', label: 'Moderate Vegetation' }; // Lime Green
    }
    // Light Vegetation (0.3-0.4)
    else if (ndvi >= 0.3) {
        return { color: '#90EE90', label: 'Light Vegetation' }; // Light Green
    }
    // Sparse Vegetation (0.2-0.3)
    else if (ndvi >= 0.2) {
        return { color: '#ADFF2F', label: 'Sparse Vegetation' }; // Green Yellow
    }
    // Very Sparse (0.1-0.2)
    else if (ndvi >= 0.1) {
        return { color: '#FFD700', label: 'Very Sparse' }; // Gold
    }
    // Minimal Vegetation (0.0-0.1)
    else if (ndvi >= 0.0) {
        return { color: '#FFA500', label: 'Minimal Vegetation' }; // Orange
    }
    // Bare Soil/Rock (-0.1-0.0)
    else if (ndvi >= -0.1) {
        return { color: '#CD853F', label: 'Bare Soil' }; // Peru
    }
    // Water/Snow (<-0.1)
    else {
        return { color: '#4169E1', label: 'Water/Snow' }; // Royal Blue
    }
}

/**
 * Simulasi nilai NDVI untuk area sekitar lokasi
 * Di production, ini akan mengambil data dari NASA MODIS API
 */
function simulateNDVIForCell(lat: number, lng: number): number {
    // Simulasi berdasarkan lokasi geografis
    // Area ekuator Indonesia cenderung memiliki NDVI tinggi (forest)
    const baseNDVI = 0.6; // Base high vegetation

    // Tambahkan variasi random untuk simulasi
    const randomVariation = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2

    // Pertimbangkan latitude (lebih ke kutub = lebih rendah NDVI)
    const latitudeFactor = Math.cos((lat * Math.PI) / 180) * 0.1;

    // Pertimbangkan longitude untuk variasi
    const longitudeVariation = Math.sin((lng * Math.PI) / 90) * 0.05;

    const ndvi = baseNDVI + randomVariation + latitudeFactor + longitudeVariation;

    // Clamp antara -0.2 dan 1.0
    return Math.max(-0.2, Math.min(1.0, ndvi));
}

export function NDVIGridOverlay({
    latitude,
    longitude,
    gridSize = 0.07, // 0.07 degrees (~8km radius, 16x16km total area)
    cellSize = 0.003, // 0.003 degrees (~330m per cell) - high resolution
    opacity = 0.7, // Default opacity 70%
    selectedDate
}: NDVIGridOverlayProps) {
    const map = useMap();
    const [cells, setCells] = useState<NDVICell[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const fetchNDVIGrid = async () => {
            setIsLoading(true);
            setLoadingProgress(0);
            try {
                console.log(`🌳 Fetching NDVI grid data for (${latitude}, ${longitude})...`);
                console.log(`📊 Grid: ${gridSize}°, Cell: ${cellSize}°`);

                setLoadingProgress(30);

                const dateParam = selectedDate ? `&date=${selectedDate}` : '';
                const response = await fetch(
                    `/api/ndvi-grid?latitude=${latitude}&longitude=${longitude}&gridSize=${gridSize}&cellSize=${cellSize}&maxCells=5000${dateParam}`
                );

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                setLoadingProgress(60);
                const data = await response.json();
                console.log(`✅ Received ${data.totalCells} NDVI cells from ${data.metadata.source}`);
                console.log(`🔍 Resolution: ${data.metadata.resolution}`);

                setLoadingProgress(80);
                const newCells: NDVICell[] = data.cells.map((cell: any) => ({
                    bounds: [
                        [cell.lat - cellSize / 2, cell.lng - cellSize / 2],
                        [cell.lat + cellSize / 2, cell.lng + cellSize / 2]
                    ],
                    value: cell.ndvi,
                    color: cell.color,
                    label: cell.label
                }));

                setCells(newCells);
                setLoadingProgress(100);
            } catch (error) {
                console.error('❌ Error fetching NDVI grid:', error);
                setCells([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNDVIGrid();
    }, [latitude, longitude, gridSize, cellSize, selectedDate]);

    if (isLoading) {
        return (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textAlign: 'center',
                minWidth: '250px'
            }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌳</div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Loading NDVI Grid...</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    Fetching vegetation data from NASA MODIS
                </div>
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${loadingProgress}%`,
                        height: '100%',
                        backgroundColor: '#22c55e',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>
                    {loadingProgress}%
                </div>
            </div>
        );
    }

    return (
        <>
            {cells.map((cell, index) => (
                <Rectangle
                    key={`cell-${index}`}
                    bounds={cell.bounds}
                    pathOptions={{
                        fillColor: cell.color,
                        fillOpacity: opacity,
                        color: cell.color,
                        weight: 0.3,
                        opacity: opacity * 0.6
                    }}
                    eventHandlers={{
                        mouseover: (e) => {
                            const layer = e.target;
                            layer.setStyle({
                                weight: 2,
                                color: '#000',
                                fillOpacity: Math.min(opacity + 0.2, 1)
                            });
                        },
                        mouseout: (e) => {
                            const layer = e.target;
                            layer.setStyle({
                                weight: 0.3,
                                color: cell.color,
                                fillOpacity: opacity
                            });
                        }
                    }}
                >
                    <Popup>
                        <div className="text-sm min-w-[180px]">
                            <div className="font-bold mb-2 flex items-center gap-2 pb-2 border-b">
                                <div
                                    className="w-5 h-5 rounded border-2 border-gray-400 shadow-sm"
                                    style={{ backgroundColor: cell.color }}
                                />
                                <span className="text-green-900">{cell.label}</span>
                            </div>
                            <div className="text-xs space-y-2 mt-2">
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="font-semibold text-green-900">NDVI Value</div>
                                    <div className="text-lg font-bold text-green-700">{cell.value.toFixed(3)}</div>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 pt-1">
                                    <span>🛰️</span>
                                    <span className="text-xs">NASA MODIS Terra/Aqua</span>
                                </div>
                                <div className="text-xs text-gray-500 italic">
                                    Click to view detailed vegetation health
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Rectangle>
            ))}
        </>
    );
}
