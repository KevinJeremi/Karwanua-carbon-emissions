import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { insights } = body;

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: "Groq API key not configured" },
                { status: 500 }
            );
        }

        const prompt = `Based on these climate insights, generate 3-4 actionable recommendations:

${insights.map((i: any, idx: number) => `${idx + 1}. ${i.title}\n   ${i.summary}`).join("\n\n")}

Format response as JSON array:
[{
  "icon": "emoji",
  "title": "Action title",
  "description": "Detailed description (1-2 sentences)",
  "priority": "high|medium|low"
}]

Focus on practical, implementable actions.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.8,
            max_tokens: 1000,
        });

        const content = chatCompletion.choices[0]?.message?.content || "[]";

        // Extract JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const recommendations = JSON.parse(jsonMatch[0]);
            return NextResponse.json({
                recommendations,
                usage: chatCompletion.usage,
            });
        }

        return NextResponse.json({ recommendations: [] });
    } catch (error: any) {
        console.error("Recommendations Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate recommendations" },
            { status: 500 }
        );
    }
}
