import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

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

        // Build system message with optional context
        let systemContent = `You are an expert climate science AI assistant for EcoTrack application.
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

IMPORTANT INSTRUCTIONS:
- When user asks about CO₂ at their location, ALWAYS refer to the "Real-Time Environmental Data" in the user context below
- Use the EXACT CO₂ value provided in the context (from Open-Meteo API)
- Keep answers SHORT and CONCISE (2-3 sentences max) unless user explicitly asks for detailed explanation
- Only provide detailed, long answers when user asks "explain in detail", "tell me more", or similar requests
- Use simple language and be direct
- Use emojis sparingly (1-2 per response)
- Provide data-driven answers when possible
- If explaining complex topics, use bullet points for clarity
- NEVER make up CO₂ values - always use the data from user context`;

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
