/**
 * Temperature Anomaly API
 * Endpoint untuk mendapatkan data anomali temperatur global dan regional
 * Berdasarkan NASA GISS Surface Temperature Analysis
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TemperatureDataPoint {
    date: string;
    anomaly: number; // °C deviation from baseline
    baseline: number; // °C baseline temperature
    actual: number; // °C actual temperature
}

interface TemperatureAnomalyResponse {
    success: boolean;
    region: string;
    currentAnomaly: number; // °C
    baselineTemperature: number; // °C
    currentTemperature: number; // °C
    status: string; // "Critical" | "Warning" | "Normal" | "Cool"
    trend: TemperatureDataPoint[];
    source: string;
    lastUpdate: string;
}

/**
 * Regional baseline temperatures (1951-1980 average)
 * Berdasarkan data NASA GISS
 */
const REGIONAL_BASELINE: Record<string, number> = {
    'Global': 14.0,
    'All Regions': 14.0,
    'Asia': 11.5,
    'Southeast Asia': 26.5,
    'Indonesia': 25.5,
    'Europe': 9.0,
    'North America': 8.5,
    'South America': 24.0,
    'Africa': 24.5,
    'Oceania': 21.5,
    'Arctic': -15.0,
    'Antarctic': -25.0,
};

/**
 * Regional warming rates (°C per decade)
 * Arctic warming ~3x faster than global average
 */
const REGIONAL_WARMING_RATE: Record<string, number> = {
    'Global': 0.18,
    'All Regions': 0.18,
    'Asia': 0.20,
    'Southeast Asia': 0.22,
    'Indonesia': 0.24,
    'Europe': 0.22,
    'North America': 0.21,
    'South America': 0.16,
    'Africa': 0.17,
    'Oceania': 0.15,
    'Arctic': 0.50, // Arctic amplification
    'Antarctic': 0.12,
};

/**
 * Generate historical temperature anomaly data
 */
function generateTemperatureData(region: string, startYear: number, endYear: number): TemperatureDataPoint[] {
    const data: TemperatureDataPoint[] = [];

    const baseline = REGIONAL_BASELINE[region] || REGIONAL_BASELINE['Global'];
    const warmingRate = REGIONAL_WARMING_RATE[region] || REGIONAL_WARMING_RATE['Global'];

    const baseYear = 1980; // NASA baseline reference
    const months = ['01', '04', '07', '10']; // Quarterly data

    for (let year = startYear; year <= endYear; year++) {
        months.forEach(month => {
            const yearsFromBase = year - baseYear;
            const decades = yearsFromBase / 10;

            // Calculate temperature anomaly
            const trendAnomaly = warmingRate * decades;

            // Add seasonal variation (varies by region)
            const monthNum = parseInt(month);
            const seasonalFactor = Math.sin((monthNum / 12) * 2 * Math.PI) * 0.3;

            // Add natural variability (ENSO, volcanic, etc.)
            const naturalVariability = (Math.random() - 0.5) * 0.4;

            const anomaly = trendAnomaly + seasonalFactor + naturalVariability;
            const actual = baseline + anomaly;

            data.push({
                date: `${year}-${month}-01`,
                anomaly: parseFloat(anomaly.toFixed(2)),
                baseline: parseFloat(baseline.toFixed(1)),
                actual: parseFloat(actual.toFixed(2)),
            });
        });
    }

    return data;
}

/**
 * Get temperature status based on anomaly
 */
function getTemperatureStatus(anomaly: number): string {
    if (anomaly >= 2.0) return 'Critical';
    if (anomaly >= 1.0) return 'Warning';
    if (anomaly >= -0.5) return 'Normal';
    return 'Cool';
}

/**
 * GET /api/temperature-anomaly
 * Query parameters:
 * - region: Region name (default: "Global")
 * - startYear: Start year (default: 2015)
 * - endYear: End year (default: current year)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const region = searchParams.get('region') || 'Global';
        const startYear = parseInt(searchParams.get('startYear') || '2015');
        const endYear = parseInt(searchParams.get('endYear') || new Date().getFullYear().toString());

        // Validate years
        if (startYear > endYear) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Start year must be before or equal to end year',
                },
                { status: 400 }
            );
        }

        if (startYear < 1980 || endYear > new Date().getFullYear()) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Year must be between 1980 and ${new Date().getFullYear()}`,
                },
                { status: 400 }
            );
        }

        // Validate region
        if (!REGIONAL_BASELINE[region]) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid region. Available regions: ${Object.keys(REGIONAL_BASELINE).join(', ')}`,
                },
                { status: 400 }
            );
        }

        // Generate temperature data
        const trendData = generateTemperatureData(region, startYear, endYear);

        // Get current (most recent) values
        const current = trendData[trendData.length - 1];
        const currentAnomaly = current.anomaly;
        const baselineTemperature = current.baseline;
        const currentTemperature = current.actual;
        const status = getTemperatureStatus(currentAnomaly);

        const response: TemperatureAnomalyResponse = {
            success: true,
            region,
            currentAnomaly,
            baselineTemperature,
            currentTemperature,
            status,
            trend: trendData,
            source: 'NASA GISS Surface Temperature Analysis (simulated)',
            lastUpdate: new Date().toISOString(),
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });

    } catch (error) {
        console.error('Temperature Anomaly API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch temperature anomaly',
            },
            { status: 500 }
        );
    }
}
