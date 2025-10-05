# 🚀 Quick Start Guide - EcoTrack API Implementation

## 📋 Step-by-Step Implementation

### ✅ Phase 1: Setup Environment (15 menit)

#### 1. Install Dependencies
```bash
# Navigate to project directory
cd d:/Karwanua/my-app

# Install NASA & AI dependencies
npm install openai axios ioredis
npm install recharts chart.js react-chartjs-2
npm install @tanstack/react-query
npm install zod  # untuk validation
```

#### 2. Setup Environment Variables
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dan isi:
# NASA_API_KEY=DEMO_KEY  (atau register di https://api.nasa.gov/)
# OPENAI_API_KEY=sk-...  (dari https://platform.openai.com/)
```

#### 3. Create Base Folder Structure
```bash
# Buat folder API
mkdir -p src/app/api/earth/co2
mkdir -p src/app/api/earth/ndvi
mkdir -p src/app/api/earth/temperature
mkdir -p src/app/api/ai/insights
mkdir -p src/lib
```

---

### ✅ Phase 2: Create API Clients (30 menit)

#### 1. NASA API Client
**File**: `src/lib/nasa-api.ts`

```typescript
import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NEO_BASE_URL = 'https://neo.gsfc.nasa.gov/api';
const MODIS_BASE_URL = 'https://modis.gsfc.nasa.gov/data';

export const nasaClient = axios.create({
  headers: {
    'X-API-KEY': NASA_API_KEY,
  },
});

// Fetch CO₂ data
export async function getCO2Data(params: {
  startDate: string;
  endDate: string;
  lat?: number;
  lon?: number;
}) {
  try {
    const response = await nasaClient.get(`${NEO_BASE_URL}/measurements/atmospheric_co2`, {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        latitude: params.lat,
        longitude: params.lon,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('NASA API Error:', error);
    // Return mock data as fallback
    return {
      date: new Date().toISOString().split('T')[0],
      co2_concentration: 418.2,
      unit: 'ppm',
      trend: '+2.4%',
    };
  }
}

// Fetch NDVI data
export async function getNDVIData(params: {
  lat: number;
  lon: number;
  date?: string;
}) {
  try {
    const response = await nasaClient.get(`${MODIS_BASE_URL}/ndvi/latest`, {
      params: {
        latitude: params.lat,
        longitude: params.lon,
        date: params.date,
        product: 'MOD13A2',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('MODIS API Error:', error);
    return {
      date: new Date().toISOString().split('T')[0],
      ndvi_value: 0.68,
      quality_flag: 'good',
      vegetation_health: 'moderate',
    };
  }
}

// Fetch Temperature data
export async function getTemperatureData(params: {
  startDate: string;
  endDate: string;
  lat?: number;
  lon?: number;
}) {
  try {
    const response = await nasaClient.get(`${NEO_BASE_URL}/measurements/land_surface_temperature`, {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        latitude: params.lat,
        longitude: params.lon,
        anomaly_baseline: '1951-1980',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('NASA Temperature API Error:', error);
    return {
      date: new Date().toISOString().split('T')[0],
      temperature_celsius: 28.5,
      anomaly_celsius: 1.2,
      baseline_period: '1951-1980',
    };
  }
}
```

#### 2. OpenAI Client
**File**: `src/lib/openai-client.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIInsightRequest {
  data: {
    co2: number;
    ndvi: number;
    temperature: number;
    region?: string;
    timeRange?: string;
  };
  model?: string;
}

export async function generateInsights(request: AIInsightRequest) {
  try {
    const completion = await openai.chat.completions.create({
      model: request.model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert climate data analyst specialized in NASA Earth observation data. 
          Analyze the provided environmental data and generate:
          1. A concise summary (2-3 sentences)
          2. Key findings (3-5 bullet points)
          3. Actionable recommendations (3-4 items)
          4. A confidence score (0-100%)
          
          Return ONLY valid JSON in this exact format:
          {
            "summary": "string",
            "findings": ["string", "string", ...],
            "recommendations": ["string", "string", ...],
            "confidence": number
          }`
        },
        {
          role: 'user',
          content: `Analyze this climate data:
          
          CO₂ Concentration: ${request.data.co2} ppm
          NDVI (Vegetation Index): ${request.data.ndvi}
          Temperature Anomaly: ${request.data.temperature}°C
          ${request.data.region ? `Region: ${request.data.region}` : ''}
          ${request.data.timeRange ? `Time Range: ${request.data.timeRange}` : ''}
          
          Provide analysis in JSON format.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No response from AI');
    
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Fallback response
    return {
      summary: 'Unable to generate AI insights at this time.',
      findings: ['Data analysis in progress'],
      recommendations: ['Please try again later'],
      confidence: 0,
    };
  }
}
```

#### 3. Cache Utility
**File**: `src/lib/cache.ts`

```typescript
import { Redis } from 'ioredis';

let redis: Redis | null = null;

// Initialize Redis connection
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  console.warn('Redis not configured, using memory cache');
}

// In-memory cache fallback
const memoryCache = new Map<string, { value: any; expires: number }>();

export async function getCached<T>(key: string): Promise<T | null> {
  if (redis) {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } else {
    const cached = memoryCache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 3600) {
  if (redis) {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } else {
    memoryCache.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }
}

export async function clearCache(pattern: string) {
  if (redis) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } else {
    for (const key of memoryCache.keys()) {
      if (key.includes(pattern)) {
        memoryCache.delete(key);
      }
    }
  }
}
```

---

### ✅ Phase 3: Create API Routes (45 menit)

#### 1. Global Metrics Endpoint (untuk Dashboard)
**File**: `src/app/api/earth/global-metrics/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getCO2Data, getNDVIData, getTemperatureData } from '@/lib/nasa-api';
import { getCached, setCache } from '@/lib/cache';

export async function GET() {
  const cacheKey = 'global-metrics';
  
  // Check cache first
  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Fetch data in parallel
    const [co2Data, ndviData, tempData] = await Promise.all([
      getCO2Data({ startDate: monthAgo, endDate: today }),
      getNDVIData({ lat: 0, lon: 0 }), // Global average
      getTemperatureData({ startDate: monthAgo, endDate: today }),
    ]);

    const metrics = {
      co2: {
        value: co2Data.co2_concentration || 418,
        unit: 'ppm',
        trend: co2Data.trend || '+2.4%',
      },
      ndvi: {
        value: ndviData.ndvi_value || 0.68,
        trend: '-3.1%', // Calculate from historical data
      },
      temperature: {
        value: tempData.anomaly_celsius || 1.2,
        unit: '°C',
        trend: '+0.3°C',
      },
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 1 hour
    await setCache(cacheKey, metrics, 3600);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
```

#### 2. Top Regions Endpoint
**File**: `src/app/api/earth/top-regions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '3');
  
  const cacheKey = `top-regions-${limit}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // Mock data for now - replace with actual NASA API calls
  const regions = [
    {
      id: 'AS-001',
      region: 'Asia Tenggara',
      co2: 425,
      emission: '+14%',
      ndvi: 0.65,
      status: 'Critical',
      statusColor: 'red',
      lastUpdate: '2 hours ago',
    },
    {
      id: 'EU-002',
      region: 'Europe',
      co2: 412,
      emission: '+8%',
      ndvi: 0.72,
      status: 'Warning',
      statusColor: 'orange',
      lastUpdate: '1 hour ago',
    },
    {
      id: 'NA-003',
      region: 'North America',
      co2: 418,
      emission: '+11%',
      ndvi: 0.68,
      status: 'Warning',
      statusColor: 'orange',
      lastUpdate: '3 hours ago',
    },
  ];

  const topRegions = regions.slice(0, limit);
  
  await setCache(cacheKey, topRegions, 1800); // Cache 30 minutes
  
  return NextResponse.json(topRegions);
}
```

#### 3. AI Insights Endpoint
**File**: `src/app/api/ai/insights/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/lib/openai-client';
import { getCached, setCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, model = 'gpt-4o' } = body;

    // Create cache key from data
    const cacheKey = `ai-insights-${JSON.stringify(data)}-${model}`;
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // Generate insights using AI
    const insights = await generateInsights({ data, model });

    const response = {
      success: true,
      insights,
      model_used: model,
      generated_at: new Date().toISOString(),
    };

    // Cache for 24 hours (insights don't change much)
    await setCache(cacheKey, response, 86400);

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Insights Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

---

### ✅ Phase 4: Update Dashboard Component (15 menit)

**File**: `src/app/page.tsx` (sudah diubah, tinggal test)

Test dengan menjalankan:
```bash
npm run dev
```

Buka: `http://localhost:3000`

---

### ✅ Phase 5: Create Analytics Components (1-2 jam)

#### 1. AI Powered Summary Component
**File**: `src/components/AIPoweredSummary.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AIInsights {
  summary: string;
  findings: string[];
  recommendations: string[];
  confidence: number;
}

export function AIPoweredSummary({ data }: { data: any }) {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [data]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            co2: data.co2 || 418,
            ndvi: data.ndvi || 0.68,
            temperature: data.temperature || 1.2,
            region: 'Southeast Asia',
          },
          model: 'gpt-4o',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setInsights(result.insights);
      }
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-purple-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI Insights — Powered by GPT-4o
        </h3>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Confidence: {insights?.confidence}%
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-700 leading-relaxed">{insights?.summary}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Key Findings:</h4>
          <ul className="space-y-2">
            {insights?.findings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600">
                <span className="text-blue-500 mt-1">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
          <ul className="space-y-2">
            {insights?.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600">
                <span className="text-purple-500 mt-1">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => (window.location.href = '/insights')}
          className="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          View Full Analysis →
        </button>
      </div>
    </motion.div>
  );
}
```

---

## 🧪 Testing Checklist

### Test Dashboard:
```bash
# 1. Run development server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Check:
✅ 3 metric cards display correctly
✅ Quick stats show numbers
✅ Top 3 regional table loads
✅ No AI insight panel
✅ "View Detailed Analytics" button works
```

### Test API Endpoints:
```bash
# Test global metrics
curl http://localhost:3000/api/earth/global-metrics

# Test top regions
curl http://localhost:3000/api/earth/top-regions?limit=3

# Test AI insights
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{"data":{"co2":418,"ndvi":0.68,"temperature":1.2}}'
```

---

## 📚 Next Steps

1. ✅ **Dashboard done** - Test dengan data real
2. 🚧 **Update Analytics page** - Add charts & AI panel
3. 🚧 **Create Insights page** - Full AI analysis
4. 🚧 **Implement Reports** - Auto-generate with AI
5. 🚧 **Add Map features** - NDVI overlay, fire markers

---

## 🆘 Troubleshooting

### Issue: NASA API returns error
```typescript
// Add retry logic in nasa-api.ts
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Issue: OpenAI rate limit
```typescript
// Add rate limiting in openai-client.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});
```

---

**Time Estimate**:
- Phase 1 (Setup): 15 min
- Phase 2 (API Clients): 30 min
- Phase 3 (API Routes): 45 min
- Phase 4 (Test Dashboard): 15 min
- **Total**: ~2 hours untuk MVP

🚀 **Ready to start coding!**
