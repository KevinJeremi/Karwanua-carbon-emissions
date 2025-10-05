# 🎨 Visual API & Data Flow Diagrams

## 📊 1. Dashboard vs Analytics - Side by Side Comparison

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│         DASHBOARD (SIMPLE)          │        ANALYTICS (DETAILED)         │
├─────────────────────────────────────┼─────────────────────────────────────┤
│                                     │                                     │
│  🎯 Purpose: Quick Overview         │  🎯 Purpose: Deep Analysis          │
│  ⚡ Load Time: < 1s                 │  ⚡ Load Time: 2-3s                 │
│  📡 API Calls: ~4                   │  📡 API Calls: ~10+                 │
│                                     │                                     │
├─────────────────────────────────────┼─────────────────────────────────────┤
│                                     │                                     │
│  📊 METRICS SECTION                 │  📊 METRICS SECTION                 │
│  ┌─────────────────────────────┐   │  ┌─────────────────────────────┐   │
│  │ 🌫️ CO₂: 418 ppm (+2.4%)    │   │  │ 🌫️ CO₂ Trend Chart (Line)  │   │
│  │ 🌳 NDVI: 0.68 (-3.1%)       │   │  │    ├─ 2015-2024 history    │   │
│  │ 🌡️ Temp: +1.2°C (+0.3°C)   │   │  │    ├─ Predictions          │   │
│  └─────────────────────────────┘   │  │    └─ Annotations          │   │
│                                     │  ├─────────────────────────────┤   │
│  📌 QUICK STATS (4 boxes)           │  │ 📊 Emission Bar Chart       │   │
│  ┌────┬────┬────┬────┐             │  │    ├─ By Region            │   │
│  │24  │6   │16  │87% │             │  │    ├─ Year-over-year       │   │
│  │Reg │Src │Alrt│AI  │             │  │    └─ Comparisons          │   │
│  └────┴────┴────┴────┘             │  ├─────────────────────────────┤   │
│                                     │  │ 🗺️ NDVI Heatmap (Grid)     │   │
│  ❌ NO CHARTS                       │  │    ├─ Interactive zoom     │   │
│  ❌ NO AI INSIGHTS                  │  │    ├─ Color gradients      │   │
│  ❌ NO DETAILED TABLES              │  │    └─ Click for details    │   │
│                                     │  └─────────────────────────────┘   │
│                                     │                                     │
├─────────────────────────────────────┼─────────────────────────────────────┤
│                                     │                                     │
│  📋 REGIONAL TABLE                  │  📋 FULL REGIONAL TABLE             │
│  ┌─────────────────────────────┐   │  ┌─────────────────────────────┐   │
│  │ TOP 3 REGIONS ONLY          │   │  │ ALL 24+ REGIONS             │   │
│  ├─────────────────────────────┤   │  ├─────────────────────────────┤   │
│  │ Region │ CO₂ │ NDVI │ Sts  │   │  │ ID │ Region │ CO₂ │ Em │...│   │
│  ├────────┼─────┼──────┼──────┤   │  ├────┼────────┼─────┼────┼───┤   │
│  │ Asia   │ 425 │ 0.65 │ ⚠️   │   │  │001 │ Asia   │ 425 │+14%│...│   │
│  │ Europe │ 412 │ 0.72 │ ⚠️   │   │  │002 │ Europe │ 412 │+8% │...│   │
│  │ N.Amer │ 418 │ 0.68 │ ⚠️   │   │  │003 │ N.Amer │ 418 │+11%│...│   │
│  └────────┴─────┴──────┴──────┘   │  │... │ ...    │ ... │... │...│   │
│                                     │  │024 │ ...    │ ... │... │...│   │
│  ✅ Simplified columns             │  └────┴────────┴─────┴────┴───┘   │
│  ✅ No progress bars               │  ✅ All columns                     │
│  ✅ "View All" link → Analytics    │  ✅ Progress bars                   │
│                                     │  ✅ Sortable/Filterable             │
│                                     │  ✅ Export CSV                      │
│                                     │                                     │
├─────────────────────────────────────┼─────────────────────────────────────┤
│                                     │                                     │
│  ❌ NO AI PANEL                     │  🧠 AI INSIGHT PANEL                │
│  (Moved to Analytics)               │  ┌─────────────────────────────┐   │
│                                     │  │ 🤖 GPT-4o Analysis          │   │
│  ✅ CTA Button Instead:             │  ├─────────────────────────────┤   │
│  ┌─────────────────────────────┐   │  │ Summary: "CO₂ levels in     │   │
│  │ View Detailed Analytics →   │   │  │ Southeast Asia show...      │   │
│  └─────────────────────────────┘   │  ├─────────────────────────────┤   │
│                                     │  │ Key Findings:               │   │
│                                     │  │  • Deforestation ↑          │   │
│                                     │  │  • Urban emissions ↑        │   │
│                                     │  │  • NDVI declining ↓         │   │
│                                     │  ├─────────────────────────────┤   │
│                                     │  │ Confidence: ████████░ 87%   │   │
│                                     │  ├─────────────────────────────┤   │
│                                     │  │ [View Full Analysis →]      │   │
│                                     │  └─────────────────────────────┘   │
│                                     │                                     │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

---

## 🔌 2. API Call Flow per Halaman

### Dashboard API Flow:
```
USER OPENS DASHBOARD
        │
        ├─────────────────────────────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌──────────────────┐                            ┌──────────────────┐
│ Browser Request  │                            │   Next.js API    │
│  (Client Side)   │                            │     Routes       │
└────────┬─────────┘                            └────────┬─────────┘
         │                                               │
         │ 1. GET /api/earth/global-metrics             │
         ├──────────────────────────────────────────────>│
         │                                               │
         │                                               ├─> NASA NEO API (CO₂)
         │                                               ├─> MODIS API (NDVI)
         │                                               └─> NASA POWER (Temp)
         │                                               │
         │<──────────────────────────────────────────────┤
         │   { co2: 418, ndvi: 0.68, temp: 1.2 }        │
         │                                               │
         │ 2. GET /api/earth/top-regions?limit=3        │
         ├──────────────────────────────────────────────>│
         │                                               ├─> NASA APIs
         │<──────────────────────────────────────────────┤
         │   [ {region: "Asia", ...}, {...}, {...} ]    │
         │                                               │
         │ 3. GET /api/alerts/critical?limit=3          │
         ├──────────────────────────────────────────────>│
         │<──────────────────────────────────────────────┤
         │                                               │
         │ 4. GET /api/stats/overview                   │
         ├──────────────────────────────────────────────>│
         │<──────────────────────────────────────────────┤
         │                                               │
         ▼                                               
┌──────────────────┐
│  Render Page     │ ✅ Total API calls: 4
│  (< 1 second)    │ ✅ No AI processing
└──────────────────┘ ✅ Fast load time
```

### Analytics API Flow:
```
USER OPENS ANALYTICS
        │
        ├─────────────────────────────────────────────────┐
        │                                                 │
        ▼                                                 ▼
┌──────────────────┐                            ┌──────────────────┐
│ Browser Request  │                            │   Next.js API    │
│  (Client Side)   │                            │     Routes       │
└────────┬─────────┘                            └────────┬─────────┘
         │                                               │
         │ 1. GET /api/earth/co2/trends                 │
         ├──────────────────────────────────────────────>│
         │                                               ├─> NASA NEO
         │<──────────────────────────────────────────────┤
         │   [ {year: 2015, co2: 400}, {...}, ... ]     │
         │                                               │
         │ 2. GET /api/earth/emissions/by-region        │
         ├──────────────────────────────────────────────>│
         │                                               ├─> SEDAC API
         │<──────────────────────────────────────────────┤
         │                                               │
         │ 3. GET /api/earth/ndvi/grid                  │
         ├──────────────────────────────────────────────>│
         │                                               ├─> MODIS API
         │<──────────────────────────────────────────────┤
         │                                               │
         │ 4. GET /api/earth/regions/all                │
         ├──────────────────────────────────────────────>│
         │<──────────────────────────────────────────────┤
         │   [ {id: 001, region: "Asia", ...}, ... ]    │
         │                                               │
         │ 5. POST /api/ai/insights                     │
         │    Body: { data: {...}, model: "gpt-4o" }    │
         ├──────────────────────────────────────────────>│
         │                                               │
         │                                               ├─> OpenAI API 🧠
         │                                               │   (AI Processing)
         │                                               │   ~2-3 seconds
         │<──────────────────────────────────────────────┤
         │   {                                           │
         │     summary: "CO₂ levels...",                │
         │     findings: [...],                         │
         │     confidence: 0.87                         │
         │   }                                           │
         │                                               │
         ▼                                               
┌──────────────────┐
│  Render Page     │ ✅ Total API calls: 10+
│  (2-3 seconds)   │ ✅ Includes AI processing
└──────────────────┘ ✅ Rich visualizations
```

---

## 🧠 3. AI Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                    AI/LLM INTEGRATION MAP                     │
└──────────────────────────────────────────────────────────────┘

1️⃣ ANALYTICS PAGE - AI Insight Panel
   ┌────────────────────────────────────┐
   │ User opens Analytics               │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ Fetch NASA data (CO₂, NDVI, Temp) │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ POST /api/ai/insights              │
   │ {                                  │
   │   model: "gpt-4o",                 │
   │   data: {co2: 418, ndvi: 0.68...} │
   │ }                                  │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ OpenAI GPT-4o Processing 🧠        │
   │ • Analyze trends                   │
   │ • Generate summary                 │
   │ • Identify key findings            │
   │ • Create recommendations           │
   │ • Calculate confidence             │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ Display AI Insight Card            │
   │ ┌────────────────────────────────┐ │
   │ │ 🧠 AI Analysis - GPT-4o        │ │
   │ │ Confidence: 87%                │ │
   │ │ Summary: "CO₂ levels..."       │ │
   │ │ Findings: [•,•,•]              │ │
   │ │ [View Full Insights →]         │ │
   │ └────────────────────────────────┘ │
   └────────────────────────────────────┘

2️⃣ INSIGHTS PAGE - Full AI Analysis
   ┌────────────────────────────────────┐
   │ User selects AI Model              │
   │ ┌──────────────────────────────┐   │
   │ │ Select: GPT-4o ▼             │   │
   │ │         DeepSeek             │   │
   │ │         Llama (Groq)         │   │
   │ │         Claude               │   │
   │ └──────────────────────────────┘   │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ POST /api/ai/insights/detailed     │
   │ {                                  │
   │   model: "gpt-4o",                 │
   │   analysisType: "comprehensive",   │
   │   includeRecommendations: true     │
   │ }                                  │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ LLM Processing (User's Choice) 🧠  │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ Display Multiple Insight Cards     │
   │ ┌────────────────┐ ┌─────────────┐ │
   │ │ 🌫 CO₂ Trends  │ │ 🌳 NDVI     │ │
   │ └────────────────┘ └─────────────┘ │
   │ ┌────────────────┐ ┌─────────────┐ │
   │ │ 🌡 Temperature │ │ 🎯 Actions  │ │
   │ └────────────────┘ └─────────────┘ │
   └────────────────────────────────────┘

3️⃣ REPORTS PAGE - Auto-Generate
   ┌────────────────────────────────────┐
   │ User clicks "Generate Report"      │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ POST /api/reports/generate         │
   │ {                                  │
   │   title: "CO₂ Analysis...",        │
   │   dataset: ["NEO", "MODIS"],       │
   │   period: "2015-2024",             │
   │   format: "PDF",                   │
   │   includeAIAnalysis: true          │
   │ }                                  │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ AI Writes Report Content 🧠        │
   │ • Executive Summary                │
   │ • Data Analysis                    │
   │ • Findings & Insights              │
   │ • Recommendations                  │
   │ • Conclusions                      │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ Generate PDF with Charts           │
   │ └─> Download Ready                 │
   └────────────────────────────────────┘

4️⃣ AI CHAT WIDGET - Interactive Assistant
   ┌────────────────────────────────────┐
   │ User asks question                 │
   │ "What's the CO₂ trend in Jakarta?" │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ POST /api/ai/chat                  │
   │ {                                  │
   │   message: "What's the CO₂...",    │
   │   context: "dashboard",            │
   │   history: [...]                   │
   │ }                                  │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ OpenAI Streaming Response 🧠       │
   │ (Real-time typing effect)          │
   └────────┬───────────────────────────┘
            │
            ▼
   ┌────────────────────────────────────┐
   │ Display AI Response                │
   │ ┌────────────────────────────────┐ │
   │ │ 🤖: Based on NASA data, CO₂   │ │
   │ │ in Jakarta area is 425 ppm... │ │
   │ └────────────────────────────────┘ │
   └────────────────────────────────────┘
```

---

## 📡 4. NASA APIs → Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    NASA API DATA FLOW                         │
└──────────────────────────────────────────────────────────────┘

NASA NEO API (CO₂ & Temperature)
  │
  ├─> GET /measurements/atmospheric_co2
  │   Parameters:
  │    • start_date: 2024-01-01
  │    • end_date: 2024-01-31
  │    • latitude: -6.2088
  │    • longitude: 106.8456
  │   
  │   Response:
  │   {
  │     "date": "2024-01-15",
  │     "co2_concentration": 418.2,
  │     "unit": "ppm",
  │     "trend": "+2.4%",
  │     "location": {
  │       "lat": -6.2088,
  │       "lon": 106.8456,
  │       "region": "Jakarta, Indonesia"
  │     }
  │   }
  │
  └─> Used In:
       • Dashboard: Global CO₂ metric card
       • Analytics: CO₂ trend line chart
       • AI Insights: Input data for analysis

MODIS API (NDVI)
  │
  ├─> GET /ndvi/latest
  │   Parameters:
  │    • product: MOD13A2
  │    • latitude: -6.2088
  │    • longitude: 106.8456
  │   
  │   Response:
  │   {
  │     "date": "2024-01-15",
  │     "ndvi_value": 0.68,
  │     "quality_flag": "good",
  │     "vegetation_health": "moderate"
  │   }
  │
  └─> Used In:
       • Dashboard: NDVI metric card
       • Analytics: NDVI heatmap grid
       • Map: NDVI overlay layer

GIBS API (Satellite Imagery)
  │
  ├─> GET /MODIS_Terra_CorrectedReflectance_TrueColor/
  │       default/{time}/{z}/{y}/{x}.png
  │   
  │   Returns: PNG tile
  │
  └─> Used In:
       • Map Page: Base satellite imagery
       • Analytics: Background visualization

FIRMS API (Fire Detection)
  │
  ├─> GET /firms/viirs
  │   Parameters:
  │    • source: VIIRS_NOAA20_NRT
  │    • region: asia
  │    • day_range: 1
  │   
  │   Response:
  │   [
  │     {
  │       "latitude": -0.5,
  │       "longitude": 117.3,
  │       "brightness": 350.2,
  │       "confidence": "high",
  │       "detection_time": "2024-01-15T14:30:00Z"
  │     }
  │   ]
  │
  └─> Used In:
       • Alerts: Fire warnings
       • Map: Hotspot markers
```

---

## 🎯 5. Complete System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │Dashboard │  │Analytics │  │ Insights │  │   Map    │           │
│  │ (Simple) │  │(Detailed)│  │(AI Deep) │  │(Spatial) │           │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘           │
└────────┼─────────────┼─────────────┼─────────────┼────────────────┘
         │             │             │             │
         └─────────────┴─────────────┴─────────────┘
                       │
    ┌──────────────────┴──────────────────┐
    │                                     │
    ▼                                     ▼
┌────────────────────┐           ┌────────────────────┐
│  Next.js API       │           │  Client Cache      │
│  Routes Layer      │◄──────────┤  (SWR/React Query) │
└─────────┬──────────┘           └────────────────────┘
          │
          ├──────────────┬──────────────┬──────────────┐
          ▼              ▼              ▼              ▼
  ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
  │ NASA API     │ │ OpenAI   │ │ Database │ │ Redis Cache  │
  │ Client       │ │ Client   │ │ (PostgreSQL)│(Response)   │
  └──────┬───────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘
         │              │             │              │
         ▼              ▼             ▼              ▼
  ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
  │ NASA APIs    │ │ OpenAI   │ │ User     │ │ Cached       │
  │ • NEO        │ │ GPT-4o   │ │ Data     │ │ Responses    │
  │ • MODIS      │ │ DeepSeek │ │ Reports  │ │ (1hr TTL)    │
  │ • GIBS       │ │ Llama    │ │ History  │ │              │
  │ • FIRMS      │ │ Claude   │ │          │ │              │
  └──────────────┘ └──────────┘ └──────────┘ └──────────────┘

Data Flow:
1. User Request → Next.js API Route
2. Check Redis Cache (if exists, return cached)
3. If not cached:
   a. Fetch from NASA APIs
   b. If AI needed, call OpenAI
   c. Store in Redis (TTL: 1 hour)
   d. Save to Database (history)
4. Return to client
5. Client caches with SWR (10 min)
```

---

**Kesimpulan Visual**:
- ✅ Dashboard: Simple, fast, no AI
- ✅ Analytics: Detailed, charts, AI insights
- ✅ APIs: NASA (data) + OpenAI (intelligence)
- ✅ Caching: Multi-layer (Browser → Redis → Database)

🌍 *EcoTrack: Where NASA Data Meets AI Intelligence*
