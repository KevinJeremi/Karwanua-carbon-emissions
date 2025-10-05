/**
 * Types untuk Open-Meteo Air Quality API
 */

export interface AirQualityCurrentData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: {
        time: string;
        interval: string;
        carbon_dioxide: string;
        pm10: string;
        pm2_5: string;
        carbon_monoxide: string;
        nitrogen_dioxide: string;
        sulphur_dioxide: string;
        ozone: string;
        us_aqi: string;
        european_aqi?: string;
    };
    current: {
        time: string;
        interval: number;
        carbon_dioxide: number;
        pm10: number;
        pm2_5: number;
        carbon_monoxide: number;
        nitrogen_dioxide: number;
        sulphur_dioxide: number;
        ozone: number;
        us_aqi: number;
        european_aqi?: number;
    };
}

export interface AirQualityHistoricalData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
        time: string;
        carbon_dioxide: string;
        pm10: string;
        pm2_5: string;
        carbon_monoxide: string;
        nitrogen_dioxide: string;
        sulphur_dioxide: string;
        ozone: string;
        us_aqi: string;
    };
    hourly: {
        time: string[];
        carbon_dioxide: number[];
        pm10: number[];
        pm2_5: number[];
        carbon_monoxide: number[];
        nitrogen_dioxide: number[];
        sulphur_dioxide: number[];
        ozone: number[];
        us_aqi: number[];
    };
}

export interface RegionalData {
    region: string;
    latitude: number;
    longitude: number;
    co2: number;
    emission_change: number; // percentage
    ndvi: number;
    status: 'normal' | 'warning' | 'critical';
    updated: string;
    aqi: number;
}

export interface DashboardMetrics {
    co2_average: number;
    emission_change: number;
    ndvi_index: number;
    aqi_average: number;
    timestamp: string;
}

export interface PollutantTrend {
    time: string;
    value: number;
}

export interface EmissionByRegion {
    region: string;
    emission: number;
    change: number;
}
