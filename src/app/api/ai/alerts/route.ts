/**
 * AI-Powered Climate Alerts API
 * Menggunakan AI untuk menganalisis data real-time dan generate alerts yang relevan
 */

import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface AlertRequest {
    location?: {
        lat: number;
        lng: number;
        city: string;
    };
    mapData?: {
        co2?: number;
        ndvi?: number;
        airQuality?: string;
        temperature?: number;
    };
    analyticsData?: {
        co2Average?: number;
        emissionChange?: number;
        ndviIndex?: number;
        tempAnomaly?: number;
    };
}

interface AIAlert {
    id: string;
    type: "critical" | "warning" | "notice";
    category: "co2" | "ndvi" | "temperature" | "emission" | "general";
    title: string;
    description: string;
    region: string;
    icon: string;
    severity: number; // 1-10
    timestamp: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: AlertRequest = await req.json();
        const { location, mapData, analyticsData } = body;

        // Fallback alerts jika API key tidak tersedia
        if (!GROQ_API_KEY) {
            return NextResponse.json({
                success: true,
                alerts: getFallbackAlerts(location, mapData, analyticsData),
                confidence: 85,
                source: "fallback",
            });
        }

        // Build context untuk AI
        let context = "Analyze the following real-time climate data and generate 3 critical alerts (in Indonesian language):\n\n";

        if (location) {
            context += `📍 User Location: ${location.city}\n`;
            context += `   Coordinates: ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E\n\n`;
        }

        if (mapData) {
            context += `🌍 Real-Time Environmental Data:\n`;
            if (mapData.co2 !== undefined) {
                const globalAvg = 415;
                const diff = mapData.co2 - globalAvg;
                context += `   - CO₂: ${mapData.co2.toFixed(1)} ppm (${diff > 0 ? '+' : ''}${diff.toFixed(1)} ppm vs global avg ${globalAvg} ppm)\n`;
            }
            if (mapData.ndvi !== undefined) {
                context += `   - NDVI: ${mapData.ndvi.toFixed(3)} (Vegetation index)\n`;
            }
            if (mapData.airQuality) {
                context += `   - Air Quality: ${mapData.airQuality}\n`;
            }
            if (mapData.temperature !== undefined) {
                context += `   - Temperature: ${mapData.temperature}°C\n`;
            }
            context += `\n`;
        }

        if (analyticsData) {
            context += `📊 Global Analytics:\n`;
            if (analyticsData.co2Average) context += `   - Global CO₂ Average: ${analyticsData.co2Average} ppm\n`;
            if (analyticsData.emissionChange) context += `   - Emission Change: +${analyticsData.emissionChange}%\n`;
            if (analyticsData.ndviIndex) context += `   - NDVI Index: ${analyticsData.ndviIndex}\n`;
            if (analyticsData.tempAnomaly) context += `   - Temp Anomaly: +${analyticsData.tempAnomaly}°C\n`;
        }

        context += `\nBased on the data above, generate EXACTLY 3 climate alerts in JSON format.
Each alert MUST have this exact structure:
{
    "type": "critical" | "warning" | "notice",
    "category": "co2" | "ndvi" | "temperature" | "emission",
    "title": "Short title (max 20 chars)",
    "description": "Detailed description in Indonesian (max 100 chars)",
    "region": "Region name or 'Global'",
    "icon": "appropriate emoji",
    "severity": 1-10
}

Rules:
1. Use ONLY Indonesian language for title and description
2. At least 1 alert must be "critical" type
3. Make alerts relevant to the actual data provided
4. Use appropriate emojis: 🌡️ (temp), 🚨 (critical), ⚠️ (warning), 🌱 (vegetation)
5. Return ONLY a valid JSON array, nothing else

Example output format:
[
    {
        "type": "critical",
        "category": "co2",
        "title": "CO₂ Tinggi",
        "description": "Tingkat CO₂ mencapai 420 ppm di wilayah Asia, melebihi ambang kritis",
        "region": "Asia",
        "icon": "🚨",
        "severity": 9
    }
]`;

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a climate data analyst. You MUST respond with ONLY valid JSON array, no additional text, no markdown, no explanations. Use Indonesian language for user-facing text.",
                    },
                    {
                        role: "user",
                        content: context,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "[]";

        // Parse AI response
        let alerts: AIAlert[] = [];
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = aiResponse
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();

            const parsedAlerts = JSON.parse(cleanedResponse);

            // Add ID and timestamp to each alert
            alerts = parsedAlerts.map((alert: any, index: number) => ({
                id: `ai-alert-${Date.now()}-${index}`,
                type: alert.type || "notice",
                category: alert.category || "general",
                title: alert.title || "Climate Alert",
                description: alert.description || "Data analysis in progress",
                region: alert.region || "Global",
                icon: alert.icon || "📊",
                severity: alert.severity || 5,
                timestamp: new Date().toISOString(),
            }));
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            console.log("AI Response:", aiResponse);
            // Use fallback if parsing fails
            alerts = getFallbackAlerts(location, mapData, analyticsData);
        }

        // Ensure we have at least 3 alerts
        if (alerts.length < 3) {
            const fallbackAlerts = getFallbackAlerts(location, mapData, analyticsData);
            alerts = [...alerts, ...fallbackAlerts].slice(0, 3);
        }

        return NextResponse.json({
            success: true,
            alerts: alerts.slice(0, 3), // Return top 3 alerts
            confidence: 90,
            source: "ai",
            model: "llama-3.3-70b-versatile",
        });
    } catch (error) {
        console.error("Error in AI alerts API:", error);

        // Return fallback alerts on error
        const { location, mapData, analyticsData } = await req.json();
        return NextResponse.json({
            success: true,
            alerts: getFallbackAlerts(location, mapData, analyticsData),
            confidence: 85,
            source: "fallback",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

/**
 * Generate fallback alerts based on available data
 */
function getFallbackAlerts(
    location?: { city: string; lat: number; lng: number },
    mapData?: { co2?: number; ndvi?: number; airQuality?: string },
    analyticsData?: { tempAnomaly?: number; emissionChange?: number }
): AIAlert[] {
    const alerts: AIAlert[] = [];
    const now = new Date();

    // Alert 1: Temperature (always include)
    alerts.push({
        id: `alert-temp-${Date.now()}`,
        type: "critical",
        category: "temperature",
        title: "Anomali Suhu",
        description: `Suhu Arktik +${analyticsData?.tempAnomaly || 2.5}°C di atas baseline`,
        region: "Arktik",
        icon: "🌡️",
        severity: 10,
        timestamp: now.toISOString(),
    });

    // Alert 2: CO₂ based on real data or fallback
    const co2Level = mapData?.co2 || 420;
    const co2Region = location?.city || "Asia";
    alerts.push({
        id: `alert-co2-${Date.now()}`,
        type: co2Level > 420 ? "critical" : "warning",
        category: "co2",
        title: "Tingkat CO₂ Tinggi",
        description: `Tingkat CO₂ mencapai ${co2Level.toFixed(0)} ppm di wilayah ${co2Region}`,
        region: co2Region,
        icon: "🚨",
        severity: co2Level > 420 ? 9 : 7,
        timestamp: now.toISOString(),
    });

    // Alert 3: NDVI based on real data or fallback
    const ndviValue = mapData?.ndvi || 0.58;
    alerts.push({
        id: `alert-ndvi-${Date.now()}`,
        type: ndviValue < 0.6 ? "warning" : "notice",
        category: "ndvi",
        title: "Indeks Vegetasi",
        description: `Indeks vegetasi turun ke ${ndviValue.toFixed(2)} di Afrika`,
        region: "Afrika",
        icon: ndviValue < 0.6 ? "⚠️" : "🌱",
        severity: ndviValue < 0.6 ? 7 : 5,
        timestamp: now.toISOString(),
    });

    return alerts;
}

// GET method untuk testing
export async function GET(req: NextRequest) {
    return NextResponse.json({
        success: true,
        message: "AI Alerts API is running. Use POST method with location and data context.",
        endpoint: "/api/ai/alerts",
        method: "POST",
        requiredBody: {
            location: { lat: "number", lng: "number", city: "string" },
            mapData: { co2: "number", ndvi: "number", airQuality: "string" },
            analyticsData: { co2Average: "number", emissionChange: "number" },
        },
    });
}
