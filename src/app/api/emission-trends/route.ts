/**
 * Emission Trends API
 * Endpoint untuk mendapatkan historical CO₂ emission trends
 * Mendukung filter berdasarkan region dan date range
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface EmissionDataPoint {
    date: string;
    co2: number; // ppm
    emission: number; // percentage change
    month: string;
    year: number;
}

interface EmissionTrendsResponse {
    success: boolean;
    region: string;
    startDate: string;
    endDate: string;
    averageCO2: number;
    emissionChange: number; // overall percentage change
    trend: EmissionDataPoint[];
    source: string;
    lastUpdate: string;
}

/**
 * Generate historical CO₂ data based on region
 * Menggunakan pola data realistis berdasarkan data NASA NEO
 */
function generateHistoricalCO2Data(region: string, startYear: number, endYear: number): EmissionDataPoint[] {
    const data: EmissionDataPoint[] = [];

    // Base CO₂ values by region (ppm) - realistis berdasarkan NASA data
    const regionBaseCO2: Record<string, number> = {
        'All Regions': 395,
        'Asia': 398,
        'Europe': 392,
        'North America': 396,
        'South America': 388,
        'Africa': 393,
        'Oceania': 390,
        'Arctic': 394,
        'Antarctic': 387,
    };

    // CO₂ growth rate per year by region (ppm/year)
    const regionGrowthRate: Record<string, number> = {
        'All Regions': 2.3,
        'Asia': 2.8, // Tinggi karena industrialisasi
        'Europe': 1.9,
        'North America': 2.4,
        'South America': 1.7,
        'Africa': 2.1,
        'Oceania': 1.6,
        'Arctic': 2.2,
        'Antarctic': 1.4,
    };

    const baseCO2 = regionBaseCO2[region] || regionBaseCO2['All Regions'];
    const growthRate = regionGrowthRate[region] || regionGrowthRate['All Regions'];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let year = startYear; year <= endYear; year++) {
        // Generate data for selected months (quarterly untuk performance)
        const selectedMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct

        selectedMonths.forEach(monthIndex => {
            const yearOffset = year - startYear;
            const monthOffset = monthIndex / 12;

            // Calculate CO₂ with realistic seasonal variation
            const seasonalVariation = Math.sin((monthIndex / 12) * 2 * Math.PI) * 3; // ±3 ppm seasonal
            const randomNoise = (Math.random() - 0.5) * 1.5; // ±0.75 ppm noise

            const co2Value = baseCO2 +
                (growthRate * (yearOffset + monthOffset)) +
                seasonalVariation +
                randomNoise;

            // Calculate emission change percentage
            const baselineValue = baseCO2 + (growthRate * yearOffset);
            const emissionChangePercent = ((co2Value - baseCO2) / baseCO2) * 100;

            const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;

            data.push({
                date,
                co2: parseFloat(co2Value.toFixed(2)),
                emission: parseFloat(emissionChangePercent.toFixed(2)),
                month: months[monthIndex],
                year
            });
        });
    }

    return data;
}

/**
 * GET /api/emission-trends
 * Query parameters:
 * - region: Region name (default: "All Regions")
 * - startYear: Start year (default: 2015)
 * - endYear: End year (default: current year)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const region = searchParams.get('region') || 'All Regions';
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

        if (startYear < 2000 || endYear > new Date().getFullYear()) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Year must be between 2000 and ${new Date().getFullYear()}`,
                },
                { status: 400 }
            );
        }

        // Generate historical data
        const trendData = generateHistoricalCO2Data(region, startYear, endYear);

        // Calculate statistics
        const co2Values = trendData.map(d => d.co2);
        const averageCO2 = co2Values.reduce((a, b) => a + b, 0) / co2Values.length;

        const firstCO2 = trendData[0]?.co2 || 0;
        const lastCO2 = trendData[trendData.length - 1]?.co2 || 0;
        const emissionChange = ((lastCO2 - firstCO2) / firstCO2) * 100;

        const response: EmissionTrendsResponse = {
            success: true,
            region,
            startDate: `${startYear}-01-01`,
            endDate: `${endYear}-12-31`,
            averageCO2: parseFloat(averageCO2.toFixed(2)),
            emissionChange: parseFloat(emissionChange.toFixed(2)),
            trend: trendData,
            source: 'NASA NEO - Carbon Dioxide (simulated historical data)',
            lastUpdate: new Date().toISOString(),
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });

    } catch (error) {
        console.error('Emission Trends API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch emission trends',
            },
            { status: 500 }
        );
    }
}
