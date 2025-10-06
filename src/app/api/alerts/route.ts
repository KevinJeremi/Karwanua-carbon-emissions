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
 * Generate alerts based on REAL data from APIs
 * Fetches data from regional-emissions, temperature-anomaly, and analyzes against thresholds
 */
async function generateAlerts(): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const now = new Date();

    try {
        // Determine base URL (works in both dev and production)
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Fetch Regional Emissions data
        const regionalRes = await fetch(`${baseUrl}/api/regional-emissions`, {
            cache: 'no-store'
        });

        if (regionalRes.ok) {
            const regionalData = await regionalRes.json();

            if (regionalData.success && regionalData.regions) {
                regionalData.regions.forEach((region: any, index: number) => {
                    // Check CO₂ levels
                    if (region.co2Value >= ALERT_THRESHOLDS.co2.critical) {
                        alerts.push({
                            id: `alert-co2-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'critical',
                            category: 'co2',
                            title: 'CO₂ Spike Detected',
                            description: `CO₂ levels reached ${region.co2Value.toFixed(1)} ppm in ${region.region}, exceeding critical threshold`,
                            region: region.region,
                            value: region.co2Value,
                            threshold: ALERT_THRESHOLDS.co2.critical,
                            icon: '🚨',
                            timestamp: new Date(now.getTime() - (index * 2) * 60 * 60 * 1000).toISOString(),
                            severity: 9,
                        });
                    } else if (region.co2Value >= ALERT_THRESHOLDS.co2.warning) {
                        alerts.push({
                            id: `alert-co2-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'warning',
                            category: 'co2',
                            title: 'CO₂ Level Warning',
                            description: `CO₂ at ${region.co2Value.toFixed(1)} ppm in ${region.region}, approaching critical levels`,
                            region: region.region,
                            value: region.co2Value,
                            threshold: ALERT_THRESHOLDS.co2.warning,
                            icon: '⚠️',
                            timestamp: new Date(now.getTime() - (index * 2) * 60 * 60 * 1000).toISOString(),
                            severity: 7,
                        });
                    }

                    // Check NDVI levels
                    if (region.ndviValue <= ALERT_THRESHOLDS.ndvi.critical) {
                        alerts.push({
                            id: `alert-ndvi-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'critical',
                            category: 'ndvi',
                            title: 'Critical Vegetation Loss',
                            description: `NDVI dropped to ${region.ndviValue.toFixed(2)} in ${region.region}, severe deforestation detected`,
                            region: region.region,
                            value: region.ndviValue,
                            threshold: ALERT_THRESHOLDS.ndvi.critical,
                            icon: '🌲',
                            timestamp: new Date(now.getTime() - (index * 3) * 60 * 60 * 1000).toISOString(),
                            severity: 8,
                        });
                    } else if (region.ndviValue <= ALERT_THRESHOLDS.ndvi.warning) {
                        alerts.push({
                            id: `alert-ndvi-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'warning',
                            category: 'ndvi',
                            title: 'NDVI Declining',
                            description: `Vegetation index at ${region.ndviValue.toFixed(2)} in ${region.region}, monitoring required`,
                            region: region.region,
                            value: region.ndviValue,
                            threshold: ALERT_THRESHOLDS.ndvi.warning,
                            icon: '⚠️',
                            timestamp: new Date(now.getTime() - (index * 4) * 60 * 60 * 1000).toISOString(),
                            severity: 6,
                        });
                    } else if (region.ndviValue >= 0.75) {
                        // Good news - vegetation recovery
                        alerts.push({
                            id: `alert-ndvi-recovery-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'notice',
                            category: 'ndvi',
                            title: 'Vegetation Recovery',
                            description: `NDVI improved to ${region.ndviValue.toFixed(2)} in ${region.region}, reforestation showing results`,
                            region: region.region,
                            value: region.ndviValue,
                            threshold: ALERT_THRESHOLDS.ndvi.notice,
                            icon: '�',
                            timestamp: new Date(now.getTime() - (index * 12) * 60 * 60 * 1000).toISOString(),
                            severity: 3,
                        });
                    }

                    // Check emission changes
                    if (region.emissionValue >= ALERT_THRESHOLDS.emission.critical) {
                        alerts.push({
                            id: `alert-emission-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'critical',
                            category: 'emission',
                            title: 'Critical Emission Increase',
                            description: `CO₂ emissions increased by ${region.emissionValue.toFixed(1)}% in ${region.region} since 2019`,
                            region: region.region,
                            value: region.emissionValue,
                            threshold: ALERT_THRESHOLDS.emission.critical,
                            icon: '📈',
                            timestamp: new Date(now.getTime() - (index * 8) * 60 * 60 * 1000).toISOString(),
                            severity: 8,
                        });
                    } else if (region.emissionValue >= ALERT_THRESHOLDS.emission.warning) {
                        alerts.push({
                            id: `alert-emission-${region.region.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            type: 'warning',
                            category: 'emission',
                            title: 'Emission Increase',
                            description: `Emissions rose by ${region.emissionValue.toFixed(1)}% in ${region.region}, action needed`,
                            region: region.region,
                            value: region.emissionValue,
                            threshold: ALERT_THRESHOLDS.emission.warning,
                            icon: '📊',
                            timestamp: new Date(now.getTime() - (index * 8) * 60 * 60 * 1000).toISOString(),
                            severity: 6,
                        });
                    }
                });
            }
        }

        // Fetch Temperature Anomaly data
        const tempRes = await fetch(`${baseUrl}/api/temperature-anomaly?region=Global`, {
            cache: 'no-store'
        });

        if (tempRes.ok) {
            const tempData = await tempRes.json();

            if (tempData.success && tempData.currentAnomaly) {
                const anomaly = tempData.currentAnomaly;

                if (anomaly >= ALERT_THRESHOLDS.temperature.critical) {
                    alerts.push({
                        id: `alert-temp-global-${Date.now()}`,
                        type: 'critical',
                        category: 'temperature',
                        title: 'Temperature Anomaly',
                        description: `Global temperature +${anomaly.toFixed(1)}°C above baseline, accelerated climate change detected`,
                        region: 'Global',
                        value: anomaly,
                        threshold: ALERT_THRESHOLDS.temperature.critical,
                        icon: '🌡️',
                        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
                        severity: 10,
                    });
                } else if (anomaly >= ALERT_THRESHOLDS.temperature.warning) {
                    alerts.push({
                        id: `alert-temp-global-${Date.now()}`,
                        type: 'warning',
                        category: 'temperature',
                        title: 'Temperature Warning',
                        description: `Global temperature +${anomaly.toFixed(1)}°C above baseline, monitoring required`,
                        region: 'Global',
                        value: anomaly,
                        threshold: ALERT_THRESHOLDS.temperature.warning,
                        icon: '🌡️',
                        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
                        severity: 7,
                    });
                }
            }
        }

    } catch (error) {
        console.error('Error fetching real data for alerts:', error);

        // Fallback: Add one generic alert if API fails
        alerts.push({
            id: 'alert-system-001',
            type: 'notice',
            category: 'co2',
            title: 'System Monitoring',
            description: 'Climate monitoring system active. Data collection in progress.',
            region: 'Global',
            value: 415,
            threshold: ALERT_THRESHOLDS.co2.notice,
            icon: '📡',
            timestamp: now.toISOString(),
            severity: 2,
        });
    }

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

        // Generate all alerts (now async)
        let alerts = await generateAlerts();

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
