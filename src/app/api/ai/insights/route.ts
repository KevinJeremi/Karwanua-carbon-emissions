import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { co2Level, ndvi, temperature, location, region } = body;

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: "Groq API key not configured" },
                { status: 500 }
            );
        }

        const systemPrompt = `You are an expert climate scientist AI assistant analyzing Earth observation data from NASA satellites. 
Your task is to provide clear, actionable climate insights based on the data provided.
Format your response as a JSON array of insights with this structure:
[{
  "title": "Short descriptive title with emoji",
  "summary": "Detailed analysis (2-3 sentences)",
  "severity": "critical|warning|positive|info",
  "confidence": 85,
  "tags": ["#tag1", "#tag2"]
}]

Focus on:
- CO₂ emission trends and air quality
- NDVI (vegetation health) changes
- Temperature anomalies
- Environmental impacts
- Actionable recommendations

Be specific about the location and provide confidence scores based on data quality.`;

        const userPrompt = `Analyze this climate data and generate 3-4 insights:

Location: ${location || region || "Global"}
CO₂ Level: ${co2Level ? `${co2Level} ppm` : "Not available"}
NDVI Index: ${ndvi ? ndvi.toFixed(3) : "Not available"}
Temperature: ${temperature ? `${temperature}°C` : "Not available"}

Generate insights focusing on trends, risks, and recommendations.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1500,
            top_p: 0.9,
        });

        const content = chatCompletion.choices[0]?.message?.content || "[]";

        // Extract JSON from response
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const insights = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    insights,
                    usage: chatCompletion.usage,
                });
            } else {
                throw new Error("No valid JSON found in response");
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", content);
            return NextResponse.json(
                { error: "Failed to parse AI insights", rawResponse: content },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Groq Insights Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate insights" },
            { status: 500 }
        );
    }
}
