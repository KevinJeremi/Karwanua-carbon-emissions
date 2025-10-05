// src/app/api/ai/offset-solution/route.ts
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Tree species data - Expanded for better recommendations
const TREE_SPECIES = [
    { name: "Mangrove", absorptionRate: 22, suitability: ["coastal", "tropical", "wetland"], region: "coastal areas" },
    { name: "Oak", absorptionRate: 21, suitability: ["temperate", "urban", "forest"], region: "temperate regions" },
    { name: "Pine", absorptionRate: 13, suitability: ["temperate", "mountain", "forest"], region: "mountain areas" },
    { name: "Bamboo", absorptionRate: 35, suitability: ["tropical", "subtropical", "fast-growth"], region: "tropical/subtropical areas" },
    { name: "Eucalyptus", absorptionRate: 18, suitability: ["tropical", "dry", "fast-growth"], region: "dry tropical areas" },
    { name: "Mahogany", absorptionRate: 24, suitability: ["tropical", "rainforest", "hardwood"], region: "tropical rainforests" },
    { name: "Teak", absorptionRate: 20, suitability: ["tropical", "monsoon", "hardwood"], region: "monsoon regions" },
    { name: "Acacia", absorptionRate: 16, suitability: ["dry", "arid", "fast-growth"], region: "arid/semi-arid zones" },
    { name: "Banyan", absorptionRate: 19, suitability: ["tropical", "urban", "shade"], region: "urban tropical areas" },
    { name: "Neem", absorptionRate: 15, suitability: ["tropical", "medicinal", "urban"], region: "tropical urban areas" },
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { co2Level, location, ndvi, airQuality } = body;

        if (!GROQ_API_KEY) {
            // Fallback calculation
            return NextResponse.json({
                success: true,
                solution: generateFallbackSolution(co2Level, location, ndvi, airQuality),
            });
        }

        // Build AI prompt
        const prompt = `Analyze this environmental data and provide a precise, concise carbon offset solution.

Location: ${location || "Unknown"}
CO₂ Level: ${co2Level} ppm
NDVI (Vegetation): ${ndvi}
Air Quality: ${airQuality}

Available tree species (choose the MOST SUITABLE for this location):
${TREE_SPECIES.map(t => `- ${t.name}: ${t.absorptionRate} kg CO₂/year - Best for ${t.region} (${t.suitability.join(', ')})`).join('\n')}

Task:
1. Calculate trees needed to offset excess CO₂ (baseline: 350 ppm)
2. Recommend BEST tree species for this specific location based on climate/geography
3. Consider multiple species if beneficial (e.g., mix of fast-growing and long-term)
4. Provide 3 brief, actionable recommendations (max 15 words each)

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "treesNeeded": <number>,
  "treeSpecies": "<primary species name>",
  "secondarySpecies": "<optional secondary species or empty string>",
  "absorptionRate": <number>,
  "recommendations": ["brief action 1", "brief action 2", "brief action 3"],
  "analysis": "<one brief sentence explaining why this species was chosen>"
}`;

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
                        content: "You are a carbon offset calculation expert. Provide accurate, concise, data-driven recommendations. Always respond with valid JSON only. Keep recommendations brief (max 15 words each). No markdown formatting, no code blocks."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 350,
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "{}";

        // Parse AI response
        let aiSolution;
        try {
            // Extract JSON from response (in case AI adds text around it)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
            aiSolution = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse AI response:", aiResponse);
            aiSolution = generateFallbackSolution(co2Level, location, ndvi, airQuality);
        }

        // Validate and ensure all fields exist
        const solution = {
            treesNeeded: aiSolution.treesNeeded || Math.max(1, Math.ceil(co2Level / 22)),
            treeSpecies: aiSolution.treeSpecies || "Mangrove",
            absorptionRate: aiSolution.absorptionRate || 22,
            recommendations: aiSolution.recommendations || [
                "Plant mangrove trees in coastal areas",
                "Support local reforestation programs",
                "Reduce personal carbon footprint through sustainable practices",
            ],
            confidence: calculateConfidence(co2Level, ndvi, airQuality),
        };

        return NextResponse.json({
            success: true,
            solution,
            model: "groq-llama-3.1-8b",
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error("AI Offset Solution Error:", error);

        const body = await req.json().catch(() => ({}));
        const { co2Level, location, ndvi, airQuality } = body;

        return NextResponse.json({
            success: false,
            solution: generateFallbackSolution(co2Level || 418, location, ndvi || 0.5, airQuality),
            error: error.message,
        });
    }
}

function generateFallbackSolution(co2Level: number, location: string, ndvi: number, airQuality: string) {
    // Baseline CO₂ is 350 ppm
    const baseline = 350;
    const excess = Math.max(0, co2Level - baseline);

    // Choose tree species based on NDVI and location context
    let treeSpecies = "Mahogany"; // Default tropical
    let absorptionRate = 24;

    // Smart species selection
    if (ndvi > 0.7) {
        // Excellent vegetation, use hardwood for long-term benefits
        treeSpecies = "Teak";
        absorptionRate = 20;
    } else if (ndvi >= 0.5 && ndvi <= 0.7) {
        // Good vegetation, balanced choice
        treeSpecies = "Oak";
        absorptionRate = 21;
    } else if (ndvi >= 0.3 && ndvi < 0.5) {
        // Moderate vegetation, use fast-growing
        treeSpecies = "Bamboo";
        absorptionRate = 35;
    } else if (ndvi < 0.3) {
        // Poor vegetation, use drought-resistant fast-growing
        treeSpecies = "Acacia";
        absorptionRate = 16;
    }

    // Location-based adjustment (simple keyword matching)
    const locationLower = (location || "").toLowerCase();
    if (locationLower.includes("coast") || locationLower.includes("beach") || locationLower.includes("manado")) {
        treeSpecies = "Mangrove";
        absorptionRate = 22;
    } else if (locationLower.includes("mountain") || locationLower.includes("highland")) {
        treeSpecies = "Pine";
        absorptionRate = 13;
    } else if (locationLower.includes("urban") || locationLower.includes("city")) {
        treeSpecies = "Banyan";
        absorptionRate = 19;
    }

    // Calculate trees needed
    // Formula: (excess ppm * 0.5 tons per ppm per km²) / (absorption rate kg per tree) * 1000
    const treesNeeded = Math.max(1, Math.ceil((excess * 0.5 * 1000) / absorptionRate));

    const recommendations = [
        `Plant ${treesNeeded} ${treeSpecies.toLowerCase()} trees in ${location || 'your area'}`,
        airQuality === "Poor" || airQuality === "Critical"
            ? "Reduce transportation emissions and support clean energy"
            : "Maintain air quality through continuous tree planting",
        ndvi < 0.4
            ? "Urgent: Increase green cover with fast-growing native species"
            : "Preserve existing forests and expand urban greenery",
        "Partner with local environmental groups for maximum impact",
    ];

    return {
        treesNeeded,
        treeSpecies,
        absorptionRate,
        recommendations,
        confidence: calculateConfidence(co2Level, ndvi, airQuality),
    };
}

function calculateConfidence(co2Level: number, ndvi: number, airQuality: string): number {
    let confidence = 70;

    // Higher confidence if CO₂ data is available
    if (co2Level > 0 && co2Level < 500) confidence += 10;

    // Higher confidence if NDVI is available
    if (ndvi >= 0 && ndvi <= 1) confidence += 10;

    // Higher confidence if air quality is known
    if (airQuality && airQuality !== "Unknown") confidence += 5;

    return Math.min(95, confidence);
}
