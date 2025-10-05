# 📡 API Requirements untuk EcoTrack Platform

## 🎯 Overview
Dokumen ini menjelaskan **semua API** yang dibutuhkan untuk sistem EcoTrack, termasuk NASA Earth Data APIs dan LLM API untuk AI Analysis.

---

## 🌍 1. NASA Earth Observation APIs

### 📊 A. NASA Earth Observatory (NEO) API
**Base URL**: `https://neo.gsfc.nasa.gov/api/`

#### **Endpoints yang Dibutuhkan:**

##### 1.1 **CO₂ (Carbon Dioxide) Data**
- **Endpoint**: `/measurements/atmospheric_co2`
- **Method**: `GET`
- **Parameters**:
  - `start_date`: YYYY-MM-DD
  - `end_date`: YYYY-MM-DD
  - `latitude`: -90 to 90
  - `longitude`: -180 to 180
  - `resolution`: `1deg` (1° x 1°)
- **Response Format**: JSON
- **Data Fields**:
  ```json
  {
    "date": "2024-01-15",
    "co2_concentration": 418.2,
    "unit": "ppm",
    "location": {
      "lat": -6.2088,
      "lon": 106.8456,
      "region": "Jakarta, Indonesia"
    },
    "trend": "+2.4%",
    "data_quality": "high"
  }
  ```
- **Frequency**: Daily updates
- **Used In**: 
  - Dashboard: Global CO₂ metric
  - Analytics: CO₂ Trend Chart
  - Insights: AI Analysis input

##### 1.2 **Temperature Anomaly Data**
- **Endpoint**: `/measurements/land_surface_temperature`
- **Method**: `GET`
- **Parameters**:
  - `start_date`, `end_date`
  - `latitude`, `longitude`
  - `anomaly_baseline`: `1951-1980` (NASA standard)
- **Response Format**: JSON
- **Data Fields**:
  ```json
  {
    "date": "2024-01-15",
    "temperature_celsius": 28.5,
    "anomaly_celsius": 1.2,
    "baseline_period": "1951-1980",
    "confidence": 0.95
  }
  ```
- **Used In**:
  - Dashboard: Temperature metric
  - Analytics: Temperature trend visualization
  - Reports: Climate change indicators

---

### 🌳 B. NASA MODIS (Moderate Resolution Imaging Spectroradiometer)

#### **2.1 NDVI (Normalized Difference Vegetation Index)**
- **Base URL**: `https://modis.gsfc.nasa.gov/data/`
- **Endpoint**: `/ndvi/latest`
- **Method**: `GET`
- **Parameters**:
  - `product`: `MOD13A2` (16-day 1km NDVI)
  - `latitude`, `longitude`
  - `start_date`, `end_date`
- **Response Format**: GeoTIFF / JSON
- **Data Fields**:
  ```json
  {
    "date": "2024-01-15",
    "ndvi_value": 0.68,
    "quality_flag": "good",
    "cloud_cover_percent": 5,
    "pixel_reliability": "high",
    "vegetation_health": "moderate"
  }
  ```
- **NDVI Scale**: -1.0 to 1.0
  - `> 0.7`: Dense vegetation (forests)
  - `0.4 - 0.7`: Moderate vegetation (grasslands)
  - `< 0.4`: Sparse vegetation / bare soil
  - `< 0`: Water bodies
- **Used In**:
  - Dashboard: NDVI Average
  - Analytics: NDVI Grid Overlay Map
  - Insights: Vegetation health analysis

#### **2.2 Fire/Hotspot Detection**
- **Endpoint**: `/firms/viirs`
- **Method**: `GET`
- **Parameters**:
  - `source`: `VIIRS_NOAA20_NRT`
  - `region`: `asia`, `world`
  - `day_range`: 1-10 days
- **Response Format**: JSON/CSV
- **Data Fields**:
  ```json
  {
    "latitude": -0.5,
    "longitude": 117.3,
    "brightness": 350.2,
    "confidence": "high",
    "frp": 25.4,
    "detection_time": "2024-01-15T14:30:00Z"
  }
  ```
- **Used In**:
  - Alerts: Fire/deforestation warnings
  - Map: Hotspot markers

---

### 🛰️ C. NASA GIBS (Global Imagery Browse Services)

#### **3.1 Satellite Imagery Layers**
- **Base URL**: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/`
- **Endpoint**: `/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{z}/{y}/{x}.png`
- **Method**: `GET`
- **Parameters**:
  - `layer`: 
    - `MODIS_Terra_CorrectedReflectance_TrueColor`
    - `VIIRS_SNPP_CorrectedReflectance_TrueColor`
    - `BlueMarble_NextGeneration`
  - `time`: YYYY-MM-DD
  - `tilematrixset`: `GoogleMapsCompatible_Level9`
  - `format`: PNG/JPEG
- **Used In**:
  - Map Page: Base map layers
  - Analytics: Satellite imagery overlay

#### **3.2 Aerosol Optical Depth (Air Quality)**
- **Endpoint**: `/MODIS_Combined_AOD/default/{time}/{z}/{y}/{x}.png`
- **Data Fields**:
  ```json
  {
    "aod_value": 0.35,
    "air_quality_index": 85,
    "category": "moderate",
    "pm25_estimate": 42.5
  }
  ```
- **Used In**:
  - Air Quality Monitor component
  - Alerts: Air pollution warnings

---

### 🌊 D. NASA POWER (Prediction Of Worldwide Energy Resources)

#### **4.1 Climate Data**
- **Base URL**: `https://power.larc.nasa.gov/api/temporal/`
- **Endpoint**: `/daily/point`
- **Method**: `GET`
- **Parameters**:
  - `parameters`: `T2M,PRECTOTCORR,RH2M,WS2M`
  - `community`: `RE`
  - `longitude`, `latitude`
  - `start`, `end`: YYYYMMDD
  - `format`: JSON
- **Data Fields**:
  ```json
  {
    "temperature_2m": 28.5,
    "precipitation": 5.2,
    "humidity": 75,
    "wind_speed": 3.5,
    "solar_radiation": 5.8
  }
  ```
- **Used In**:
  - Analytics: Weather trends
  - Reports: Climate analysis

---

### 📈 E. NASA Socioeconomic Data and Applications Center (SEDAC)

#### **5.1 Population & Emissions Data**
- **Base URL**: `https://sedac.ciesin.columbia.edu/data/`
- **Endpoint**: `/collection/ghg-emissions`
- **Method**: `GET`
- **Data Fields**:
  ```json
  {
    "region": "Southeast Asia",
    "total_emissions_mt": 2450.5,
    "per_capita_emissions": 4.2,
    "population": 583000000,
    "year": 2024
  }
  ```
- **Used In**:
  - Analytics: Emission by Region Chart
  - Reports: Socioeconomic impact analysis

---

## 🧠 2. AI/LLM APIs (untuk AI Insights & Analysis)

### 🤖 A. OpenAI API (GPT-4o / GPT-4-Turbo)

#### **Base Configuration**
- **Base URL**: `https://api.openai.com/v1/`
- **Authentication**: Bearer Token (`OPENAI_API_KEY`)

#### **6.1 Chat Completions (AI Insights Generator)**
- **Endpoint**: `/chat/completions`
- **Method**: `POST`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer sk-...",
    "Content-Type": "application/json"
  }
  ```
- **Request Body**:
  ```json
  {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are an expert climate data analyst. Analyze NASA Earth data and provide actionable insights about CO₂ emissions, NDVI trends, and temperature anomalies."
      },
      {
        "role": "user",
        "content": "Analyze the following data:\nCO₂: 425 ppm (+14% since 2019)\nNDVI: 0.65 (below normal)\nRegion: Southeast Asia\nProvide: 1) Summary, 2) Key findings, 3) Recommendations"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1000,
    "response_format": { "type": "json_object" }
  }
  ```
- **Response Format**:
  ```json
  {
    "id": "chatcmpl-...",
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "{\"summary\":\"CO₂ levels in Southeast Asia show critical increase...\",\"findings\":[\"Deforestation in Kalimantan\",\"Urban emissions growth\"],\"recommendations\":[\"Reforestation programs\",\"Renewable energy transition\"]}"
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 150,
      "completion_tokens": 200,
      "total_tokens": 350
    }
  }
  ```
- **Used In**:
  - Insights Page: AI Insight Cards
  - Dashboard: AI Summary (removed from dashboard, moved to analytics)
  - Reports: Auto-generated analysis

#### **6.2 Embeddings (untuk Semantic Search)**
- **Endpoint**: `/embeddings`
- **Method**: `POST`
- **Used In**: Dataset search, knowledge base

---

### 🦙 B. Alternative LLM Options (User Selectable)

#### **7.1 DeepSeek API**
- **Base URL**: `https://api.deepseek.com/v1/`
- **Model**: `deepseek-chat`
- **Use Case**: Cost-effective alternative to GPT-4

#### **7.2 Llama via Groq**
- **Base URL**: `https://api.groq.com/openai/v1/`
- **Model**: `llama-3.1-70b-versatile`
- **Speed**: Very fast inference

#### **7.3 Anthropic Claude**
- **Base URL**: `https://api.anthropic.com/v1/`
- **Model**: `claude-3-sonnet-20240229`
- **Use Case**: Long context analysis

**Note**: Semua LLM menggunakan OpenAI-compatible format untuk kemudahan switching.

---

## 🗄️ 3. Backend Database APIs (Internal)

### **8.1 User Profile & Preferences**
- **Endpoint**: `/api/user/profile`
- **Method**: `GET`, `PUT`
- **Data Fields**:
  ```json
  {
    "user_id": "usr_123",
    "default_region": "Asia",
    "preferred_ai_model": "gpt-4o",
    "language": "en",
    "api_quota_used": 150,
    "api_quota_limit": 1000
  }
  ```

### **8.2 Analysis History**
- **Endpoint**: `/api/analysis/history`
- **Method**: `GET`
- **Data Fields**:
  ```json
  {
    "analysis_id": "anl_456",
    "timestamp": "2024-01-15T10:30:00Z",
    "model_used": "gpt-4o",
    "region": "Southeast Asia",
    "insights_generated": 5,
    "confidence_score": 0.87
  }
  ```

### **8.3 Reports Storage**
- **Endpoint**: `/api/reports`
- **Method**: `GET`, `POST`
- **Formats**: PDF, DOCX, CSV
- **Data Fields**:
  ```json
  {
    "report_id": "rpt_789",
    "title": "CO₂ Analysis Southeast Asia 2015-2024",
    "dataset": "NEO + MODIS",
    "format": "PDF",
    "generated_at": "2024-01-15T11:00:00Z",
    "download_url": "https://..."
  }
  ```

---

## 🔌 4. Real-time APIs

### **9.1 WebSocket for Live Updates**
- **Endpoint**: `wss://api.ecotrack.com/live`
- **Events**:
  - `new_alert`: Fire detection, CO₂ spike
  - `data_update`: New satellite data available
  - `ai_insight`: Real-time AI analysis completed

### **9.2 Server-Sent Events (SSE)**
- **Endpoint**: `/api/stream/updates`
- **Used In**: Live dashboard metrics

---

## 📦 5. API Data Flow Summary

### **Dashboard Page** menggunakan:
1. ✅ NASA NEO API → Global CO₂, Temperature
2. ✅ MODIS API → NDVI Average
3. ✅ Internal API → Regional stats (top 3 regions)
4. ❌ **TIDAK menggunakan LLM** (AI summary dipindah ke Analytics)

### **Analytics Page** menggunakan:
1. ✅ NASA NEO API → Detailed CO₂ trends
2. ✅ MODIS API → NDVI grid overlay
3. ✅ SEDAC API → Emission by region
4. ✅ **OpenAI GPT-4o** → AI Insights & Recommendations
5. ✅ GIBS API → Satellite imagery

### **Insights Page** menggunakan:
1. ✅ **OpenAI GPT-4o / DeepSeek / Llama** → Full AI analysis
2. ✅ All NASA APIs → Data input untuk AI
3. ✅ Internal API → Model preferences, history

### **Reports Page** menggunakan:
1. ✅ **OpenAI GPT-4o** → Auto-generate report content
2. ✅ All NASA APIs → Data aggregation
3. ✅ Internal API → PDF/DOCX generation

### **Map Page** menggunakan:
1. ✅ GIBS API → Satellite tiles
2. ✅ MODIS API → NDVI overlay
3. ✅ FIRMS API → Fire/hotspot markers
4. ✅ Leaflet.js → Map rendering

---

## 🔑 6. API Keys & Authentication

### **Required API Keys:**
```env
# NASA APIs (Public, free tier)
NASA_API_KEY=DEMO_KEY  # Replace with actual key from api.nasa.gov

# OpenAI
OPENAI_API_KEY=sk-...

# Alternative LLMs (Optional)
DEEPSEEK_API_KEY=...
GROQ_API_KEY=...
ANTHROPIC_API_KEY=...

# Internal
JWT_SECRET=...
DATABASE_URL=...
```

### **Rate Limits:**
- NASA APIs: 1,000 requests/hour (demo key), 10,000/hour (registered)
- OpenAI: Depends on plan (e.g., 3,500 RPM for GPT-4o)
- DeepSeek: 500 RPM
- Groq: 14,400 RPM (very fast!)

---

## 📊 7. API Response Caching Strategy

### **Cache Levels:**
1. **Browser Cache** (10 minutes):
   - Dashboard metrics
   - Recent regional data

2. **Redis Cache** (1 hour):
   - NASA satellite data (updates once/day)
   - NDVI values
   - Temperature anomalies

3. **Database Cache** (24 hours):
   - Historical trends
   - AI-generated insights (untuk re-use)

---

## 🧪 8. API Testing Endpoints

### **Development/Testing:**
```bash
# Test NASA NEO API
GET https://neo.gsfc.nasa.gov/api/measurements/atmospheric_co2?date=2024-01-15

# Test OpenAI
POST https://api.openai.com/v1/chat/completions
```

### **Mock Data (for development):**
- File: `/src/lib/mockData.ts`
- Used when `NEXT_PUBLIC_USE_MOCK_DATA=true`

---

## 📝 9. API Implementation Priority

### **Phase 1 (MVP)** ✅:
1. NASA NEO API (CO₂, Temperature)
2. MODIS API (NDVI)
3. OpenAI API (Basic insights)
4. Internal User API

### **Phase 2** 🚧:
5. GIBS API (Satellite imagery)
6. FIRMS API (Fire detection)
7. Alternative LLMs
8. WebSocket (Real-time)

### **Phase 3** 📋:
9. SEDAC API (Emissions data)
10. POWER API (Weather)
11. Advanced AI features
12. Reports auto-generation

---

## 🎯 Summary

**Total APIs yang Dibutuhkan: 11**

### **NASA/Earth Data APIs (7):**
1. ✅ NEO API (CO₂, Temperature)
2. ✅ MODIS API (NDVI, Fire)
3. ✅ GIBS API (Satellite Imagery)
4. ✅ FIRMS API (Hotspots)
5. ✅ POWER API (Climate)
6. ✅ SEDAC API (Emissions)
7. ✅ Earthdata Search API

### **AI/LLM APIs (4):**
8. ✅ OpenAI GPT-4o (Primary)
9. ✅ DeepSeek (Alternative)
10. ✅ Groq Llama (Fast alternative)
11. ✅ Anthropic Claude (Long context)

### **Internal APIs:**
- User management
- Analysis history
- Reports storage
- Real-time updates

---

**Dibuat untuk**: EcoTrack Platform  
**Terakhir Update**: 2024-01-15  
**Dokumen oleh**: AI Assistant  

🌍 *Powered by NASA Earth Observation + AI Intelligence*
