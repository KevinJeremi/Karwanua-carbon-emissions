// src/app/api/ai/analytics-summary/route.ts
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { metrics, regionalData, alerts } = body;

        if (!GROQ_API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: "API key not configured",
                    summary: `CO₂ levels increased ${metrics.emissionChange?.toFixed(1) || '12.0'}% globally since 2019. NDVI average at ${metrics.ndviIndex?.toFixed(2) || '0.68'} indicating moderate vegetation health. Temperature anomaly detected at +${metrics.tempAnomaly?.toFixed(1) || '1.2'}°C above baseline. Immediate action recommended for emission reduction and reforestation programs.`,
                    confidence: 85
                },
                { status: 200 }
            );
        }

        // Build context from data
        let dataContext = `Analyze this climate data and provide a concise summary (max 3 sentences):

Global Metrics:
- CO₂ Average: ${metrics.co2Average || 418} ppm
- Emission Change: +${metrics.emissionChange?.toFixed(1) || '12.0'}% since 2019
- NDVI Index: ${metrics.ndviIndex?.toFixed(2) || '0.68'}
- Temperature Anomaly: +${metrics.tempAnomaly?.toFixed(1) || '1.2'}°C above baseline

`;

        if (regionalData && regionalData.length > 0) {
            dataContext += `\nTop Regions:\n`;
            regionalData.forEach((region: any, idx: number) => {
                dataContext += `${idx + 1}. ${region.region}: CO₂ ${region.co2}, NDVI ${region.ndvi}, Status: ${region.status}\n`;
            });
        }

        if (alerts && alerts.length > 0) {
            dataContext += `\nRecent Alerts:\n`;
            alerts.forEach((alert: any, idx: number) => {
                dataContext += `${idx + 1}. [${alert.type.toUpperCase()}] ${alert.title}\n`;
            });
        }

        dataContext += `\nProvide a brief, actionable summary emphasizing the most critical findings and recommendations.`;

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: "You are a climate data analyst AI. Provide concise, actionable insights in 2-3 sentences. Use specific numbers from the data. Be direct and clear."
                    },
                    {
                        role: "user",
                        content: dataContext
                    }
                ],
                temperature: 0.7,
                max_tokens: 200,
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const aiSummary = data.choices?.[0]?.message?.content || "Analysis complete. Data shows climate trends requiring attention.";

        // Calculate confidence based on data completeness
        let confidence = 70;
        if (metrics.co2Average > 0) confidence += 5;
        if (metrics.ndviIndex > 0) confidence += 5;
        if (metrics.tempAnomaly > 0) confidence += 5;
        if (regionalData && regionalData.length > 0) confidence += 5;
        if (alerts && alerts.length > 0) confidence += 5;
        confidence = Math.min(95, confidence);

        return NextResponse.json({
            success: true,
            summary: aiSummary,
            confidence,
            model: "groq-llama-3.1-8b",
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error("AI Analytics Summary Error:", error);

        // Fallback response
        const body = await req.json().catch(() => ({}));
        const metrics = body.metrics || {};

        return NextResponse.json({
            success: false,
            summary: `CO₂ levels increased ${metrics.emissionChange?.toFixed(1) || '12.0'}% globally since 2019. NDVI average at ${metrics.ndviIndex?.toFixed(2) || '0.68'} indicating moderate vegetation health. Temperature anomaly detected at +${metrics.tempAnomaly?.toFixed(1) || '1.2'}°C above baseline. Immediate action recommended for emission reduction and reforestation programs.`,
            confidence: 85,
            error: error.message,
        });
    }
}
