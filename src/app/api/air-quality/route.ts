import { NextResponse } from 'next/server';
import type { AirQualityResponse } from '@/types/air-quality';

/**
 * Open-Meteo Air Quality API Route
 * Endpoint: /api/air-quality
 * 
 * Query Parameters:
 * - lat: latitude (required)
 * - lon: longitude (required)
 * - location: location name (optional, for display)
 * - date: date in YYYY-MM-DD format (optional, for historical data simulation)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');
        const dateParam = searchParams.get('date');
        const locationName = searchParams.get('location') || 'Unknown Location';

        // Validasi parameters
        if (!lat || !lon) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required parameters: lat and lon',
                } as AirQualityResponse,
                { status: 400 }
            );
        }

        // Validasi format lat/lon
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid latitude or longitude format',
                } as AirQualityResponse,
                { status: 400 }
            );
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Latitude must be between -90 and 90, longitude between -180 and 180',
                } as AirQualityResponse,
                { status: 400 }
            );
        }

        // Build Open-Meteo API URL
        const baseUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality';
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            current: [
                'carbon_monoxide',
                'carbon_dioxide',
                'pm10',
                'pm2_5',
                'nitrogen_dioxide',
                'sulphur_dioxide',
                'ozone',
                'dust',
                'uv_index'
            ].join(','),
            timezone: 'auto',
        });

        // Note: Open-Meteo Air Quality API only provides real-time/current data
        // Historical air quality data is not available from this API
        // Always fetch current real data regardless of date parameter
        const apiUrl = `${baseUrl}?${params.toString()}`;

        // Fetch real data from Open-Meteo API
        const response = await fetch(apiUrl, {
            next: {
                revalidate: 300 // Cache for 5 minutes (more frequent updates for real-time data)
            }
        });

        if (!response.ok) {
            throw new Error(`Open-Meteo API error: ${response.status}`);
        }

        const data = await response.json();

        // Add metadata to indicate this is real-time data
        const isHistoricalRequest = dateParam && new Date(dateParam) < new Date(new Date().setHours(0, 0, 0, 0));
        if (isHistoricalRequest) {
            console.warn(`⚠️ Historical data requested for ${dateParam}, but only real-time data is available from Open-Meteo API`);
        }

        // Return formatted response with metadata
        return NextResponse.json(
            {
                success: true,
                data,
                location: {
                    name: locationName,
                    latitude,
                    longitude,
                    timezone: data.timezone,
                },
                metadata: {
                    isRealTimeData: true,
                    requestedDate: dateParam || 'current',
                    dataTimestamp: data.current?.time,
                    note: dateParam && isHistoricalRequest
                        ? 'Historical air quality data not available. Showing current real-time data instead.'
                        : 'Real-time air quality data from Open-Meteo API'
                }
            } as AirQualityResponse,
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        );

    } catch (error) {
        console.error('Air Quality API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch air quality data',
            } as AirQualityResponse,
            { status: 500 }
        );
    }
}
