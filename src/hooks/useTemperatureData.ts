import { useState, useEffect, useCallback } from 'react';

// Define the structure of the temperature anomaly data from the API
export interface TemperatureAnomaly {
    year: number;
    value: number;
}

// Define the structure for the hook's return value
interface UseTemperatureDataReturn {
    data: TemperatureAnomaly | null; // We expect a single latest anomaly value for the map popup
    isLoading: boolean;
    error: string | null;
    fetchData: (region?: string) => void;
}

interface UseTemperatureDataProps {
    region?: string;
    autoFetch?: boolean;
}

/**
 * Custom hook to fetch the latest temperature anomaly data for a specific region.
 * @param {UseTemperatureDataProps} props - Hook properties.
 * @returns {UseTemperatureDataReturn} - The state and methods for temperature data.
 */
export function useTemperatureData({
    region = 'Global',
    autoFetch = false,
}: UseTemperatureDataProps): UseTemperatureDataReturn {
    const [data, setData] = useState<TemperatureAnomaly | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (fetchRegion: string = region) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ region: fetchRegion });
            const response = await fetch(`/api/temperature-anomaly?${params.toString()}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch temperature data: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                // For the map, we only care about the most recent anomaly value
                const latestData = result.data[result.data.length - 1];
                setData(latestData);
            } else if (!result.success) {
                throw new Error(result.error || 'Unknown error occurred');
            } else {
                setData(null); // No data available
            }
        } catch (err: any) {
            setError(err.message);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [region]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return { data, isLoading, error, fetchData: (r) => fetchData(r || region) };
}
