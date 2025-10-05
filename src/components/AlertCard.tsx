"use client";

import { useState, useEffect } from "react";
import { useAppData } from "@/contexts/AppDataContext";
import { Loader2 } from "lucide-react";

interface AIAlert {
    id: string;
    type: "critical" | "warning" | "notice";
    category: string;
    title: string;
    description: string;
    region: string;
    icon: string;
    severity: number;
}

export function AlertCard() {
    const [alerts, setAlerts] = useState<AIAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confidence, setConfidence] = useState(85);
    const { locationData, mapData, analyticsData } = useAppData();

    useEffect(() => {
        const fetchAIAlerts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/ai/alerts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        location: locationData,
                        mapData: mapData,
                        analyticsData: analyticsData,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setAlerts(data.alerts || []);
                    setConfidence(data.confidence || 85);
                }
            } catch (error) {
                console.error("Error fetching AI alerts:", error);
                // Keep alerts empty on error
                setAlerts([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch alerts when component mounts or when data changes
        fetchAIAlerts();
    }, [locationData?.lat, locationData?.lng, mapData?.co2, mapData?.ndvi, analyticsData?.co2Average]);

    const getAlertColor = (type: string) => {
        switch (type) {
            case "critical":
                return { text: "text-red-700", bg: "text-red-600" };
            case "warning":
                return { text: "text-orange-700", bg: "text-orange-500" };
            case "notice":
                return { text: "text-blue-700", bg: "text-blue-500" };
            default:
                return { text: "text-gray-700", bg: "text-gray-500" };
        }
    };

    const capitalizeType = (type: string) => {
        if (type === "critical") return "Critical";
        if (type === "warning") return "Warning";
        if (type === "notice") return "Notice";
        return type;
    };

    return (
        <div className="rounded-2xl shadow p-6 text-gray-900" style={{ backgroundColor: "#fbcb47" }}>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Critical Alerts</h2>
                <div className="px-2 py-1 bg-purple-600/20 rounded-full flex items-center gap-1">
                    <span className="text-xs font-semibold text-purple-800">🧠 AI {confidence}%</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                    <span className="ml-2 text-sm text-gray-600">Menganalisis data...</span>
                </div>
            ) : alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    <p className="text-sm">Tidak ada alert saat ini</p>
                    <p className="text-xs mt-1">Sistem sedang memantau data...</p>
                </div>
            ) : (
                <ul className="space-y-2 text-sm">
                    {alerts.map((alert) => {
                        const colors = getAlertColor(alert.type);
                        return (
                            <li key={alert.id} className="flex items-start gap-2">
                                <span className={`${colors.bg} text-lg`}>{alert.icon}</span>
                                <div>
                                    <span className={`font-semibold ${colors.text}`}>
                                        {capitalizeType(alert.type)}
                                    </span>
                                    <p className="text-gray-700">{alert.description}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
