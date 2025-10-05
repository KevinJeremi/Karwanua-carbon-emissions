/**
 * TypeScript types untuk NASA GIBS Layer Configuration
 */

export type GIBSLayerType =
    | 'truecolor'
    | 'ndvi';

export interface GIBSLayerConfig {
    id: GIBSLayerType;
    name: string;
    description: string;
    layer: string; // GIBS layer identifier
    format: 'jpg' | 'png';
    tileMatrixSet: string;
    maxZoom: number;
    attribution: string;
    icon: string; // Emoji or icon
    available: boolean;
    dateRange?: {
        start: string; // YYYY-MM-DD
        end: string; // YYYY-MM-DD or 'present'
    };
}

export interface MapLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    airQualityData?: {
        co2?: number;
        co?: number;
        pm25?: number;
        pm10?: number;
        status?: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
        color?: string;
    };
}

export interface MapState {
    center: [number, number];
    zoom: number;
    activeLayer: GIBSLayerType;
    selectedDate: string; // YYYY-MM-DD
    showAirQuality: boolean;
    selectedLocation: string | null;
}

export interface LayerControlProps {
    activeLayer: GIBSLayerType;
    onLayerChange: (layer: GIBSLayerType) => void;
    selectedDate: string;
    onDateChange: (date: string) => void;
    showAirQuality: boolean;
    onToggleAirQuality: (show: boolean) => void;
}

// Predefined GIBS layers configuration
export const GIBS_LAYERS: Record<GIBSLayerType, GIBSLayerConfig> = {
    truecolor: {
        id: 'truecolor',
        name: 'True Color',
        description: 'Satellite true color imagery from MODIS Terra',
        layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        format: 'jpg',
        tileMatrixSet: '250m',
        // Allow higher zoom so the map isn't artificially capped by GIBS config
        // GIBS tiles may be lower resolution at extreme zooms, but UX needs zoom support
        maxZoom: 18,
        attribution: 'NASA GIBS / MODIS Terra',
        icon: '🌍',
        available: true,
        dateRange: {
            start: '2000-02-24',
            end: 'present',
        },
    },
    ndvi: {
        id: 'ndvi',
        name: 'Vegetation (NDVI)',
        description: 'Normalized Difference Vegetation Index',
        layer: 'MODIS_Terra_NDVI_8Day',
        format: 'png',
        tileMatrixSet: '250m',
        // Allow higher zoom so NDVI overlay can be viewed closer if desired
        maxZoom: 18,
        attribution: 'NASA GIBS / MODIS Terra',
        icon: '🌳',
        available: true,
        dateRange: {
            start: '2000-02-18',
            end: 'present',
        },
    },
};

// Predefined locations for monitoring
export const MONITORING_LOCATIONS: MapLocation[] = [
    {
        id: 'jakarta',
        name: 'Jakarta',
        latitude: -6.2088,
        longitude: 106.8456,
        country: 'Indonesia',
    },
    {
        id: 'surabaya',
        name: 'Surabaya',
        latitude: -7.2575,
        longitude: 112.7521,
        country: 'Indonesia',
    },
    {
        id: 'bandung',
        name: 'Bandung',
        latitude: -6.9175,
        longitude: 107.6191,
        country: 'Indonesia',
    },
    {
        id: 'medan',
        name: 'Medan',
        latitude: 3.5952,
        longitude: 98.6722,
        country: 'Indonesia',
    },
    {
        id: 'semarang',
        name: 'Semarang',
        latitude: -6.9932,
        longitude: 110.4203,
        country: 'Indonesia',
    },
    {
        id: 'amazon',
        name: 'Amazon Rainforest',
        latitude: -3.4653,
        longitude: -62.2159,
        country: 'Brazil',
    },
    {
        id: 'california',
        name: 'California',
        latitude: 36.7783,
        longitude: -119.4179,
        country: 'USA',
    },
];
