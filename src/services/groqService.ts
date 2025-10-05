/**
 * Groq AI Service
 * Menggunakan Groq API dengan model Llama 3.1 8B untuk climate intelligence analysis
 * Groq menyediakan inference yang sangat cepat dan gratis untuk Llama models
 */

export interface GroqMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface GroqChatRequest {
    model: string;
    messages: GroqMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    stream?: boolean;
}

export interface GroqChatResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface ClimateInsight {
    title: string;
    summary: string;
    severity: "critical" | "warning" | "positive" | "info";
    confidence: number;
    tags: string[];
}

class GroqService {
    private apiKey: string;
    private baseURL = "https://api.groq.com/openai/v1";
    // Model terbaik untuk climate analysis: llama-3.1-8b-instant (gratis & cepat)
    // Alternative: llama-3.1-70b-versatile (lebih powerful tapi lebih lambat)
    private defaultModel = "llama-3.1-8b-instant";

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
    }

    /**
     * Validasi API key tersedia
     */
    isConfigured(): boolean {
        return this.apiKey.length > 0;
    }

    /**
     * Generate climate insights berdasarkan data NASA
     */
    async generateClimateInsights(data: {
        co2Level?: number;
        ndvi?: number;
        temperature?: number;
        location?: string;
        region?: string;
    }): Promise<ClimateInsight[]> {
        if (!this.isConfigured()) {
            throw new Error("Groq API key not configured");
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

Location: ${data.location || data.region || "Global"}
CO₂ Level: ${data.co2Level ? `${data.co2Level} ppm` : "Not available"}
NDVI Index: ${data.ndvi ? data.ndvi.toFixed(3) : "Not available"}
Temperature: ${data.temperature ? `${data.temperature}°C` : "Not available"}

Generate insights focusing on trends, risks, and recommendations.`;

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.defaultModel,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.7,
                    max_tokens: 1500,
                    top_p: 0.9,
                } as GroqChatRequest),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Groq API error: ${response.status} - ${error}`);
            }

            const result: GroqChatResponse = await response.json();
            const content = result.choices[0]?.message?.content || "[]";

            // Parse JSON response
            try {
                // Ekstrak JSON dari response (handling case dimana AI menambahkan text lain)
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const insights = JSON.parse(jsonMatch[0]) as ClimateInsight[];
                    return insights;
                } else {
                    throw new Error("No valid JSON found in response");
                }
            } catch (parseError) {
                console.error("Failed to parse AI response:", content);
                throw new Error("Failed to parse AI insights");
            }
        } catch (error) {
            console.error("Groq API Error:", error);
            throw error;
        }
    }

    /**
     * Chat function untuk AI assistant
     */
    async chat(
        messages: GroqMessage[],
        options?: {
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<string> {
        if (!this.isConfigured()) {
            throw new Error("Groq API key not configured");
        }

        const systemMessage: GroqMessage = {
            role: "system",
            content: `You are an expert climate science AI assistant for Karwanua application.
You help users understand:
- CO₂ emissions and air quality data from NASA satellites
- NDVI (vegetation health) measurements from MODIS
- Temperature anomalies and climate trends
- Environmental impacts and mitigation strategies

Provide clear, accurate, and actionable answers. Use data from NASA Earth Observations when relevant.
Be concise but informative. Use emojis appropriately to make responses engaging.`,
        };

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.defaultModel,
                    messages: [systemMessage, ...messages],
                    temperature: options?.temperature || 0.7,
                    max_tokens: options?.maxTokens || 800,
                    top_p: 0.9,
                } as GroqChatRequest),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Groq API error: ${response.status} - ${error}`);
            }

            const result: GroqChatResponse = await response.json();
            return result.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
        } catch (error) {
            console.error("Groq Chat Error:", error);
            throw error;
        }
    }

    /**
     * Generate recommendations berdasarkan climate data
     */
    async generateRecommendations(insights: ClimateInsight[]): Promise<Array<{
        icon: string;
        title: string;
        description: string;
        priority: "high" | "medium" | "low";
    }>> {
        if (!this.isConfigured()) {
            throw new Error("Groq API key not configured");
        }

        const prompt = `Based on these climate insights, generate 3-4 actionable recommendations:

${insights.map((i, idx) => `${idx + 1}. ${i.title}\n   ${i.summary}`).join("\n\n")}

Format response as JSON array:
[{
  "icon": "emoji",
  "title": "Action title",
  "description": "Detailed description (1-2 sentences)",
  "priority": "high|medium|low"
}]

Focus on practical, implementable actions.`;

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.defaultModel,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8,
                    max_tokens: 1000,
                } as GroqChatRequest),
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status}`);
            }

            const result: GroqChatResponse = await response.json();
            const content = result.choices[0]?.message?.content || "[]";

            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [];
        } catch (error) {
            console.error("Failed to generate recommendations:", error);
            return [];
        }
    }
}

// Singleton instance
export const groqService = new GroqService();
