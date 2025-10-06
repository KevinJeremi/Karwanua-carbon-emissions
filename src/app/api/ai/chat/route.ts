import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { findCityCoordinates, extractCityFromQuery } from "../city-database";

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

/**
 * Fetch CO2 data from API
 */
async function fetchCO2Data(lat: number, lon: number, cityName: string): Promise<string> {
    try {
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const url = `${baseUrl}/api/air-quality?lat=${lat}&lon=${lon}&location=${encodeURIComponent(cityName)}`;
        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data?.current) {
            const co2 = data.data.current.carbon_dioxide;
            const timestamp = data.data.current.time;
            const globalAvg = 415;
            const diff = co2 - globalAvg;

            return `✅ Data CO₂ untuk ${cityName}:
- Nilai CO₂: ${co2.toFixed(1)} ppm
- Global Average: ${globalAvg} ppm
- Status: ${diff > 0 ? `${diff.toFixed(1)} ppm di atas rata-rata global` : `${Math.abs(diff).toFixed(1)} ppm di bawah rata-rata global`}
- Data Time: ${timestamp}
- Kualitas Udara: ${co2 < 410 ? 'Baik ✅' : co2 < 420 ? 'Sedang ⚠️' : 'Buruk 🚨'}`;
        }

        return `⚠️ Data tidak tersedia untuk ${cityName}`;
    } catch (error) {
        console.error('Error fetching CO2:', error);
        return `❌ Gagal mengambil data CO₂ untuk ${cityName}`;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, temperature = 0.7, maxTokens = 1500, systemContext } = body;

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: "Groq API key not configured" },
                { status: 500 }
            );
        }

        // 🚀 PROACTIVE DATA FETCHING
        // Extract last user message
        const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
        const userQuery = lastUserMessage?.content || '';

        // Try to extract city name from query
        const cityName = extractCityFromQuery(userQuery);
        let fetchedData = '';

        if (cityName) {
            console.log('🔍 Detected city query:', cityName);

            // Find coordinates
            const coords = findCityCoordinates(cityName);

            if (coords) {
                console.log('✅ Found coordinates:', coords);

                // Proactively fetch CO2 data
                fetchedData = await fetchCO2Data(coords.lat, coords.lon, coords.name);
                console.log('📊 Fetched data:', fetchedData);
            }
        }

        // Build system message with optional context
        let systemContent = `You are an expert climate science AI assistant for Karwanua application.
You help users understand:
- CO₂ emissions and air quality data from Open-Meteo Air Quality API (real-time satellite data)
- NDVI (vegetation health) measurements from NASA MODIS
- Temperature anomalies and climate trends
- Environmental impacts and mitigation strategies

CRITICAL DATA SOURCE INFORMATION:
- ALL CO₂ data comes from Open-Meteo Air Quality API (https://open-meteo.com/en/docs/air-quality-api)
- CO₂ values are measured in ppm (parts per million)
- Current global average is approximately 415 ppm
- Data is real-time and location-specific

PROACTIVE BEHAVIOR:
- When user asks about CO₂ in a specific city (e.g., "co2 di jakarta", "cek kalimantan"), I will AUTOMATICALLY fetch the data for them
- DO NOT ask for confirmation or coordinates - just present the data directly
- Be direct and actionable - users want answers, not questions
- If data is successfully fetched, present it immediately without asking

AVAILABLE API ENDPOINTS (You can suggest users to check these):
1. /api/air-quality?lat=<lat>&lon=<lon> 
   → Real-time CO₂, PM2.5, PM10, NO₂, SO₂, O₃, UV index for any location
   
2. /api/nasa-modis-ndvi?lat=<lat>&lon=<lon>&date=<YYYY-MM-DD>
   → NDVI vegetation index from NASA satellite data
   
3. /api/ndvi-grid?lat=<lat>&lon=<lon>&zoom=<zoom>
   → Grid of NDVI values for map visualization
   
4. /api/regional-emissions
   → Global CO₂, emission changes, and NDVI data by region (Asia, Africa, Europe, etc.)
   
5. /api/emission-trends?region=<region>&startYear=<year>
   → Historical CO₂ emission trends over time
   
6. /api/temperature-anomaly?region=<region>
   → Temperature anomaly data (deviation from baseline)
   
7. /api/alerts
   → Climate alerts based on real data (critical, warning, notice levels)
   
8. /api/ai/alerts (POST)
   → AI-generated intelligent alerts based on location and environmental data
   
9. /api/ai/analytics-summary (POST)
   → AI analysis summary of climate metrics and trends

IMPORTANT INSTRUCTIONS:
- When user asks about CO₂ at their location, ALWAYS refer to the "Real-Time Environmental Data" in the user context below
- Use the EXACT CO₂ value provided in the context (from Open-Meteo API)
- Keep answers SHORT and CONCISE (2-3 sentences max) unless user explicitly asks for detailed explanation
- Only provide detailed, long answers when user asks "explain in detail", "tell me more", or similar requests
- Use simple language and be direct
- Use emojis sparingly (1-2 per response)
- Provide data-driven answers when possible
- If explaining complex topics, use bullet points for clarity
- NEVER make up CO₂ values - always use the data from user context
- If user asks "what can I check" or "what data is available", recommend the relevant API endpoints above
- Support both English and Indonesian language`;

        // Add fetched data to system context
        if (fetchedData) {
            systemContent += `\n\n--- FRESHLY FETCHED DATA (Use this!) ---\n${fetchedData}\n\nPresent this data directly to the user. No need to ask for permission or confirmation.`;
        }

        // Add user's current data context if available
        if (systemContext && systemContext.trim()) {
            systemContent += `\n\n--- Current User Data (ALWAYS USE THIS DATA WHEN ANSWERING) ---\n${systemContext}\n\nWhen answering questions about "my location", "my area", "current CO₂", "berapa CO₂ di tempat saya", etc., ALWAYS use the CO₂ value from the "Real-Time Environmental Data" section above.`;
        }

        const systemMessage = {
            role: "system" as const,
            content: systemContent,
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemMessage, ...messages],
            model: "llama-3.1-8b-instant", // Fast and free
            temperature,
            max_tokens: maxTokens,
            top_p: 0.85,
        });

        const response = chatCompletion.choices[0]?.message?.content || "";

        return NextResponse.json({
            response,
            usage: chatCompletion.usage,
        });
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process request" },
            { status: 500 }
        );
    }
}
