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
    latitude?: number;
    longitude?: number;
}

/**
 * Helper function to determine region based on coordinates
 */
function getRegionFromCoordinates(lat: number, lng: number): string {
    // Southeast Asia region bounds (approximate)
    if (lat >= -10 && lat <= 20 && lng >= 90 && lng <= 150) {
        // Indonesia specific bounds
        if (lat >= -12 && lat <= 6 && lng >= 95 && lng <= 145) {
            return 'Indonesia';
        }
        return 'Southeast Asia';
    }
    
    // Other regions can be added as needed
    if (lat >= 35 && lat <= 70 && lng >= -10 && lng <= 40) {
        return 'Europe';
    }
    if (lat >= 15 && lat <= 70 && lng >= -170 && lng <= -50) {
        return 'North America';
    }
    if (lat >= -60 && lat <= 15 && lng >= -85 && lng <= -30) {
        return 'South America';
    }
    if (lat >= -35 && lat <= 40 && lng >= -20 && lng <= 55) {
        return 'Africa';
    }
    if (lat >= -50 && lat <= 10 && lng >= 110 && lng <= 180) {
        return 'Oceania';
    }
    if (lat >= 60 && lat <= 90) {
        return 'Arctic';
    }
    
    return 'Global';
}

/**
 * Custom hook to fetch the latest temperature anomaly data for a specific region.
 * @param {UseTemperatureDataProps} props - Hook properties.
 * @returns {UseTemperatureDataReturn} - The state and methods for temperature data.
 */
export function useTemperatureData({
    region = 'Global',
    autoFetch = false,
    latitude,
    longitude,
}: UseTemperatureDataProps): UseTemperatureDataReturn {
    const [data, setData] = useState<TemperatureAnomaly | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (fetchRegion?: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Determine region based on coordinates if available
            let targetRegion = fetchRegion || region;
            if (!fetchRegion && latitude && longitude) {
                targetRegion = getRegionFromCoordinates(latitude, longitude);
                console.log(`Determined region from coordinates: ${targetRegion} (${latitude}, ${longitude})`);
            }
            
            const params = new URLSearchParams({ 
                region: targetRegion,
                startYear: '2024', // Get recent data
                endYear: new Date().getFullYear().toString()
            });
            
            console.log(`Fetching temperature data with params: ${params.toString()}`);
            const response = await fetch(`/api/temperature-anomaly?${params.toString()}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch temperature data: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('Temperature API Response:', result); // Debug log
            
            if (result.success && result.currentAnomaly !== undefined) {
                // Transform API response to match our interface
                const currentYear = new Date().getFullYear();
                const transformedData: TemperatureAnomaly = {
                    year: currentYear,
                    value: result.currentAnomaly
                };
                console.log('Transformed temperature data:', transformedData); // Debug log
                setData(transformedData);
            } else if (!result.success) {
                throw new Error(result.error || 'Unknown error occurred');
            } else {
                console.log('No temperature data found in response');
                setData(null); // No data available
            }
        } catch (err: any) {
            console.error('Temperature fetch error:', err);
            setError(err.message);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [region, latitude, longitude]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return { data, isLoading, error, fetchData: (r) => fetchData(r) };
}
