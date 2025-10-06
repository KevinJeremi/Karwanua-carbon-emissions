import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { findCityCoordinates, extractCityFromQuery, extractCitiesFromComparisonQuery } from "../city-database";

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

// 🔄 Cache for CO2 data (prevent unnecessary API calls)
const dataCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch CO2 data from API with caching
 */
async function fetchCO2Data(lat: number, lon: number, cityName: string): Promise<string> {
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;

    // Check cache first
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('✅ Using cached data for', cityName);
        return cached.data;
    }

    try {
        // Determine base URL for API calls
        // In Vercel: VERCEL_URL is set automatically
        // Locally: fallback to localhost
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_VERCEL_URL
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
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

            const result = `✅ Data CO₂ untuk ${cityName}:
- Nilai CO₂: ${co2.toFixed(1)} ppm
- Global Average: ${globalAvg} ppm
- Status: ${diff > 0 ? `${diff.toFixed(1)} ppm di atas rata-rata global` : `${Math.abs(diff).toFixed(1)} ppm di bawah rata-rata global`}
- Data Time: ${timestamp}
- Kualitas Udara: ${co2 < 410 ? 'Baik ✅' : co2 < 420 ? 'Sedang ⚠️' : 'Buruk 🚨'}`;

            // Store in cache
            dataCache.set(cacheKey, { data: result, timestamp: Date.now() });

            return result;
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

        // Try to extract city names from query (support comparison queries)
        const cities = extractCitiesFromComparisonQuery(userQuery);
        let fetchedData = '';

        if (cities.length > 0) {
            console.log('🔍 Detected city query:', cities);

            // Fetch data for all cities mentioned
            const dataPromises = cities.map(async (cityName) => {
                const coords = findCityCoordinates(cityName);
                if (coords) {
                    console.log('✅ Found coordinates for', coords.name, ':', coords);
                    return await fetchCO2Data(coords.lat, coords.lon, coords.name);
                }
                return null;
            });

            const results = await Promise.all(dataPromises);
            fetchedData = results.filter(r => r !== null).join('\n\n');

            if (fetchedData) {
                console.log('📊 Fetched data for', cities.length, 'city/cities');
            }
        }

        // Build system message with optional context
        let systemContent = `You are an expert climate science AI assistant for Karwanua application.
You help users understand:
- CO₂ emissions and air quality data from Open-Meteo Air Quality API (real-time satellite data)
- NDVI (vegetation health) measurements from NASA MODIS
- Temperature anomalies and climate trends
- Environmental impacts and mitigation strategies

🚨 CRITICAL RULES - NEVER VIOLATE THESE:
1. NEVER MAKE UP CO₂ VALUES - You must ONLY use data provided in the "FRESHLY FETCHED DATA" section below
2. NEVER MODIFY OR CHANGE the CO₂ numbers from the fetched data
3. If you see "✅ Data CO₂ untuk [city]: - Nilai CO₂: X ppm", you MUST use EXACTLY that number X
4. DO NOT generate different numbers each time, even if asked repeatedly
5. DO NOT add random variations to the data
6. DO NOT continue patterns from previous messages (e.g., if previous was 430, don't make it 435)
7. If NO fresh data is provided, say "Saya tidak memiliki data terbaru untuk lokasi tersebut"

CRITICAL DATA SOURCE INFORMATION:
- ALL CO₂ data comes from Open-Meteo Air Quality API (https://open-meteo.com/en/docs/air-quality-api)
- CO₂ values are measured in ppm (parts per million)
- Current global average is approximately 415 ppm
- Data is real-time and location-specific
- The SAME location will return the SAME CO₂ value (it changes slowly over hours/days, not instantly)

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
            systemContent += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 FRESHLY FETCHED DATA - USE THIS EXACT DATA 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${fetchedData}

⚠️ MANDATORY INSTRUCTIONS:
- You MUST use the EXACT CO₂ value shown above
- DO NOT modify, change, or generate a different number
- DO NOT add +5 ppm or any variation
- If user asks multiple times "cek lagi", give the SAME number (because real data doesn't change every second)
- ALWAYS use DOT (.) as decimal separator, NEVER use comma (,)
- Format: "457.0 ppm" ✅ NOT "457,0 ppm" ❌
- Only present the data directly - no need to ask for permission

Example correct response:
"Berdasarkan data real-time dari Open-Meteo API, CO₂ di Jakarta saat ini adalah 457.0 ppm."

Example WRONG responses (NEVER DO THIS):
❌ "CO₂ di Jakarta adalah 430 ppm" (when the fetched data says 425.0 ppm)
❌ "CO₂ di Jakarta adalah 457,0 ppm" (using comma instead of dot)
❌ "CO₂ di Jakarta adalah 457 ppm" (missing .0 for consistency)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
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
            temperature: 0.3, // Lower temperature = more consistent, less creative
            max_tokens: maxTokens,
            top_p: 0.85,
        });

        let response = chatCompletion.choices[0]?.message?.content || "";

        // 🛡️ NORMALIZE & VALIDATE RESPONSE
        if (fetchedData && response) {
            // Extract ALL CO₂ values from fetched data
            const fetchedCO2Matches = fetchedData.matchAll(/Nilai CO₂: ([\d.]+) ppm/g);
            const actualCO2Values = Array.from(fetchedCO2Matches).map(m => parseFloat(m[1]));

            if (actualCO2Values.length > 0) {
                // Step 1: Normalize decimal separator (comma → dot)
                response = response.replace(/(\d{3,4}),(\d+)\s*ppm/g, '$1.$2 ppm');

                // Step 2: Add .0 to whole numbers for consistency (457 ppm → 457.0 ppm)
                response = response.replace(/(\d{3,4})(\s+ppm)(?!\d)/g, (match, num, unit) => {
                    // Only add .0 if it doesn't already have a decimal
                    if (!num.includes('.')) {
                        return `${num}.0${unit}`;
                    }
                    return match;
                });

                // Step 3: Check if AI is making up values
                const responseCO2Match = response.match(/(\d{3,4}(?:[.,]\d+)?)\s*ppm/g);

                if (responseCO2Match) {
                    const responseCO2Values = responseCO2Match.map(m => {
                        const numStr = m.match(/(\d{3,4}(?:[.,]\d+)?)/)?.[1] || '0';
                        return parseFloat(numStr.replace(',', '.'));
                    });

                    // Check if AI is making up values
                    // Only flag as fake if response value doesn't match ANY of the actual values (tolerance 1.0 ppm)
                    const hasFakeValue = responseCO2Values.some(responseVal =>
                        !actualCO2Values.some(actualVal => Math.abs(responseVal - actualVal) <= 1.0)
                    );

                    // Only override for single-city queries with fake values
                    // Don't override comparison queries (multiple cities)
                    if (hasFakeValue && actualCO2Values.length === 1) {
                        console.warn('⚠️ AI HALLUCINATION DETECTED! Correcting response...');
                        console.warn('Actual CO₂:', actualCO2Values, 'AI said:', responseCO2Values);

                        // Extract city name
                        const cityMatch = fetchedData.match(/Data CO₂ untuk (.+?):/);
                        const cityName = cityMatch ? cityMatch[1] : 'lokasi tersebut';
                        const actualCO2 = actualCO2Values[0];

                        // Force correct response with consistent formatting
                        response = `Berdasarkan data real-time dari Open-Meteo Air Quality API, CO₂ di ${cityName} saat ini adalah ${actualCO2.toFixed(1)} ppm.

${actualCO2 < 415 ? '✅ Kualitas udara baik (di bawah rata-rata global 415 ppm)' : actualCO2 < 425 ? '⚠️ Kualitas udara sedang' : '🚨 Kualitas udara buruk (di atas rata-rata global)'}

💡 Data ini berasal langsung dari satelit dan sensor real-time, jadi nilainya konsisten saat dicek berulang kali.`;
                    }
                }
            }
        }

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
