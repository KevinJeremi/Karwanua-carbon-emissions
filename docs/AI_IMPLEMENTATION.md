# 🧠 AI Features Setup Guide

## Implementasi AI dengan Groq Llama 3.1 8B

### ✅ Apa yang Sudah Diimplementasikan

1. **AI Context Provider** (`src/contexts/AIContext.tsx`)
   - Mengontrol status AI ON/OFF global
   - Menyimpan preferensi model AI
   - Persist ke localStorage

2. **Navbar AI Toggle** (`src/components/Navbar.tsx`)
   - Button 🧠 ON/OFF dengan animasi
   - Visual indicator status AI (hijau = ON, merah = OFF)
   - Kontrol global untuk semua fitur AI

3. **AI Insights Page** (`src/components/InsightsPage.tsx`)
   - Generate climate insights berdasarkan data NASA
   - Menggunakan lokasi user untuk analisis spesifik
   - Recommendations berbasis AI
   - Loading states dan error handling
   - Disabled saat AI OFF (fallback ke static data)

4. **AI Chat Widget** (`src/components/AIChatWidget.tsx`)
   - Floating chat button di kanan bawah
   - Real-time conversation dengan AI
   - Quick questions untuk memulai
   - Disabled saat AI OFF dengan alert

5. **API Routes**
   - `/api/ai/chat` - Chat endpoint
   - `/api/ai/insights` - Generate insights
   - `/api/ai/recommendations` - Generate recommendations

### 🚀 Setup Instructions

#### 1. Install Dependencies
Sudah terinstall:
```bash
npm install groq-sdk
```

#### 2. Get Groq API Key (GRATIS & CEPAT!)

**Groq** menyediakan akses **GRATIS** ke **Llama 3.1 8B** dengan kecepatan luar biasa:

1. Kunjungi: https://console.groq.com/
2. Sign up dengan email atau GitHub (gratis)
3. Buka menu **API Keys**
4. Click **Create API Key**
5. Copy API key yang muncul

**Keunggulan Groq:**
- ✅ **100% Gratis** untuk penggunaan wajar
- ✅ **Super Cepat** (70-100 tokens/detik)
- ✅ **Llama 3.1 8B Instant** model terbaik gratis
- ✅ **No credit card required**
- ✅ Rate limit: 30 requests/minute (cukup untuk development)

#### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```bash
# Copy dari example
cp .env.local.example .env.local
```

Edit `.env.local` dan tambahkan API key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**PENTING:** 
- File `.env.local` sudah ada di `.gitignore` (tidak akan di-commit)
- **JANGAN** commit API key ke repository!

#### 4. Restart Development Server

```bash
npm run dev
```

### 🎯 Cara Menggunakan

#### 1. Enable AI dari Navbar
- Klik tombol **🧠 OFF** di navbar (kanan atas)
- Button akan berubah menjadi **🧠 ON** dengan warna ungu
- Indikator hijau muncul = AI aktif

#### 2. AI Insights Page
- Navigasi ke halaman **Insights** (dari Analytics)
- AI akan otomatis generate insights berdasarkan:
  - Lokasi Anda (GPS)
  - Data CO₂ dari NASA
  - NDVI (vegetation index)
  - Temperature data
- Lihat recommendations yang di-generate AI
- Pilih model AI dari dropdown (default: Groq Llama)

#### 3. AI Chat Widget
- Floating button 💜 di kanan bawah layar
- Klik untuk membuka chat
- Tanya tentang:
  - CO₂ trends
  - NDVI data
  - Climate insights
  - Temperature anomalies
- Quick questions tersedia untuk memulai

### 🔒 Keamanan

**Server-Side API Calls:**
- Semua request ke Groq API dilakukan dari **server-side** (Next.js API routes)
- API key **TIDAK PERNAH** terexpose ke client/browser
- Environment variable hanya accessible di server

**Client Protection:**
- AI toggle status disimpan di localStorage (user preference)
- Widget dan features disabled saat AI OFF
- Error handling untuk failed API calls

### 📊 Model AI yang Tersedia

1. **Groq Llama 3.1 8B** (Default - GRATIS)
   - Model: `llama-3.1-8b-instant`
   - Speed: 70-100 tokens/second
   - Best for: Climate analysis, general chat
   - Cost: FREE

2. **GPT-4o** (Optional - Berbayar)
   - Requires: OpenAI API key
   - Best for: Advanced reasoning

3. **DeepSeek** (Optional)
   - Requires: DeepSeek API key
   - Best for: Code-focused tasks

4. **Claude** (Optional)
   - Requires: Anthropic API key
   - Best for: Long context analysis

### 🐛 Troubleshooting

#### AI Features Tidak Bekerja

1. **Check API Key**
   ```bash
   # Pastikan .env.local ada dan berisi GROQ_API_KEY
   cat .env.local
   ```

2. **Restart Server**
   ```bash
   # Ctrl+C untuk stop, kemudian:
   npm run dev
   ```

3. **Check Browser Console**
   - Buka DevTools (F12)
   - Tab Console - lihat error messages
   - Tab Network - check API calls

4. **Verify AI Toggle**
   - Pastikan toggle di navbar dalam status **ON**
   - Warna ungu/purple = active
   - Ada indikator hijau kecil

#### "Failed to generate insights"

- **Penyebab:** API key tidak valid atau expired
- **Solusi:** Generate API key baru di Groq Console
- **Fallback:** App akan show static data

#### Chat Widget Tidak Muncul

- **Penyebab:** AI masih OFF
- **Solusi:** Enable AI dari navbar toggle
- **Note:** Widget akan muncul tapi disabled jika AI OFF

### 📝 Files Modified/Created

**New Files:**
- `src/contexts/AIContext.tsx` - AI state management
- `src/services/groqService.ts` - Groq API service
- `src/app/api/ai/chat/route.ts` - Chat API
- `src/app/api/ai/insights/route.ts` - Insights API
- `src/app/api/ai/recommendations/route.ts` - Recommendations API
- `.env.local.example` - Environment template
- `AI_IMPLEMENTATION.md` - This file

**Modified Files:**
- `src/components/Navbar.tsx` - Added AI toggle
- `src/components/InsightsPage.tsx` - Integrated AI
- `src/components/AIChatWidget.tsx` - Integrated AI
- `src/app/layout.tsx` - Added AIProvider
- `package.json` - Added groq-sdk

### 🎨 UI/UX Features

**Visual Indicators:**
- 🧠 Icon untuk AI features
- Purple/Indigo gradient untuk AI elements
- Green dot = AI active
- Red dot = AI inactive
- Loading spinner saat AI processing
- Error messages dengan retry button

**Animations:**
- Smooth transitions dengan Framer Motion
- Pulse animation untuk active states
- Scale effects pada hover
- Slide-in animations untuk chat

**Responsive:**
- Mobile-friendly chat widget
- Responsive grid untuk insights cards
- Adaptive layouts untuk semua screen sizes

### 💡 Next Steps (Optional Enhancements)

1. **Add More Data Sources**
   - Integrate real NASA MODIS data
   - Add weather API integration
   - Historical data comparison

2. **Enhanced AI Features**
   - Voice input untuk chat
   - Export conversation history
   - Save favorite insights
   - Share insights via social media

3. **Analytics**
   - Track AI usage metrics
   - Monitor response quality
   - A/B testing different prompts

4. **Personalization**
   - User preferences
   - Custom regions/locations
   - Notification preferences

### 📞 Support

Jika ada pertanyaan atau masalah:
1. Check documentation ini
2. Review error messages di console
3. Verify .env.local configuration
4. Check Groq API status: https://status.groq.com/

---

**Built with:**
- Next.js 14
- Groq API (Llama 3.1 8B)
- React Context API
- Framer Motion
- TailwindCSS
- TypeScript

**Last Updated:** October 5, 2025
