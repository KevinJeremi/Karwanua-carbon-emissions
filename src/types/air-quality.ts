/**
 * TypeScript types untuk Open-Meteo Air Quality API
 * Documentation: https://open-meteo.com/en/docs/air-quality-api
 */

export interface AirQualityData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    current: CurrentAirQuality;
    current_units: AirQualityUnits;
}

export interface CurrentAirQuality {
    time: string;
    interval: number;
    carbon_monoxide: number | null;
    carbon_dioxide: number | null;
    pm10: number | null;
    pm2_5: number | null;
    nitrogen_dioxide?: number | null;
    sulphur_dioxide?: number | null;
    ozone?: number | null;
    dust?: number | null;
    uv_index?: number | null;
}

export interface AirQualityUnits {
    time: string;
    interval: string;
    carbon_monoxide: string;
    carbon_dioxide: string;
    pm10: string;
    pm2_5: string;
    nitrogen_dioxide?: string;
    sulphur_dioxide?: string;
    ozone?: string;
    dust?: string;
    uv_index?: string;
}

export interface AirQualityLocation {
    name: string;
    latitude: number;
    longitude: number;
    timezone?: string;
}

export interface AirQualityResponse {
    success: boolean;
    data?: AirQualityData;
    error?: string;
    location?: AirQualityLocation;
    metadata?: {
        isRealTimeData: boolean;
        requestedDate: string;
        dataTimestamp?: string;
        note?: string;
    };
}

// Helper type untuk status kualitas udara
export type AirQualityStatus = 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

export interface AirQualityAssessment {
    status: AirQualityStatus;
    color: string;
    message: string;
    pm25Level: number;
}
