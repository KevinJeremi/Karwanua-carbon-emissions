/**
 * Custom Hook for NDVI Data
 * Fetch NASA MODIS NDVI (Vegetation Index) data
 */

import { useState, useEffect, useCallback } from 'react';

export interface NDVIDataPoint {
    date: string;
    ndvi: number;
    quality: string;
}

export interface NDVIData {
    location: {
        latitude: number;
        longitude: number;
        name?: string;
    };
    currentNDVI: number;
    ndviStatus: string;
    vegetationHealth: string;
    colorCode: string;
    trend: NDVIDataPoint[];
    lastUpdate: string;
    source: string;
}

interface UseNDVIOptions {
    latitude: number;
    longitude: number;
    locationName?: string;
    autoFetch?: boolean;
    date?: string; // YYYY-MM-DD format for historical data
}

interface UseNDVIReturn {
    data: NDVIData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useNDVI({
    latitude,
    longitude,
    locationName,
    autoFetch = true,
    date
}: UseNDVIOptions): UseNDVIReturn {
    const [data, setData] = useState<NDVIData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNDVI = useCallback(async () => {
        if (!latitude || !longitude) {
            setError('Latitude and longitude are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
            });

            if (locationName) {
                params.append('name', locationName);
            }

            if (date) {
                params.append('date', date);
                console.log('🌿 Fetching NDVI for date:', date); // Debug log
            }

            const response = await fetch(`/api/nasa-modis-ndvi?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('🌿 NDVI Data received:', result); // Debug log
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NDVI data';
            setError(errorMessage);
            console.error('NDVI fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [latitude, longitude, locationName, date]);

    useEffect(() => {
        if (autoFetch && latitude && longitude) {
            console.log('🌿 NDVI useEffect triggered with date:', date); // Debug log
            fetchNDVI();
        }
    }, [autoFetch, fetchNDVI]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchNDVI
    };
}
