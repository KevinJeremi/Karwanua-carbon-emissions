/**
 * Service untuk mengambil data dari Open-Meteo Air Quality API
 */

import type {
    AirQualityCurrentData,
    AirQualityHistoricalData,
    RegionalData,
    DashboardMetrics,
} from '@/types/air-quality-api';

const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Koordinat untuk berbagai region
export const REGIONS = {
    'Southeast Asia': { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
    'Jakarta': { lat: -6.2088, lon: 106.8456, name: 'Jakarta, Indonesia' },
    'Bangkok': { lat: 13.7563, lon: 100.5018, name: 'Bangkok, Thailand' },
    'Manila': { lat: 14.5995, lon: 120.9842, name: 'Manila, Philippines' },
    'Kuala Lumpur': { lat: 3.1390, lon: 101.6869, name: 'Kuala Lumpur, Malaysia' },
    'Ho Chi Minh': { lat: 10.8231, lon: 106.6297, name: 'Ho Chi Minh, Vietnam' },
};

/**
 * Ambil data air quality saat ini untuk lokasi tertentu
 */
export async function getCurrentAirQuality(
    latitude: number,
    longitude: number
): Promise<AirQualityCurrentData> {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: [
            'carbon_dioxide',
            'pm10',
            'pm2_5',
            'carbon_monoxide',
            'nitrogen_dioxide',
            'sulphur_dioxide',
            'ozone',
            'us_aqi',
            'european_aqi',
        ].join(','),
        timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch air quality data: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Ambil data historis air quality
 * @param pastDays - Jumlah hari ke belakang (max 92 hari)
 */
export async function getHistoricalAirQuality(
    latitude: number,
    longitude: number,
    pastDays: number = 7
): Promise<AirQualityHistoricalData> {
    // Open-Meteo mendukung max ~92 hari historical data
    const maxDays = Math.min(pastDays, 92);

    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        hourly: [
            'carbon_dioxide',
            'pm10',
            'pm2_5',
            'carbon_monoxide',
            'nitrogen_dioxide',
            'sulphur_dioxide',
            'ozone',
            'us_aqi',
        ].join(','),
        past_days: maxDays.toString(),
        timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Ambil data untuk semua region yang di-track
 */
export async function getAllRegionsData(): Promise<RegionalData[]> {
    const regionPromises = Object.entries(REGIONS).map(async ([key, coords]) => {
        try {
            const data = await getCurrentAirQuality(coords.lat, coords.lon);

            // Hitung emission change dari historical data (simplified)
            const historical = await getHistoricalAirQuality(coords.lat, coords.lon, 7);
            const recentCO2 = historical.hourly.carbon_dioxide.slice(-24); // Last 24 hours
            const oldCO2 = historical.hourly.carbon_dioxide.slice(0, 24); // First 24 hours

            const recentAvg = recentCO2.reduce((a, b) => a + b, 0) / recentCO2.length;
            const oldAvg = oldCO2.reduce((a, b) => a + b, 0) / oldCO2.length;
            const emissionChange = ((recentAvg - oldAvg) / oldAvg) * 100;

            // Determine status based on AQI
            let status: 'normal' | 'warning' | 'critical' = 'normal';
            if (data.current.us_aqi > 150) status = 'critical';
            else if (data.current.us_aqi > 100) status = 'warning';

            return {
                region: key,
                latitude: coords.lat,
                longitude: coords.lon,
                co2: data.current.carbon_dioxide,
                emission_change: emissionChange,
                ndvi: 0.65, // Placeholder - NDVI perlu API terpisah
                status,
                updated: new Date().toISOString(),
                aqi: data.current.us_aqi,
            };
        } catch (error) {
            console.error(`Error fetching data for ${key}:`, error);
            return null;
        }
    });

    const results = await Promise.all(regionPromises);
    return results.filter((r): r is RegionalData => r !== null);
}

/**
 * Hitung metrics agregat untuk dashboard
 */
export async function getDashboardMetrics(
    latitude: number = -6.2088,
    longitude: number = 106.8456
): Promise<DashboardMetrics> {
    const current = await getCurrentAirQuality(latitude, longitude);
    const historical = await getHistoricalAirQuality(latitude, longitude, 30);

    // Calculate average CO2 from last 7 days
    const last7Days = historical.hourly.carbon_dioxide.slice(-168); // 7 * 24 hours
    const co2Average = last7Days.reduce((a, b) => a + b, 0) / last7Days.length;

    // Calculate emission change (last 7 days vs previous 7 days)
    const recent7Days = historical.hourly.carbon_dioxide.slice(-168);
    const previous7Days = historical.hourly.carbon_dioxide.slice(-336, -168);

    const recentAvg = recent7Days.reduce((a, b) => a + b, 0) / recent7Days.length;
    const prevAvg = previous7Days.reduce((a, b) => a + b, 0) / previous7Days.length;
    const emissionChange = ((recentAvg - prevAvg) / prevAvg) * 100;

    return {
        co2_average: Math.round(co2Average),
        emission_change: Math.round(emissionChange * 10) / 10,
        ndvi_index: 0.68, // Placeholder
        aqi_average: current.current.us_aqi,
        timestamp: current.current.time,
    };
}

/**
 * Format data untuk CO₂ trend chart
 */
export function formatCO2TrendData(historical: AirQualityHistoricalData) {
    return historical.hourly.time.map((time, index) => ({
        time,
        value: historical.hourly.carbon_dioxide[index],
    }));
}

/**
 * Get data quality disclaimer information
 */
export function getDataLimitations() {
    return {
        source: 'Open-Meteo Air Quality API',
        limitations: [
            'Data historis maksimal 92 hari',
            'Data CO₂ dan polutan udara dari model atmosferik',
            'Update setiap 15 menit untuk data current',
            'NDVI data memerlukan sumber terpisah (NASA/MODIS)',
            'Data bersifat estimasi dan dapat berbeda dengan pengukuran ground station',
        ],
        coverage: 'Global',
        updateFrequency: '15 menit',
        availability: '99.9% (bergantung pada Open-Meteo service)',
    };
}
