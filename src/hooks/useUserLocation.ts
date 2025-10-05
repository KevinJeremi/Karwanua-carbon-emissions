/**
 * useUserLocation Hook
 * Manages user location detection and GPS functionality
 */

import { useState, useEffect, useCallback } from 'react';

export interface UserLocation {
    lat: number;
    lng: number;
    city: string;
}

interface UseUserLocationOptions {
    autoDetect?: boolean;
    onLocationDetected?: (location: UserLocation) => void;
}

interface UseUserLocationReturn {
    location: UserLocation | null;
    isDetecting: boolean;
    error: string | null;
    detectLocation: () => Promise<void>;
    recenter: () => void;
}

export function useUserLocation({
    autoDetect = true,
    onLocationDetected,
}: UseUserLocationOptions = {}): UseUserLocationReturn {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const detectLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsDetecting(true);
        setError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });

            const newLocation: UserLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                city: location?.city || 'Your Location',
            };

            // Try to get city name from reverse geocoding
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${newLocation.lat}&lon=${newLocation.lng}&format=json`
                );
                const data = await response.json();
                if (data.address) {
                    newLocation.city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.county ||
                        'Your Location';
                }
            } catch (geocodeError) {
                console.warn('Failed to get city name:', geocodeError);
            }

            setLocation(newLocation);
            onLocationDetected?.(newLocation);
        } catch (err) {
            const errorMessage =
                err instanceof GeolocationPositionError
                    ? `GPS Error: ${err.message}`
                    : 'Failed to detect location';
            setError(errorMessage);
            console.error('Location detection error:', err);
        } finally {
            setIsDetecting(false);
        }
    }, [location?.city, onLocationDetected]);

    const recenter = useCallback(() => {
        detectLocation();
    }, [detectLocation]);

    useEffect(() => {
        if (autoDetect) {
            detectLocation();
        }
    }, [autoDetect, detectLocation]);

    return {
        location,
        isDetecting,
        error,
        detectLocation,
        recenter,
    };
}
