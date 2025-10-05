'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AirQualityResponse, AirQualityAssessment, AirQualityStatus } from '@/types/air-quality';

interface UseAirQualityOptions {
    latitude: number;
    longitude: number;
    locationName?: string;
    autoFetch?: boolean;
    refetchInterval?: number; // in milliseconds
    date?: string; // YYYY-MM-DD format for historical data
}

interface UseAirQualityReturn {
    data: AirQualityResponse | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    assessment: AirQualityAssessment | null;
}

/**
 * Custom hook untuk mengambil data Air Quality dari Open-Meteo API
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAirQuality({
 *   latitude: -6.2088,
 *   longitude: 106.8456,
 *   locationName: 'Jakarta'
 * });
 * ```
 */
export function useAirQuality({
    latitude,
    longitude,
    locationName = 'Unknown',
    autoFetch = true,
    refetchInterval,
    date,
}: UseAirQualityOptions): UseAirQualityReturn {
    const [data, setData] = useState<AirQualityResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAirQuality = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                location: locationName,
            });

            if (date) {
                params.append('date', date);
                console.log('🌫️ Fetching Air Quality for date:', date); // Debug log
            }

            const response = await fetch(`/api/air-quality?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: AirQualityResponse = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch air quality data');
            }

            console.log('🌫️ Air Quality Data received:', result); // Debug log
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching air quality:', err);
        } finally {
            setIsLoading(false);
        }
    }, [latitude, longitude, locationName, date]);

    // Auto fetch on mount if enabled
    useEffect(() => {
        if (autoFetch) {
            console.log('🌫️ Air Quality useEffect triggered with date:', date); // Debug log
            fetchAirQuality();
        }
    }, [autoFetch, fetchAirQuality]);

    // Auto refetch interval
    useEffect(() => {
        if (refetchInterval && refetchInterval > 0) {
            const interval = setInterval(() => {
                fetchAirQuality();
            }, refetchInterval);

            return () => clearInterval(interval);
        }
    }, [refetchInterval, fetchAirQuality]);

    // Calculate air quality assessment based on PM2.5 levels
    const assessment: AirQualityAssessment | null = data?.data?.current?.pm2_5 != null
        ? getAirQualityAssessment(data.data.current.pm2_5)
        : null;

    return {
        data,
        isLoading,
        error,
        refetch: fetchAirQuality,
        assessment,
    };
}

/**
 * Helper function untuk menentukan status kualitas udara berdasarkan PM2.5
 * Berdasarkan standar WHO dan US EPA
 */
function getAirQualityAssessment(pm25: number): AirQualityAssessment {
    let status: AirQualityStatus;
    let color: string;
    let message: string;

    if (pm25 <= 12) {
        status = 'Good';
        color = '#10b981'; // green-500
        message = 'Air quality is satisfactory, and air pollution poses little or no risk.';
    } else if (pm25 <= 35.4) {
        status = 'Moderate';
        color = '#fbbf24'; // yellow-400
        message = 'Air quality is acceptable. However, there may be a risk for some people.';
    } else if (pm25 <= 55.4) {
        status = 'Unhealthy';
        color = '#f97316'; // orange-500
        message = 'Members of sensitive groups may experience health effects.';
    } else if (pm25 <= 150.4) {
        status = 'Very Unhealthy';
        color = '#ef4444'; // red-500
        message = 'Health alert: The risk of health effects is increased for everyone.';
    } else {
        status = 'Hazardous';
        color = '#7f1d1d'; // red-900
        message = 'Health warning of emergency conditions. Everyone is more likely to be affected.';
    }

    return {
        status,
        color,
        message,
        pm25Level: pm25,
    };
}

/**
 * Hook untuk multiple locations
 */
export function useMultipleAirQuality(locations: UseAirQualityOptions[]) {
    const [results, setResults] = useState<UseAirQualityReturn[]>([]);

    useEffect(() => {
        // This would need a more sophisticated implementation
        // For now, just return empty array
        setResults([]);
    }, [locations]);

    return results;
}
