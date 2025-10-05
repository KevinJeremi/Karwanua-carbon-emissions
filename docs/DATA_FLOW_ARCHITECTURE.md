# 🔄 Data Flow & Integration Architecture

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER INTERFACE LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │  Analytics   │  │   Insights   │          │
│  │   (Simple)   │  │  (Detailed)  │  │  (AI Deep)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER (Next.js)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           API Routes (/src/app/api/...)                │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  • /api/earth/co2        → Fetch NASA CO₂ data        │    │
│  │  • /api/earth/ndvi       → Fetch MODIS NDVI           │    │
│  │  • /api/earth/temperature → Fetch temperature         │    │
│  │  • /api/ai/insights      → Generate AI analysis       │    │
│  │  • /api/ai/chat          → Chat with AI assistant     │    │
│  │  • /api/reports/generate → Auto-generate reports      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────┬────────────────────┬──────────────────────────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────┐  ┌─────────────────────┐
│   NASA APIs         │  │   AI/LLM APIs       │
├─────────────────────┤  ├─────────────────────┤
│ • NEO (CO₂)         │  │ • OpenAI GPT-4o     │
│ • MODIS (NDVI)      │  │ • DeepSeek          │
│ • GIBS (Imagery)    │  │ • Groq Llama        │
│ • FIRMS (Fire)      │  │ • Anthropic Claude  │
│ • POWER (Climate)   │  └─────────────────────┘
│ • SEDAC (Emissions) │
└─────────────────────┘
```

---

## 🎯 Dashboard → Analytics Data Separation

### **DASHBOARD (Halaman Utama)**
**Prinsip**: Hanya menampilkan **overview/ringkasan** tanpa detail mendalam

#### ✅ Data yang Ditampilkan:
1. **3 Metric Cards** (Hero Section):
   - Global CO₂: `418 ppm` (dengan trend `+2.4%`)
   - NDVI Average: `0.68` (dengan trend `-3.1%`)
   - Temperature: `+1.2°C` (dengan trend `+0.3°C`)

2. **4 Quick Stats** (Stats Bar):
   - Active Regions: `24`
   - Data Sources: `6`
   - Alerts: `16`
   - AI Analysis: `87%` (confidence score)

3. **3 Floating Cards**:
   - StatCard: Total regions monitoring
   - AlertCard: Latest critical alerts (max 3)
   - ActivityCard: Recent updates feed

4. **Top 3 Regional Table**:
   - Region Name
   - CO₂ value
   - NDVI value
   - Status badge
   - Last updated

#### ❌ TIDAK Ditampilkan di Dashboard:
- ❌ Line charts / trend graphs
- ❌ Bar charts / detailed visualizations
- ❌ AI insight cards (pindah ke Analytics)
- ❌ Full regional table (hanya top 3)
- ❌ Emission breakdown
- ❌ Interactive maps

#### 🔌 API Calls (Dashboard):
```typescript
// Minimal API calls untuk dashboard
const dashboardData = {
  metrics: await fetch('/api/earth/global-metrics'),    // Single call
  topRegions: await fetch('/api/earth/top-regions?limit=3'),
  alerts: await fetch('/api/alerts/critical?limit=3'),
  stats: await fetch('/api/stats/overview')
};
```

---

### **ANALYTICS (Halaman Analisis Detail)**
**Prinsip**: Menampilkan **semua detail**, grafik, tabel lengkap, dan visualisasi

#### ✅ Data yang Ditampilkan:
1. **Detailed Metrics** (dengan historical trends):
   - CO₂ Trend Chart (line graph 2015-2024)
   - NDVI Grid Map (interactive heatmap)
   - Temperature Anomaly Graph
   - Emission by Region (bar chart)

2. **Full Regional Table**:
   - All regions (24+)
   - Region ID
   - CO₂ (ppm) dengan progress bar
   - Emission change (%)
   - NDVI dengan color coding
   - Status dengan detailed badges
   - Last updated timestamp
   - **Action buttons**: View Details, Download

3. **AI Insights Panel** ⭐:
   - AI Summary Card
   - Confidence Score (87%)
   - Key Findings (bulleted list)
   - Recommended Actions
   - "Explain More" button → ke Insights page

4. **Interactive Filters**:
   - Region selector (multi-select)
   - Date range picker (custom)
   - Data source toggle
   - Refresh button

5. **Visualization Panels**:
   - CO₂ Trend Line Chart
   - Emission Bar Chart (by region)
   - NDVI Heatmap
   - Alert Timeline

#### 🔌 API Calls (Analytics):
```typescript
// Multiple detailed API calls
const analyticsData = {
  co2Trends: await fetch('/api/earth/co2/trends?range=2015-2024'),
  allRegions: await fetch('/api/earth/regions/all'),
  ndviGrid: await fetch('/api/earth/ndvi/grid?resolution=500m'),
  emissions: await fetch('/api/earth/emissions/by-region'),
  aiInsights: await fetch('/api/ai/insights', {
    method: 'POST',
    body: JSON.stringify({ dataset: 'current', model: 'gpt-4o' })
  })
};
```

---

## 🧠 AI Implementation (LLM Integration)

### **Lokasi AI di UI:**

#### 1. **Analytics Page** (AI Insight Panel)
```typescript
// Component: AIPoweredSummary.tsx
const AIInsightPanel = () => {
  const [insights, setInsights] = useState(null);
  
  useEffect(() => {
    // Fetch AI insights saat Analytics page dibuka
    const fetchInsights = async () => {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          data: {
            co2: 418,
            ndvi: 0.68,
            temperature: 1.2,
            region: 'Southeast Asia',
            timeRange: '2015-2024'
          }
        })
      });
      
      const result = await response.json();
      setInsights(result);
    };
    
    fetchInsights();
  }, []);
  
  return (
    <div className="ai-insight-panel">
      <h3>🧠 AI Insights — Powered by GPT-4o</h3>
      <p className="summary">{insights?.summary}</p>
      <div className="confidence">
        Confidence: {insights?.confidence}%
      </div>
      <ul className="findings">
        {insights?.findings?.map((finding, i) => (
          <li key={i}>{finding}</li>
        ))}
      </ul>
      <button onClick={() => navigate('/insights')}>
        View Full Analysis →
      </button>
    </div>
  );
};
```

#### 2. **Insights Page** (Full AI Analysis)
```typescript
// Component: InsightsPage.tsx
const InsightsPage = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [insights, setInsights] = useState([]);
  
  const generateInsights = async () => {
    const response = await fetch('/api/ai/insights/detailed', {
      method: 'POST',
      body: JSON.stringify({
        model: selectedModel,
        analysisType: 'comprehensive',
        includeRecommendations: true
      })
    });
    
    const data = await response.json();
    setInsights(data.insights);
  };
  
  return (
    <div className="insights-page">
      {/* Model Selector */}
      <select onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="gpt-4o">GPT-4o (OpenAI)</option>
        <option value="deepseek">DeepSeek</option>
        <option value="llama">Llama 3.1 (Groq)</option>
        <option value="claude">Claude 3 Sonnet</option>
      </select>
      
      {/* Insight Cards */}
      {insights.map((insight, i) => (
        <InsightCard key={i} {...insight} />
      ))}
      
      {/* Recommended Actions */}
      <RecommendedActions />
      
      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
};
```

#### 3. **Reports Page** (Auto-generate with AI)
```typescript
// Component: Reports Page
const generateReport = async () => {
  const response = await fetch('/api/reports/generate', {
    method: 'POST',
    body: JSON.stringify({
      title: 'CO₂ Analysis Southeast Asia',
      dataset: ['NEO', 'MODIS'],
      period: '2015-2024',
      format: 'PDF',
      includeAIAnalysis: true,
      aiModel: 'gpt-4o'
    })
  });
  
  const report = await response.json();
  // Download PDF
};
```

#### 4. **AI Chat Widget** (Floating, available everywhere)
```typescript
// Component: AIChatWidget.tsx (di semua halaman)
const AIChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const sendMessage = async () => {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: input,
        context: 'dashboard', // atau 'analytics', 'insights'
        history: messages
      })
    });
    
    const reply = await response.json();
    setMessages([...messages, { user: input, ai: reply.message }]);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat bubble interface */}
    </div>
  );
};
```

---

## 🔑 Backend API Implementation

### **File: `/src/app/api/ai/insights/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { data, model = 'gpt-4o' } = await request.json();
  
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert climate data analyst. Analyze the provided NASA Earth observation data and generate:
          1. A concise summary
          2. Key findings (3-5 points)
          3. Actionable recommendations
          4. Confidence score (0-100%)
          
          Return JSON format only.`
        },
        {
          role: 'user',
          content: JSON.stringify(data)
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const insights = JSON.parse(completion.choices[0].message.content);
    
    return NextResponse.json({
      success: true,
      insights,
      model_used: model,
      tokens_used: completion.usage?.total_tokens
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

### **File: `/src/app/api/earth/global-metrics/route.ts`**
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch dari NASA NEO API
  const co2Response = await fetch(
    `https://neo.gsfc.nasa.gov/api/measurements/atmospheric_co2?date=${new Date().toISOString().split('T')[0]}`,
    { headers: { 'X-API-KEY': process.env.NASA_API_KEY! } }
  );
  
  const co2Data = await co2Response.json();
  
  // Fetch NDVI dari MODIS
  const ndviResponse = await fetch(
    `https://modis.gsfc.nasa.gov/data/ndvi/latest`,
    { headers: { 'X-API-KEY': process.env.NASA_API_KEY! } }
  );
  
  const ndviData = await ndviResponse.json();
  
  return NextResponse.json({
    co2: {
      value: co2Data.co2_concentration,
      trend: '+2.4%'
    },
    ndvi: {
      value: ndviData.ndvi_value,
      trend: '-3.1%'
    },
    temperature: {
      value: '+1.2°C',
      trend: '+0.3°C'
    }
  });
}
```

---

## 📂 File Structure untuk API Integration

```
src/
├── app/
│   └── api/
│       ├── earth/
│       │   ├── co2/
│       │   │   ├── route.ts          # GET CO₂ data
│       │   │   └── trends/route.ts   # GET CO₂ trends
│       │   ├── ndvi/
│       │   │   ├── route.ts          # GET NDVI data
│       │   │   └── grid/route.ts     # GET NDVI grid
│       │   ├── temperature/route.ts
│       │   ├── global-metrics/route.ts
│       │   └── top-regions/route.ts
│       ├── ai/
│       │   ├── insights/
│       │   │   ├── route.ts          # POST generate insights
│       │   │   └── detailed/route.ts
│       │   ├── chat/route.ts         # POST chat with AI
│       │   └── models/route.ts       # GET available models
│       ├── reports/
│       │   ├── generate/route.ts     # POST generate report
│       │   └── [id]/route.ts         # GET report by ID
│       └── alerts/
│           └── critical/route.ts
├── lib/
│   ├── nasa-api.ts        # NASA API client
│   ├── openai-client.ts   # OpenAI client
│   ├── cache.ts           # Redis/memory cache
│   └── mockData.ts        # Mock data for development
└── types/
    ├── earth-data.ts
    └── ai-insights.ts
```

---

## 🎯 Summary: Dashboard vs Analytics

| Feature | Dashboard | Analytics |
|---------|-----------|-----------|
| **Purpose** | Quick overview | Detailed analysis |
| **Metrics** | 3 cards only | All metrics + graphs |
| **Regional Table** | Top 3 regions | All regions (24+) |
| **Charts** | ❌ None | ✅ Line, Bar, Heatmap |
| **AI Insights** | ❌ Removed | ✅ Full AI panel |
| **Filters** | Basic (region, date) | Advanced (multi-select) |
| **API Calls** | ~4 calls | ~10+ calls |
| **Load Time** | < 1s | 2-3s |
| **User Action** | "View Analytics" CTA | In-depth exploration |

---

**Dibuat untuk**: EcoTrack Platform  
**Focus**: Clean separation Dashboard (simple) vs Analytics (detailed)  
**AI Integration**: Only in Analytics, Insights, Reports, and Chat Widget  

🌍 *NASA Data + AI Intelligence, Properly Separated*
