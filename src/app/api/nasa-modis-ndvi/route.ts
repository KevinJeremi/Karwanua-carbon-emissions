/**
 * NASA MODIS NDVI API Route
 * Mengambil data NDVI (Normalized Difference Vegetation Index) dari NASA
 * untuk monitoring vegetasi dan kesehatan tanaman
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface NDVIDataPoint {
    date: string;
    ndvi: number;
    quality: string;
}

interface NDVIResponse {
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

/**
 * Menginterpretasi nilai NDVI ke status vegetasi
 */
function interpretNDVI(ndvi: number): {
    status: string;
    health: string;
    color: string;
} {
    if (ndvi >= 0.6) {
        return {
            status: 'Dense Vegetation',
            health: 'Excellent',
            color: '#22c55e' // green-500
        };
    } else if (ndvi >= 0.4) {
        return {
            status: 'Moderate Vegetation',
            health: 'Good',
            color: '#84cc16' // lime-500
        };
    } else if (ndvi >= 0.2) {
        return {
            status: 'Sparse Vegetation',
            health: 'Fair',
            color: '#facc15' // yellow-400
        };
    } else if (ndvi >= 0.0) {
        return {
            status: 'Very Sparse',
            health: 'Poor',
            color: '#f97316' // orange-500
        };
    } else {
        return {
            status: 'No Vegetation',
            health: 'Critical',
            color: '#ef4444' // red-500
        };
    }
}

/**
 * Database major urban areas di Indonesia
 * Berdasarkan koordinat kota-kota besar dengan NDVI rendah (urban)
 */
const URBAN_AREAS = [
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456, radius: 0.20, baseNDVI: 0.18 },
    { name: 'Surabaya', lat: -7.2575, lng: 112.7521, radius: 0.12, baseNDVI: 0.20 },
    { name: 'Bandung', lat: -6.9175, lng: 107.6191, radius: 0.10, baseNDVI: 0.23 },
    { name: 'Medan', lat: 3.5952, lng: 98.6722, radius: 0.10, baseNDVI: 0.21 },
    { name: 'Semarang', lat: -6.9667, lng: 110.4167, radius: 0.09, baseNDVI: 0.22 },
    { name: 'Makassar', lat: -5.1477, lng: 119.4327, radius: 0.08, baseNDVI: 0.24 },
    { name: 'Palembang', lat: -2.9761, lng: 104.7754, radius: 0.08, baseNDVI: 0.25 },
    { name: 'Tangerang', lat: -6.1783, lng: 106.6319, radius: 0.10, baseNDVI: 0.19 },
    { name: 'Bekasi', lat: -6.2383, lng: 106.9756, radius: 0.09, baseNDVI: 0.20 },
    { name: 'Depok', lat: -6.4025, lng: 106.7942, radius: 0.07, baseNDVI: 0.22 },
];

/**
 * Improved NDVI calculation dengan urban detection yang akurat
 * Menggunakan coordinate-based logic untuk major cities di Indonesia
 */
function calculateNDVIForLocation(lat: number, lng: number, targetDate: Date): number {
    // 1. CHECK IF IN URBAN AREA (Priority #1)
    for (const city of URBAN_AREAS) {
        const distance = Math.sqrt(
            Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
        );

        if (distance < city.radius) {
            // Inside urban area - return low NDVI
            const urbanVariation = (Math.random() - 0.5) * 0.10;
            const urbanNDVI = city.baseNDVI + urbanVariation;

            // Clamp antara 0.05-0.35 untuk urban areas
            return Math.max(0.05, Math.min(0.35, urbanNDVI));
        }
    }

    // 2. CHECK FOR WATER BODIES
    const isOcean = (lat < -11 || lat > 6) && (lng < 95 || lng > 141);
    if (isOcean) {
        return -0.12 + (Math.random() * 0.08);
    }

    // 3. DEFAULT: VEGETATION/FOREST AREA
    const latitudeFactor = Math.cos((lat * Math.PI) / 180);
    const baseNDVI = 0.52 + (latitudeFactor * 0.22);

    // Seasonal variation
    const seasonalVariation = Math.sin((targetDate.getMonth() / 12) * Math.PI * 2) * 0.12;

    // Historical trend
    const yearsDiff = (new Date().getFullYear() - targetDate.getFullYear());
    const historicalTrend = yearsDiff * 0.006;

    // Local variation
    const seed = lat * 1000 + lng * 100;
    const pseudoRandom = Math.sin(seed) * 0.5 + 0.5;
    const localVariation = (pseudoRandom - 0.5) * 0.28;

    const ndvi = baseNDVI + seasonalVariation - historicalTrend + localVariation;

    return Math.max(-0.2, Math.min(0.9, ndvi));
}

/**
 * Simulasi data NDVI berdasarkan lokasi dan tanggal
 * TODO: Ganti dengan real API call ke NASA MODIS Web Service
 */
function generateNDVIData(lat: number, lng: number, targetDate?: string): NDVIDataPoint[] {
    const data: NDVIDataPoint[] = [];
    const endDate = targetDate ? new Date(targetDate + 'T00:00:00') : new Date();

    // Generate 8 data points (8-day interval MODIS)
    for (let i = 7; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - (i * 8));

        const ndvi = calculateNDVIForLocation(lat, lng, date);

        data.push({
            date: date.toISOString().split('T')[0],
            ndvi: Math.round(ndvi * 100) / 100,
            quality: 'good'
        });
    }

    return data;
}

/**
 * GET /api/nasa-modis-ndvi
 * Query params:
 * - latitude: number
 * - longitude: number
 * - name: string (optional)
 * - date: string (optional, YYYY-MM-DD format)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const latitude = parseFloat(searchParams.get('latitude') || '0');
        const longitude = parseFloat(searchParams.get('longitude') || '0');
        const locationName = searchParams.get('name') || 'Unknown Location';
        const dateParam = searchParams.get('date');

        // Validasi input
        if (latitude < -90 || latitude > 90) {
            return NextResponse.json(
                { error: 'Invalid latitude. Must be between -90 and 90' },
                { status: 400 }
            );
        }

        if (longitude < -180 || longitude > 180) {
            return NextResponse.json(
                { error: 'Invalid longitude. Must be between -180 and 180' },
                { status: 400 }
            );
        }

        console.log(`🌿 Fetching NDVI data for: ${locationName} (${latitude}, ${longitude})${dateParam ? ` on ${dateParam}` : ''}`);

        // Generate NDVI trend data
        const trendData = generateNDVIData(latitude, longitude, dateParam || undefined);
        const currentNDVI = trendData[trendData.length - 1].ndvi;
        const interpretation = interpretNDVI(currentNDVI);

        const response: NDVIResponse = {
            location: {
                latitude,
                longitude,
                name: locationName
            },
            currentNDVI,
            ndviStatus: interpretation.status,
            vegetationHealth: interpretation.health,
            colorCode: interpretation.color,
            trend: trendData,
            lastUpdate: new Date().toISOString(),
            source: 'NASA MODIS Terra/Aqua (Simulated)'
        };

        console.log(`✅ NDVI: ${currentNDVI} - ${interpretation.status}`);

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Error fetching NDVI data:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch NDVI data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/nasa-modis-ndvi/batch
 * Body: { locations: Array<{latitude: number, longitude: number, name?: string}> }
 * 
 * Untuk fetch multiple locations sekaligus
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { locations } = body;

        if (!Array.isArray(locations) || locations.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request. Provide an array of locations.' },
                { status: 400 }
            );
        }

        const results = locations.map(loc => {
            const trendData = generateNDVIData(loc.latitude, loc.longitude);
            const currentNDVI = trendData[trendData.length - 1].ndvi;
            const interpretation = interpretNDVI(currentNDVI);

            return {
                location: {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    name: loc.name || 'Unknown'
                },
                currentNDVI,
                ndviStatus: interpretation.status,
                vegetationHealth: interpretation.health,
                colorCode: interpretation.color,
                lastUpdate: new Date().toISOString()
            };
        });

        return NextResponse.json({
            total: results.length,
            data: results,
            source: 'NASA MODIS Terra/Aqua (Simulated)'
        });

    } catch (error) {
        console.error('❌ Error in batch NDVI fetch:', error);
        return NextResponse.json(
            { error: 'Failed to fetch batch NDVI data' },
            { status: 500 }
        );
    }
}
