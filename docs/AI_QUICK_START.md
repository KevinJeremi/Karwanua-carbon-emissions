# 🚀 Quick Start: AI Features

## Langkah Cepat (5 Menit)

### 1️⃣ Get FREE Groq API Key

```bash
1. Buka: https://console.groq.com/
2. Sign up (gratis, tanpa kartu kredit)
3. Buat API Key di dashboard
4. Copy API key
```

### 2️⃣ Setup Environment

```bash
# Buat file .env.local
cp .env.local.example .env.local

# Edit .env.local dan paste API key:
GROQ_API_KEY=gsk_your_api_key_here
```

### 3️⃣ Start Server

```bash
npm run dev
```

### 4️⃣ Enable AI

1. Buka aplikasi di browser: http://localhost:3000
2. Klik tombol **🧠 OFF** di navbar (kanan atas)
3. Toggle berubah jadi **🧠 ON** (warna ungu)

### 5️⃣ Try AI Features

**AI Insights:**
- Navigasi ke Analytics → Insights
- AI otomatis generate climate insights
- Lihat recommendations

**AI Chat:**
- Klik floating button 💜 di kanan bawah
- Chat dengan AI tentang climate data
- Try quick questions

## ✅ Verification

Jika berhasil, Anda akan lihat:
- ✅ Toggle 🧠 ON di navbar (warna ungu)
- ✅ AI-generated insights di Insights page
- ✅ Chat widget aktif di kanan bawah
- ✅ No error messages di console

## 🐛 Troubleshooting

**AI tidak bekerja?**
```bash
# 1. Check .env.local file exists
ls .env.local

# 2. Restart server (Ctrl+C, then)
npm run dev

# 3. Clear browser cache
# 4. Check browser console (F12) for errors
```

**Chat widget tidak muncul?**
- Pastikan AI toggle dalam status **ON**
- Refresh page

## 📚 Full Documentation

Untuk panduan lengkap, lihat: `docs/AI_IMPLEMENTATION.md`

---

**Need Help?** Check:
- Error messages di browser console
- Groq API status: https://status.groq.com/
- API key validity di Groq dashboard
