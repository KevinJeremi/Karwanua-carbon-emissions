/**
 * useLayerControl Hook
 * Manages map layer state and transitions
 */

import { useState, useCallback, useEffect } from 'react';
import type { GIBSLayerType } from '@/types/gibs-layers';

interface UseLayerControlOptions {
    initialLayer?: GIBSLayerType;
    initialDate?: string;
    initialShowAirQuality?: boolean;
    onLayerChange?: (layer: GIBSLayerType) => void;
    onDateChange?: (date: string) => void;
}

interface UseLayerControlReturn {
    activeLayer: GIBSLayerType;
    selectedDate: string;
    showAirQuality: boolean;
    ndviOpacity: number;
    ndviCellSize: number;
    isLayerLoading: boolean;
    setActiveLayer: (layer: GIBSLayerType) => void;
    setSelectedDate: (date: string) => void;
    setShowAirQuality: (show: boolean) => void;
    setNdviOpacity: (opacity: number) => void;
    setNdviCellSize: (size: number) => void;
}

export function useLayerControl({
    initialLayer = 'truecolor',
    initialDate = new Date(Date.now() - 86400000).toISOString().split('T')[0],
    initialShowAirQuality = true,
    onLayerChange,
    onDateChange,
}: UseLayerControlOptions = {}): UseLayerControlReturn {
    const [activeLayer, setActiveLayerState] = useState<GIBSLayerType>(initialLayer);
    const [selectedDate, setSelectedDateState] = useState(initialDate);
    const [showAirQuality, setShowAirQuality] = useState(initialShowAirQuality);
    const [ndviOpacity, setNdviOpacity] = useState(0.7);
    const [ndviCellSize, setNdviCellSize] = useState(0.003);
    const [isLayerLoading, setIsLayerLoading] = useState(false);

    const setActiveLayer = useCallback(
        (layer: GIBSLayerType) => {
            setIsLayerLoading(true);
            setActiveLayerState(layer);
            onLayerChange?.(layer);

            // Simulate layer loading (remove in production if not needed)
            setTimeout(() => {
                setIsLayerLoading(false);
            }, 500);
        },
        [onLayerChange]
    );

    const setSelectedDate = useCallback(
        (date: string) => {
            setSelectedDateState(date);
            onDateChange?.(date);
        },
        [onDateChange]
    );

    return {
        activeLayer,
        selectedDate,
        showAirQuality,
        ndviOpacity,
        ndviCellSize,
        isLayerLoading,
        setActiveLayer,
        setSelectedDate,
        setShowAirQuality,
        setNdviOpacity,
        setNdviCellSize,
    };
}
