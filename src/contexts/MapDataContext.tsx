/**
 * MapDataContext
 * Centralized context for NDVI and Air Quality data synchronization
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAirQuality } from '@/hooks/useAirQuality';
import { useNDVI } from '@/hooks/useNDVI';
import type { AirQualityResponse } from '@/types/air-quality';
import type { NDVIData } from '@/hooks/useNDVI';

interface MapDataContextValue {
    // Air Quality
    airQualityData: AirQualityResponse | null;
    airQualityLoading: boolean;
    airQualityError: string | null;
    refetchAirQuality: () => Promise<void>;

    // NDVI
    ndviData: NDVIData | null;
    ndviLoading: boolean;
    ndviError: string | null;
    refetchNDVI: () => Promise<void>;

    // Shared state
    selectedDate: string;
    location: { lat: number; lng: number; city: string } | null;
}

const MapDataContext = createContext<MapDataContextValue | undefined>(undefined);

interface MapDataProviderProps {
    children: ReactNode;
    location: { lat: number; lng: number; city: string } | null;
    selectedDate: string;
}

export function MapDataProvider({ children, location, selectedDate }: MapDataProviderProps) {
    // Fetch Air Quality data
    const {
        data: airQualityData,
        isLoading: airQualityLoading,
        error: airQualityError,
        refetch: refetchAirQuality,
    } = useAirQuality({
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        locationName: location?.city || 'Unknown',
        autoFetch: !!location,
        date: selectedDate,
    });

    // Fetch NDVI data
    const {
        data: ndviData,
        isLoading: ndviLoading,
        error: ndviError,
        refetch: refetchNDVI,
    } = useNDVI({
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        locationName: location?.city,
        autoFetch: !!location,
        date: selectedDate,
    });

    const value: MapDataContextValue = {
        airQualityData,
        airQualityLoading,
        airQualityError,
        refetchAirQuality,
        ndviData,
        ndviLoading,
        ndviError,
        refetchNDVI,
        selectedDate,
        location,
    };

    return <MapDataContext.Provider value={value}>{children}</MapDataContext.Provider>;
}

export function useMapData() {
    const context = useContext(MapDataContext);
    if (context === undefined) {
        throw new Error('useMapData must be used within a MapDataProvider');
    }
    return context;
}
