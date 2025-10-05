# 📋 Rangkuman Perubahan Dashboard & Daftar API

## ✅ Yang Sudah Diubah di Dashboard

### 🎯 Perubahan Utama:
Dashboard sekarang **hanya menampilkan overview/ringkasan** - tidak ada analisis detail.

### 📊 Apa yang Ditampilkan di Dashboard (Sekarang):

1. **3 Metric Cards** (di Hero Section):
   - Global CO₂: `418 ppm` dengan trend `+2.4%`
   - NDVI Average: `0.68` dengan trend `-3.1%`
   - Temperature: `+1.2°C` dengan trend `+0.3°C`

2. **4 Quick Stats**:
   - Active Regions: `24`
   - Data Sources: `6`
   - Alerts: `16`
   - AI Analysis: `87%`

3. **Top 3 Regional Table** (Bukan semua region):
   - Hanya menampilkan 3 region teratas
   - Kolom: Region, CO₂, NDVI, Status, Updated
   - Kolom yang dihapus: Region ID, Emission %

4. **Tombol CTA**: "View Detailed Analytics" → Menuju halaman Analytics

### ❌ Yang Dihapus dari Dashboard:
- ❌ AI Insight Panel (dipindah ke Analytics)
- ❌ Detailed charts/graphs
- ❌ Full regional table (hanya top 3)
- ❌ Emission percentage column

---

## 📈 Yang Akan Ditampilkan di Analytics (Next Steps)

Analytics page akan berisi **semua detail** yang dihapus dari Dashboard:

1. **Full Regional Table** (semua 24+ region)
2. **CO₂ Trend Chart** (line graph 2015-2024)
3. **Emission by Region Chart** (bar chart)
4. **NDVI Heatmap** (interactive grid)
5. **AI Insight Panel** ⭐ (dipindah dari Dashboard)
6. **Recommended Actions**
7. **Advanced Filters**

---

## 🔌 Daftar API yang Dibutuhkan

### 🌍 1. NASA Earth Observation APIs (Data Bumi)

#### A. NASA NEO API (CO₂ & Temperature)
```
Base URL: https://neo.gsfc.nasa.gov/api/
```

**Endpoints:**
1. **CO₂ Data**: `/measurements/atmospheric_co2`
   - Parameters: `start_date`, `end_date`, `latitude`, `longitude`
   - Response: CO₂ concentration (ppm), trend, location
   - Digunakan di: Dashboard (metric), Analytics (chart)

2. **Temperature Anomaly**: `/measurements/land_surface_temperature`
   - Parameters: `start_date`, `end_date`, `latitude`, `longitude`, `anomaly_baseline`
   - Response: Temperature (°C), anomaly vs baseline
   - Digunakan di: Dashboard (metric), Analytics (trend)

#### B. MODIS API (Vegetasi & Kebakaran)
```
Base URL: https://modis.gsfc.nasa.gov/data/
```

**Endpoints:**
1. **NDVI (Vegetation Index)**: `/ndvi/latest`
   - Product: `MOD13A2` (16-day 1km)
   - Response: NDVI value (-1.0 to 1.0), quality flag
   - Digunakan di: Dashboard (metric), Analytics (heatmap)

2. **Fire Detection**: `/firms/viirs`
   - Source: `VIIRS_NOAA20_NRT`
   - Response: Fire hotspots, brightness, confidence
   - Digunakan di: Alerts, Map (markers)

#### C. GIBS API (Satellite Imagery)
```
Base URL: https://gibs.earthdata.nasa.gov/wmts/
```

**Endpoints:**
- **Satellite Tiles**: `/MODIS_Terra_CorrectedReflectance_TrueColor/{time}/{z}/{y}/{x}.png`
- Layers: TrueColor, NDVI, Aerosol
- Digunakan di: Map Page

#### D. POWER API (Climate Data)
```
Base URL: https://power.larc.nasa.gov/api/temporal/
```

**Endpoint:** `/daily/point`
- Parameters: Temperature, Precipitation, Humidity, Wind
- Digunakan di: Analytics (weather trends)

#### E. SEDAC API (Emissions & Population)
```
Base URL: https://sedac.ciesin.columbia.edu/data/
```

**Endpoint:** `/collection/ghg-emissions`
- Response: Total emissions, per capita, population
- Digunakan di: Analytics (emission by region chart)

---

### 🧠 2. AI/LLM APIs (untuk Analisis AI)

#### A. OpenAI API (Primary)
```
Base URL: https://api.openai.com/v1/
Authentication: Bearer token
```

**Endpoints:**
1. **Chat Completions**: `/chat/completions`
   - Model: `gpt-4o` atau `gpt-4-turbo`
   - Input: NASA data (CO₂, NDVI, Temp)
   - Output: AI insights (summary, findings, recommendations)
   - Digunakan di:
     - Analytics: AI Insight Panel
     - Insights: Full analysis
     - Reports: Auto-generate content
     - Chat Widget: AI assistant

2. **Embeddings**: `/embeddings` (untuk semantic search)

#### B. Alternative LLMs (User Selectable)
1. **DeepSeek**: `https://api.deepseek.com/v1/`
2. **Groq Llama**: `https://api.groq.com/openai/v1/`
3. **Anthropic Claude**: `https://api.anthropic.com/v1/`

**Note**: Semua menggunakan OpenAI-compatible format

---

### 🗄️ 3. Backend/Internal APIs

#### A. User Management
- `/api/user/profile` - User preferences, API quota
- `/api/user/settings` - Default region, AI model

#### B. Analysis History
- `/api/analysis/history` - Past AI analyses
- `/api/analysis/[id]` - Specific analysis

#### C. Reports
- `/api/reports` - List reports
- `/api/reports/generate` - Auto-generate with AI
- `/api/reports/[id]` - Download report (PDF/DOCX/CSV)

#### D. Alerts
- `/api/alerts/critical` - Critical alerts (fires, CO₂ spikes)

---

## 📦 API Implementation Routes (Next.js)

### File Structure:
```
src/app/api/
├── earth/
│   ├── co2/route.ts                 # GET CO₂ data
│   ├── co2/trends/route.ts          # GET CO₂ historical
│   ├── ndvi/route.ts                # GET NDVI data
│   ├── ndvi/grid/route.ts           # GET NDVI heatmap
│   ├── temperature/route.ts         # GET temperature
│   ├── global-metrics/route.ts      # GET dashboard metrics
│   ├── top-regions/route.ts         # GET top 3 regions
│   ├── fires/route.ts               # GET fire detection
│   └── emissions/route.ts           # GET emission data
├── ai/
│   ├── insights/route.ts            # POST generate insights
│   ├── insights/detailed/route.ts   # POST full analysis
│   ├── chat/route.ts                # POST chat with AI
│   └── models/route.ts              # GET available models
├── reports/
│   ├── generate/route.ts            # POST create report
│   └── [id]/route.ts                # GET download report
└── alerts/
    └── critical/route.ts            # GET alerts
```

---

## 🔑 Environment Variables yang Dibutuhkan

```env
# NASA APIs
NASA_API_KEY=DEMO_KEY              # Get from: https://api.nasa.gov/
NASA_EARTHDATA_USERNAME=           # For GIBS/MODIS
NASA_EARTHDATA_PASSWORD=

# OpenAI
OPENAI_API_KEY=sk-...              # Get from: https://platform.openai.com/

# Alternative LLMs (Optional)
DEEPSEEK_API_KEY=
GROQ_API_KEY=
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379

# Features
NEXT_PUBLIC_USE_MOCK_DATA=false    # true untuk development tanpa API
NEXT_PUBLIC_ENABLE_AI=true
```

---

## 🎯 Mapping: Dimana API Digunakan

### Dashboard (Overview Simple)
```
API yang dipanggil:
✅ /api/earth/global-metrics    → 3 metric cards (CO₂, NDVI, Temp)
✅ /api/earth/top-regions?limit=3  → Top 3 regional table
✅ /api/alerts/critical?limit=3    → Recent alerts
✅ /api/stats/overview            → Quick stats (4 boxes)

Total API calls: ~4
Load time: < 1 second
```

### Analytics (Detailed Analysis)
```
API yang dipanggil:
✅ /api/earth/co2/trends          → CO₂ line chart
✅ /api/earth/emissions           → Emission bar chart
✅ /api/earth/ndvi/grid           → NDVI heatmap
✅ /api/earth/regions/all         → Full regional table (24+)
✅ /api/ai/insights               → AI Insight Panel ⭐
✅ /api/ai/recommendations        → Recommended actions

Total API calls: ~10+
Load time: 2-3 seconds
Includes: AI processing time
```

### Insights Page
```
API yang dipanggil:
✅ /api/ai/insights/detailed      → Full AI analysis
✅ /api/earth/* (all)              → Data untuk AI input
✅ /api/ai/models                 → Available LLM models

User dapat pilih model: GPT-4o, DeepSeek, Llama, Claude
```

### Reports Page
```
API yang dipanggil:
✅ /api/reports/generate          → Auto-generate dengan AI
  Input: Dataset, period, format (PDF/DOCX/CSV)
  Output: Download link

AI digunakan untuk menulis isi laporan otomatis
```

### Map Page
```
API yang dipanggil:
✅ /api/earth/imagery             → GIBS satellite tiles
✅ /api/earth/ndvi/grid           → NDVI overlay
✅ /api/earth/fires               → Fire markers

Library: Leaflet.js
```

---

## ⚙️ Next Steps (Urutan Implementasi)

### Week 1: Setup API Clients
1. [ ] Install dependencies (`openai`, `axios`, `ioredis`)
2. [ ] Create NASA API client (`/src/lib/nasa-api.ts`)
3. [ ] Create OpenAI client (`/src/lib/openai-client.ts`)
4. [ ] Setup environment variables

### Week 2: Basic API Routes
5. [ ] Create `/api/earth/global-metrics`
6. [ ] Create `/api/earth/top-regions`
7. [ ] Create `/api/ai/insights` (basic)
8. [ ] Test Dashboard dengan real API

### Week 3: Analytics Components
9. [ ] Create CO₂ Trend Chart component
10. [ ] Create Emission Bar Chart
11. [ ] Create NDVI Heatmap
12. [ ] Move AI Insight Panel ke Analytics
13. [ ] Create Full Regional Table

### Week 4: Advanced Features
14. [ ] Implement Report Generation
15. [ ] Add Multi-model LLM support
16. [ ] Add real-time alerts
17. [ ] Testing & deployment

---

## 📚 Dokumentasi Lengkap

Lihat file-file berikut untuk detail lengkap:

1. **API Requirements**: `docs/API_REQUIREMENTS.md`
   - Semua endpoint NASA APIs
   - OpenAI API configuration
   - Response format & examples
   - Rate limits & authentication

2. **Data Flow Architecture**: `docs/DATA_FLOW_ARCHITECTURE.md`
   - Diagram alur data
   - Dashboard vs Analytics separation
   - AI integration points
   - Backend implementation examples

3. **Implementation Checklist**: `docs/IMPLEMENTATION_CHECKLIST.md`
   - Checklist lengkap semua tasks
   - File structure
   - Testing checklist
   - Deployment checklist

4. **Environment Variables**: `.env.example`
   - Template konfigurasi
   - Semua API keys yang dibutuhkan
   - Feature flags

---

## 🎨 Visual Summary

```
┌────────────────────────────────────────────────────────────┐
│                     ECOTRACK PLATFORM                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  DASHBOARD (Simple Overview)                                │
│  ├─ 3 Metrics (CO₂, NDVI, Temp) ← NASA NEO/MODIS          │
│  ├─ 4 Quick Stats               ← Internal API             │
│  ├─ Top 3 Regions               ← NASA APIs               │
│  └─ CTA → Analytics             ❌ NO AI HERE             │
│                                                             │
│  ANALYTICS (Detailed Analysis)                              │
│  ├─ CO₂ Chart                   ← NASA NEO API            │
│  ├─ Emission Chart              ← SEDAC API               │
│  ├─ NDVI Heatmap                ← MODIS API               │
│  ├─ AI Insight Panel ⭐         ← OpenAI GPT-4o           │
│  └─ Full Regional Table         ← NASA APIs               │
│                                                             │
│  INSIGHTS (AI Deep Analysis)                                │
│  ├─ Multiple AI Cards           ← OpenAI/DeepSeek/Llama  │
│  ├─ Model Selector              (User can choose)          │
│  └─ Recommendations             ← AI Generated            │
│                                                             │
│  REPORTS (Auto-Generate)                                    │
│  └─ PDF/DOCX/CSV                ← AI + NASA Data          │
│                                                             │
│  MAP (Interactive)                                          │
│  └─ Satellite + NDVI + Fires    ← GIBS + MODIS + FIRMS   │
│                                                             │
│  AI CHAT WIDGET (Floating)                                  │
│  └─ Available on ALL pages      ← OpenAI Streaming        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

**Kesimpulan**:
- ✅ Dashboard sudah diubah (simple overview)
- 🚧 Analytics perlu diupdate (detailed analysis + AI)
- 📋 Daftar lengkap 11 APIs sudah tersedia
- 🔑 Environment template sudah siap
- 📚 Dokumentasi lengkap sudah dibuat

**Next Action**: Setup NASA API client & buat basic API routes! 🚀
