/**
 * Climate Alerts API
 * Endpoint untuk mendapatkan climate alerts berdasarkan threshold
 * Menganalisis CO₂, NDVI, temperature untuk generate alerts
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'notice';
    category: 'co2' | 'ndvi' | 'temperature' | 'emission';
    title: string;
    description: string;
    region: string;
    value: number;
    threshold: number;
    icon: string;
    timestamp: string;
    severity: number; // 1-10 scale
}

interface AlertsResponse {
    success: boolean;
    alerts: Alert[];
    summary: {
        critical: number;
        warning: number;
        notice: number;
        total: number;
    };
    lastUpdate: string;
}

/**
 * Alert thresholds configuration
 */
const ALERT_THRESHOLDS = {
    co2: {
        critical: 420, // ppm
        warning: 415,
        notice: 410,
    },
    ndvi: {
        critical: 0.50, // Below this is critical
        warning: 0.60,
        notice: 0.65,
    },
    temperature: {
        critical: 2.0, // °C anomaly
        warning: 1.5,
        notice: 1.0,
    },
    emission: {
        critical: 12, // % increase
        warning: 9,
        notice: 6,
    },
};

/**
 * Generate alerts based on current data
 * In production, this would fetch real data from NASA APIs
 */
function generateAlerts(): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date();

    // Alert 1: CO₂ spike in Asia (CRITICAL)
    alerts.push({
        id: 'alert-co2-asia-001',
        type: 'critical',
        category: 'co2',
        title: 'CO₂ Spike Detected',
        description: 'CO₂ levels reached 420 ppm in Asia region, exceeding critical threshold',
        region: 'Asia',
        value: 420,
        threshold: ALERT_THRESHOLDS.co2.critical,
        icon: '🚨',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
        severity: 9,
    });

    // Alert 2: NDVI declining in Africa (WARNING)
    alerts.push({
        id: 'alert-ndvi-africa-001',
        type: 'warning',
        category: 'ndvi',
        title: 'NDVI Declining',
        description: 'Vegetation index dropped to 0.58 in Africa, indicating deforestation',
        region: 'Africa',
        value: 0.58,
        threshold: ALERT_THRESHOLDS.ndvi.warning,
        icon: '⚠️',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
        severity: 7,
    });

    // Alert 3: Temperature anomaly in Arctic (CRITICAL)
    alerts.push({
        id: 'alert-temp-arctic-001',
        type: 'critical',
        category: 'temperature',
        title: 'Temperature Anomaly',
        description: 'Arctic temperature +2.5°C above baseline, accelerated ice melt detected',
        region: 'Arctic',
        value: 2.5,
        threshold: ALERT_THRESHOLDS.temperature.critical,
        icon: '🌡️',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
        severity: 10,
    });

    // Alert 4: Emission increase in North America (WARNING)
    alerts.push({
        id: 'alert-emission-na-001',
        type: 'warning',
        category: 'emission',
        title: 'Emission Increase',
        description: 'CO₂ emissions increased by 11% in North America since 2019',
        region: 'North America',
        value: 11,
        threshold: ALERT_THRESHOLDS.emission.warning,
        icon: '📈',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
        severity: 6,
    });

    // Alert 5: NDVI recovery in South America (NOTICE)
    alerts.push({
        id: 'alert-ndvi-sa-001',
        type: 'notice',
        category: 'ndvi',
        title: 'Vegetation Recovery',
        description: 'NDVI improved to 0.78 in South America, reforestation programs showing results',
        region: 'South America',
        value: 0.78,
        threshold: ALERT_THRESHOLDS.ndvi.notice,
        icon: '🌱',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12h ago
        severity: 3,
    });

    // Alert 6: CO₂ stabilization in Europe (NOTICE)
    alerts.push({
        id: 'alert-co2-europe-001',
        type: 'notice',
        category: 'co2',
        title: 'CO₂ Stabilization',
        description: 'CO₂ levels maintained at 412 ppm in Europe, renewable energy transition effective',
        region: 'Europe',
        value: 412,
        threshold: ALERT_THRESHOLDS.co2.notice,
        icon: '⚡',
        timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(), // 18h ago
        severity: 2,
    });

    // Sort by severity (highest first)
    return alerts.sort((a, b) => b.severity - a.severity);
}

/**
 * GET /api/alerts
 * Query parameters:
 * - type: Filter by alert type (critical|warning|notice)
 * - category: Filter by category (co2|ndvi|temperature|emission)
 * - region: Filter by region
 * - limit: Max number of alerts to return (default: 10)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const typeFilter = searchParams.get('type');
        const categoryFilter = searchParams.get('category');
        const regionFilter = searchParams.get('region');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Generate all alerts
        let alerts = generateAlerts();

        // Apply filters
        if (typeFilter) {
            alerts = alerts.filter(a => a.type === typeFilter);
        }

        if (categoryFilter) {
            alerts = alerts.filter(a => a.category === categoryFilter);
        }

        if (regionFilter) {
            alerts = alerts.filter(a => a.region.toLowerCase() === regionFilter.toLowerCase());
        }

        // Apply limit
        alerts = alerts.slice(0, limit);

        // Calculate summary
        const summary = {
            critical: alerts.filter(a => a.type === 'critical').length,
            warning: alerts.filter(a => a.type === 'warning').length,
            notice: alerts.filter(a => a.type === 'notice').length,
            total: alerts.length,
        };

        const response: AlertsResponse = {
            success: true,
            alerts,
            summary,
            lastUpdate: new Date().toISOString(),
        };

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360', // 3 min cache
            },
        });

    } catch (error) {
        console.error('Alerts API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch alerts',
            },
            { status: 500 }
        );
    }
}
