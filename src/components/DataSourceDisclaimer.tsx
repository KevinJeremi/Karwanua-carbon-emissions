/**
 * Data Source Disclaimer Component
 * Menjelaskan sumber data dan keterbatasannya
 */

'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, DatabaseIcon, AlertTriangleIcon, X } from 'lucide-react';
import { getDataLimitations } from '@/services/airQualityService';

/**
 * Info Button with Popover - Floating info button yang bisa diklik
 */
export function DataSourceInfoButton() {
    const [isOpen, setIsOpen] = useState(false);
    const limitations = getDataLimitations();

    return (
        <>
            {/* Floating Info Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
                title="Data Source Information"
            >
                <InfoIcon className="h-5 w-5" />
                <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Data Source Info
                </span>
            </button>

            {/* Modal/Popover */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <DatabaseIcon className="h-6 w-6" />
                                <h2 className="text-xl font-bold">Data Source Information</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Source Info */}
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                                <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                    Powered by: <Badge variant="outline" className="ml-1">{limitations.source}</Badge>
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 dark:text-gray-400 text-xs">Coverage</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{limitations.coverage}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 dark:text-gray-400 text-xs">Update Frequency</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{limitations.updateFrequency}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 dark:text-gray-400 text-xs">Availability</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{limitations.availability}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Limitations */}
                            <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50/50 dark:bg-orange-950/20">
                                <p className="font-semibold flex items-center gap-2 mb-3 text-gray-900 dark:text-gray-100">
                                    <AlertTriangleIcon className="h-4 w-4 text-orange-600" />
                                    Data Limitations:
                                </p>
                                <ul className="space-y-2">
                                    {limitations.limitations.map((limitation, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="text-orange-600 mt-0.5">•</span>
                                            <span>{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                    💡 <strong>Catatan Penting:</strong> Data ini bersifat estimasi untuk keperluan monitoring dan analisis.
                                    Untuk keputusan kritis, harap validasi dengan sumber data resmi pemerintah atau institusi terkait.
                                </p>
                            </div>

                            {/* Close Button */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/**
 * Compact inline version - untuk header/navbar
 */
export function DataSourceInfoInline() {
    const [isOpen, setIsOpen] = useState(false);
    const limitations = getDataLimitations();

    return (
        <div className="relative">
            {/* Info Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium transition-colors border border-blue-200 dark:border-blue-800"
                title="Data Source Information"
            >
                <InfoIcon className="h-3 w-3" />
                <span>Data Info</span>
            </button>

            {/* Dropdown Popover */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popover Content */}
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DatabaseIcon className="h-4 w-4" />
                                <span className="font-semibold text-sm">Data Source</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-0.5 hover:bg-white/20 rounded"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    Source: <Badge variant="outline" className="text-xs">{limitations.source}</Badge>
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                                        <span className="ml-1 font-medium">{limitations.coverage}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Update:</span>
                                        <span className="ml-1 font-medium">{limitations.updateFrequency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs font-semibold flex items-center gap-1 mb-2">
                                    <AlertTriangleIcon className="h-3 w-3 text-orange-600" />
                                    Limitations:
                                </p>
                                <ul className="text-xs space-y-1">
                                    {limitations.limitations.slice(0, 3).map((limitation, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                                            <span className="text-orange-600">•</span>
                                            <span>{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export function DataSourceDisclaimer() {
    const limitations = getDataLimitations();

    return (
        <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <DatabaseIcon className="h-4 w-4" />
                Data Source Information
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-3 mt-2">
                <div>
                    <p className="font-medium mb-1">
                        Powered by: <Badge variant="outline" className="ml-1">{limitations.source}</Badge>
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                            <span className="font-medium">Coverage:</span> {limitations.coverage}
                        </div>
                        <div>
                            <span className="font-medium">Update:</span> {limitations.updateFrequency}
                        </div>
                    </div>
                </div>

                <div className="border-t border-blue-200 pt-2">
                    <p className="font-medium flex items-center gap-1 mb-1">
                        <AlertTriangleIcon className="h-3 w-3" />
                        Data Limitations:
                    </p>
                    <ul className="text-xs space-y-1 ml-4 list-disc">
                        {limitations.limitations.map((limitation, index) => (
                            <li key={index}>{limitation}</li>
                        ))}
                    </ul>
                </div>

                <div className="text-xs italic border-t border-blue-200 pt-2">
                    💡 Data ini bersifat estimasi untuk keperluan monitoring dan analisis. Untuk keputusan kritis,
                    harap validasi dengan sumber data resmi pemerintah atau institusi terkait.
                </div>
            </AlertDescription>
        </Alert>
    );
}

/**
 * Compact version - untuk ditampilkan di footer/sidebar
 */
export function DataSourceBadge() {
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DatabaseIcon className="h-3 w-3" />
            <span>Data: Open-Meteo API</span>
            <Badge variant="outline" className="text-xs">Live</Badge>
        </div>
    );
}

/**
 * Simple tooltip version
 */
export function DataQualityIndicator({ quality = 'good' }: { quality?: 'good' | 'moderate' | 'limited' }) {
    const colors = {
        good: 'bg-green-500',
        moderate: 'bg-yellow-500',
        limited: 'bg-orange-500',
    };

    const labels = {
        good: 'High Quality Data',
        moderate: 'Moderate Quality',
        limited: 'Limited Data',
    };

    return (
        <div className="inline-flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${colors[quality]} animate-pulse`} />
            <span>{labels[quality]}</span>
        </div>
    );
}
