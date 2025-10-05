# AI Models Testing Guide

## 🚀 Cara Menjalankan Test AI Models

### 1. Install Dependencies Python

```bash
# Install required packages
pip install groq google-generativeai requests python-dotenv
```

### 2. Setup API Keys di .env

Edit file `.env` di root project dan tambahkan:

```env
# ✅ Already configured
GROQ_API_KEY=your_groq_api_key_here

# 🆕 Optional - untuk testing model lain
GOOGLE_API_KEY=your_google_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
TOGETHER_API_KEY=your_together_api_key_here
```

### 3. Dapatkan API Keys (Gratis)

#### **GROQ (Recommended - Already configured)** 🌟
- Website: https://console.groq.com
- Free tier: **14,400 requests/day** (30 req/min)
- Model: Llama 3.1 8B Instant (tercepat!)
- ✅ Sudah terintegrasi di aplikasi

#### **Google Gemini Flash**
- Website: https://ai.google.dev
- Free tier: **1,500 requests/day** (15 req/min)
- Model: Gemini 1.5 Flash
- Multimodal capabilities

#### **Together AI**
- Website: https://together.ai
- Multiple free tier models
- Good for variety

#### **Hugging Face**
- Website: https://huggingface.co
- Free inference API
- Multiple models available

### 4. Jalankan Test Script

```bash
python test_ai_models.py
```

## 📊 Output yang Diharapkan

Script akan menampilkan:
- ✅ Status setiap AI model (Working / Failed)
- 📝 Response dari setiap model
- 🔢 Token usage information
- 💡 Rekomendasi model terbaik untuk EcoTrack

## 🎯 Model yang Tersedia di UI

Setelah testing, Anda dapat memilih model di halaman **AI Insights**:

1. **🚀 Groq Llama 3.1 8B** (Default - Free - 14.4K req/day)
   - Tercepat untuk real-time analysis
   - Sudah terintegrasi penuh
   - Recommended untuk production

2. **🤖 Groq Llama 3.1 70B** (Free - 6K req/day)
   - Lebih capable untuk complex queries
   - Slower tapi lebih akurat

3. **✨ Google Gemini 1.5 Flash** (Free - 1.5K req/day)
   - Multimodal capabilities
   - Good alternative

4. **🔥 Together AI Llama 3** (Free tier)
   - Multiple model options
   - Good for experimentation

5. **🌪️ Mistral 7B** (Free via Hugging Face)
   - Open source alternative
   - Good performance

## 💡 Tips

- **Untuk Production**: Gunakan Groq Llama 3.1 8B (sudah optimal)
- **Untuk Testing**: Coba semua model untuk compare hasil
- **Untuk Cost Saving**: Semua model di atas memiliki free tier yang generous

## 🔧 Troubleshooting

**Error: API Key tidak valid**
- Pastikan API key sudah benar di file `.env`
- Cek apakah API key masih aktif di console masing-masing provider

**Error: Module not found**
- Jalankan: `pip install -r requirements.txt` (jika ada)
- Atau install manual: `pip install groq google-generativeai requests`

**Error: Rate limit exceeded**
- Tunggu beberapa menit
- Check kuota di console provider
- Switch ke model alternatif

## 📝 Next Steps

Setelah testing:
1. Pilih model favorit di UI (AI Insights page)
2. Button "Ask AI" akan membuka chatbot global
3. Semua fitur AI menggunakan model yang dipilih

---

Created for EcoTrack - Climate Intelligence Platform 🌍
