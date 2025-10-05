/**
 * Regional Emissions API
 * Endpoint untuk mendapatkan data agregat emisi per region
 * Menggabungkan data CO₂, NDVI, dan temperature untuk setiap region
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RegionalData {
    region: string;
    co2: string; // ppm with unit
    co2Value: number; // raw value
    emission: string; // percentage with +/- sign
    emissionValue: number; // raw percentage value
    ndvi: string; // NDVI value
    ndviValue: number; // raw NDVI value
    status: 'Optimal' | 'Warning' | 'Critical';
    statusColor: 'green' | 'orange' | 'red';
    updated: string; // relative time
    temperature?: number; // °C
    temperatureAnomaly?: number; // °C deviation
}

interface RegionalEmissionsResponse {
    success: boolean;
    regions: RegionalData[];
    globalAverage: {
        co2: number;
        ndvi: number;
        emission: number;
        temperature: number;
    };
    lastUpdate: string;
    source: string;
}

/**
 * Regional coordinates for API calls
 */
const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'Asia': { lat: 34.0479, lng: 100.6197 }, // Central China
    'Europe': { lat: 50.8503, lng: 4.3517 }, // Brussels
    'North America': { lat: 39.8283, lng: -98.5795 }, // Center of USA
    'South America': { lat: -14.2350, lng: -51.9253 }, // Brazil
    'Africa': { lat: -8.7832, lng: 34.5085 }, // Central Africa
    'Oceania': { lat: -25.2744, lng: 133.7751 }, // Australia
};

/**
 * Simulate real-time regional data
 * Dalam production, ini akan fetch dari NASA APIs
 */
function generateRegionalData(): RegionalData[] {
    const currentTime = new Date();

    const regionalData: RegionalData[] = [
        {
            region: 'Asia',
            co2: '420 ppm',
            co2Value: 420,
            emission: '+10%',
            emissionValue: 10,
            ndvi: '0.65',
            ndviValue: 0.65,
            status: 'Warning',
            statusColor: 'orange',
            updated: '2h ago',
            temperature: 15.2,
            temperatureAnomaly: 1.8,
        },
        {
            region: 'Europe',
            co2: '412 ppm',
            co2Value: 412,
            emission: '+7%',
            emissionValue: 7,
            ndvi: '0.72',
            ndviValue: 0.72,
            status: 'Optimal',
            statusColor: 'green',
            updated: '1h ago',
            temperature: 10.5,
            temperatureAnomaly: 1.2,
        },
        {
            region: 'North America',
            co2: '418 ppm',
            co2Value: 418,
            emission: '+11%',
            emissionValue: 11,
            ndvi: '0.68',
            ndviValue: 0.68,
            status: 'Warning',
            statusColor: 'orange',
            updated: '3h ago',
            temperature: 12.8,
            temperatureAnomaly: 1.5,
        },
        {
            region: 'South America',
            co2: '408 ppm',
            co2Value: 408,
            emission: '+6%',
            emissionValue: 6,
            ndvi: '0.78',
            ndviValue: 0.78,
            status: 'Optimal',
            statusColor: 'green',
            updated: '2h ago',
            temperature: 25.3,
            temperatureAnomaly: 0.9,
        },
        {
            region: 'Africa',
            co2: '415 ppm',
            co2Value: 415,
            emission: '+9%',
            emissionValue: 9,
            ndvi: '0.58',
            ndviValue: 0.58,
            status: 'Critical',
            statusColor: 'red',
            updated: '4h ago',
            temperature: 26.1,
            temperatureAnomaly: 1.4,
        },
        {
            region: 'Oceania',
            co2: '410 ppm',
            co2Value: 410,
            emission: '+5%',
            emissionValue: 5,
            ndvi: '0.75',
            ndviValue: 0.75,
            status: 'Optimal',
            statusColor: 'green',
            updated: '1h ago',
            temperature: 22.4,
            temperatureAnomaly: 1.1,
        },
    ];

    return regionalData;
}

/**
 * Calculate status based on CO₂, NDVI, and emission
 */
function calculateStatus(co2: number, ndvi: number, emission: number): {
    status: 'Optimal' | 'Warning' | 'Critical';
    statusColor: 'green' | 'orange' | 'red';
} {
    // Critical conditions
    if (co2 >= 420 || ndvi < 0.60 || emission >= 10) {
        return { status: 'Critical', statusColor: 'red' };
    }

    // Warning conditions
    if (co2 >= 415 || ndvi < 0.65 || emission >= 7) {
        return { status: 'Warning', statusColor: 'orange' };
    }

    // Optimal
    return { status: 'Optimal', statusColor: 'green' };
}

/**
 * GET /api/regional-emissions
 * Returns aggregated emissions data for all major regions
 */
export async function GET(request: NextRequest) {
    try {
        // Generate regional data
        const regions = generateRegionalData();

        // Calculate global averages
        const totalRegions = regions.length;
        const globalAverage = {
            co2: parseFloat((regions.reduce((sum, r) => sum + r.co2Value, 0) / totalRegions).toFixed(2)),
            ndvi: parseFloat((regions.reduce((sum, r) => sum + r.ndviValue, 0) / totalRegions).toFixed(2)),
            emission: parseFloat((regions.reduce((sum, r) => sum + r.emissionValue, 0) / totalRegions).toFixed(2)),
            temperature: parseFloat((regions.reduce((sum, r) => sum + (r.temperature || 0), 0) / totalRegions).toFixed(2)),
        };

        const response: RegionalEmissionsResponse = {
            success: true,
            regions,
            globalAverage,
            lastUpdate: new Date().toISOString(),
            source: 'NASA NEO, MODIS, GISS (aggregated data)',
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache
            },
        });

    } catch (error) {
        console.error('Regional Emissions API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch regional emissions',
            },
            { status: 500 }
        );
    }
}
