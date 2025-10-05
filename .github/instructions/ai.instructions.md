---
applyTo: '**'
---
🧩 1. Struktur Navigasi & Halaman Utama

Aplikasi web EcoTrack memiliki 5 halaman utama + 1 sub-page interaktif AI, semua terhubung lewat navbar atas.

🧭 Navbar (Tetap di semua halaman)

Elemen:

Logo: “🌍 EcoTrack”

Menu utama:

Dashboard

Datasets

Insights

Reports

Profile

Search bar (global)

User Avatar

AI Status Indicator (🧠 ON/OFF)

🌍 2. Halaman 1: Dashboard (Overview Page)

📍 Path: /dashboard

🎯 Tujuan:

Menampilkan ringkasan global emisi, NDVI, suhu, dan AI summary cepat untuk 1 region aktif.

📐 Layout (2 kolom + 1 summary panel)
🧱 A. Header Section

Title: “Earth Monitoring — Overview”

Subtitle: “All Active Regions”

Right Corner: Mini globe animation (Earth spinning)

Quick Filter:

Region selector (dropdown)

Date range picker

Refresh data button

🧱 B. Metrics Cards (di bawah header)

Tampilan 3 kartu horizontal:

CO₂ Average → “418 ppm”

Emission Change → “+12%”

NDVI Index → “0.68”

🔧 (Setiap kartu terhubung ke data NASA NEO atau MODIS via API)

🧱 C. Trend & Visualization Section

Grid 3 kolom:

Left: Line chart (CO₂ trend)

Center: Alerts box (Critical / Warning)

Right: Bar chart (Emission by Region)

🧱 D. AI Insight Summary (Panel Tengah)

Card besar bertuliskan:

🧠 “AI Insight & Summary — Powered by GPT-4o”
“CO₂ levels increased 14% in Southeast Asia since 2019. NDVI below normal in Kalimantan.”

Komponen:

Confidence score bar

“Explain More” → membuka halaman /insights

🧱 E. Regional Emission Table (Bawah)

Tabel dinamis:

Region	CO₂ (ppm)	Emission	NDVI	Status	Updated
Asia	420	+10%	0.65	⚠ Warning	2h ago
📚 3. Halaman 2: Datasets Browser

📍 Path: /datasets

🎯 Tujuan:

Menampilkan daftar dataset NASA yang dapat diakses untuk analisis.

📐 Layout
A. Header Section

Title: “NASA Earth Data — Datasets Browser”

Subtitle: “Access real-time satellite data for climate analytics.”

Search bar + Filter button

Right corner: Animated satellite image (dark mode version)

B. Dataset Table
Dataset	Source	Variables	Time Range	Resolution	Actions
Atmospheric CO₂	NEO	CO₂	2000–2024	1° x 1°	🔍 View • ⬇ Download
NDVI	MODIS	NDVI	2015–2024	500m	🔍 View • ⬇ Download
C. Footer Stats

Total datasets: 6

Downloads: 142

Last updated: Today

⚙️ Saat klik “View Dataset” → menampilkan modal grafik preview & opsi kirim ke AI Insights.

🧠 4. Halaman 3: AI Insights Page

📍 Path: /insights

🎯 Tujuan:

Menampilkan hasil analisis AI secara mendalam.

📐 Layout
A. Header

Title: “AI Insights — Climate Intelligence Analysis”

Subtitle: “Powered by GPT-4o | Confidence 87%”

Right corner: Toggle “Model Selector” → pilih LLM (GPT-4o, DeepSeek, Llama)

B. AI Summary Cards (3 per baris)

Contoh isi:

🌫 “CO₂ Emission Trends in Southeast Asia”

🌳 “NDVI Index Declining in Amazon Rainforest”

🌡 “Temperature Anomaly in Arctic Region”

C. Recommended Actions

Card besar berisi:

“Implement Reforestation Programs”

“Accelerate Renewable Energy Transition”

“Reduce Transportation Emissions”

D. AI Interaction Widget (opsional)

Mini chat bubble di pojok kanan bawah:

“Ask AI about CO₂ trends in Jakarta 🔍”

→ Mengaktifkan pop-up chat kecil:

Kamu bisa bertanya langsung, LLM menampilkan insight tambahan dari dataset aktif.

📊 5. Halaman 4: Reports Page

📍 Path: /reports

🎯 Tujuan:

Tempat mengunduh laporan otomatis hasil AI analysis.

📐 Layout
A. Header

Title: “Analysis Reports”

Button: “Generate New Report (AI)”

Filter: Dropdown (PDF / Word / CSV)

B. Table
Report Name	Dataset	Period	Format	Actions
CO₂ Southeast Asia	NEO	2015–2024	PDF	🔍 View • ⬇ Download
NDVI Vegetation	MODIS	2010–2024	DOCX	🔍 View • ⬇ Download
C. Stats Footer

Total reports generated: 5

Downloads: 234

Shared: 48

Ketika klik Generate New Report, backend memanggil AI engine untuk menyusun laporan otomatis.

👤 6. Halaman 5: Profile Page

📍 Path: /profile

🎯 Tujuan:

Menampilkan profil pengguna dan preferensi model AI.

📐 Layout

User Card: Nama, foto, role, email

Settings:

Default AI model

Default region

Language preference

API usage quota

History:

Daftar analisis terakhir

Model used (GPT-4o, Llama, dll.)

🧠 7. Dimana Tepatnya Fitur AI Muncul di UI (Front-End)
Lokasi	Bentuk Fitur AI	Fungsi
Dashboard	“AI Summary Card”	Menampilkan insight otomatis singkat dari data NASA terbaru
AI Insights Page	“Insight Cards + Model Selector”	Analisis mendalam & rekomendasi
Reports Page	“AI Auto Generate Report”	Buat laporan otomatis berdasarkan hasil AI
Chat Widget (kanan bawah)	AI mini assistant	Bisa tanya langsung soal data
Profile Page	Model Preferences	Pilih model AI default (GPT / Llama / DeepSeek)
🧠 Visual Struktur Front-End (Sederhana)
[Navbar]
   ├── Dashboard
   │    ├── Metrics
   │    ├── Graphs
   │    ├── AI Summary (Insight Card)
   │    └── Regional Table
   │
   ├── Datasets
   │    └── Dataset List + Preview
   │
   ├── Insights
   │    ├── AI Model Selector
   │    ├── Insight Cards
   │    ├── Recommendations
   │    └── Chat Widget
   │
   ├── Reports
   │    └── Auto-generated reports
   │
   └── Profile
        └── Preferences + AI Model Settings

🌈 8. UX Enhancement (Agar Lebih “AI Feel”)

Tambahan untuk memperkuat kesan AI:

💬 Tooltip “Analyzed by AI” di setiap insight.

🔄 Animated loading (neural animation) saat AI memproses data.

🧠 Badge kecil “Powered by GPT-4o / DeepSeek”.

🎨 Light/Dark switch dengan efek glassmorphism.