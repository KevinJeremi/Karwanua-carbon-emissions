/**
 * Optimized Map Markers with React.memo
 * Prevents unnecessary re-renders for better performance
 */

'use client';

import React, { useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAirQuality } from '@/hooks/useAirQuality';
import type { MapLocation } from '@/types/gibs-layers';

// Memoized Air Quality Marker Component
export const AirQualityMarker = React.memo(
    ({ location, selectedDate }: { location: MapLocation; selectedDate?: string }) => {
        const { data, isLoading, assessment } = useAirQuality({
            latitude: location.latitude,
            longitude: location.longitude,
            locationName: location.name,
            autoFetch: true,
            date: selectedDate,
        });

        // Memoize icon creation
        const getMarkerIcon = useCallback(() => {
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
        }, [assessment?.color]);

        return (
            <Marker position={[location.latitude, location.longitude]} icon={getMarkerIcon()}>
                <Popup>
                    <div className="min-w-[200px]">
                        <h3 className="font-bold text-lg mb-2">📍 {location.name}</h3>

                        {isLoading ? (
                            <div className="text-sm text-gray-500">Loading air quality...</div>
                        ) : data?.data ? (
                            <div className="space-y-2">
                                {assessment && (
                                    <div
                                        className="p-2 rounded font-semibold text-white text-center"
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
    },
    // Custom comparison function for memo
    (prevProps, nextProps) => {
        return (
            prevProps.location.id === nextProps.location.id &&
            prevProps.selectedDate === nextProps.selectedDate
        );
    }
);

AirQualityMarker.displayName = 'AirQualityMarker';

// Memoized User Location Marker
export const UserLocationMarkerIcon = React.memo(
    ({
        position,
        locationName,
        airQualityColor,
    }: {
        position: [number, number];
        locationName: string;
        airQualityColor?: string;
    }) => {
        const getUserLocationIcon = useCallback(() => {
            const color = airQualityColor || '#10b981';
            const iconHtml = `
        <div class="user-location-marker">
          <div style="
            position: relative;
            width: 40px;
            height: 40px;
          ">
            <!-- Ripple animation -->
            <div style="
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background-color: ${color};
              opacity: 0.3;
              animation: ripple 1.5s ease-out infinite;
            "></div>
            
            <!-- Main marker -->
            <div style="
              position: absolute;
              width: 40px;
              height: 40px;
              background-color: ${color};
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              z-index: 10;
            ">
              📍
            </div>
          </div>
        </div>
      `;

            return L.divIcon({
                html: iconHtml,
                className: 'user-location-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20],
            });
        }, [airQualityColor]);

        return (
            <Marker position={position} icon={getUserLocationIcon()}>
                <Popup>
                    <div className="min-w-[180px]">
                        <h3 className="font-bold text-base mb-1">📍 Your Location</h3>
                        <p className="text-sm text-gray-600">{locationName}</p>
                    </div>
                </Popup>
            </Marker>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.position[0] === nextProps.position[0] &&
            prevProps.position[1] === nextProps.position[1] &&
            prevProps.locationName === nextProps.locationName &&
            prevProps.airQualityColor === nextProps.airQualityColor
        );
    }
);

UserLocationMarkerIcon.displayName = 'UserLocationMarkerIcon';
