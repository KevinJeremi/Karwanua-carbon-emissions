# 🔄 Reset AI Status Script

## Cara 1: Via Browser Console (RECOMMENDED) ⚡

1. **Buka browser** di `http://localhost:3000`
2. **Tekan F12** untuk buka Developer Tools
3. **Klik tab "Console"**
4. **Copy-paste kode berikut** dan tekan Enter:

```javascript
// Clear & Reset AI Status
localStorage.removeItem('ai-enabled');
localStorage.removeItem('ai-model');
localStorage.setItem('ai-enabled', 'false');
localStorage.setItem('ai-model', 'groq-llama');
console.log('✅ AI Status reset to OFF');
location.reload();
```

5. **Page akan auto-refresh** dan AI status akan OFF

---

## Cara 2: Via Application Tab

1. **Buka browser** di `http://localhost:3000`
2. **Tekan F12** untuk buka Developer Tools
3. **Klik tab "Application"** (Chrome) atau "Storage" (Firefox)
4. **Expand "Local Storage"** di sidebar kiri
5. **Klik pada** `http://localhost:3000`
6. **Cari key** `ai-enabled`
7. **Klik kanan** → **Delete** atau ubah value ke `false`
8. **Refresh page** (F5)

---

## Cara 3: Clear All Site Data

1. **Buka browser** di `http://localhost:3000`
2. **Tekan F12** untuk buka Developer Tools
3. **Klik tab "Application"** (Chrome)
4. **Klik "Clear site data"** di sidebar
5. **Check "Local storage"**
6. **Click "Clear site data"**
7. **Refresh page** (F5)

---

## Verifikasi ✅

Setelah reset, pastikan:

1. ✅ Navbar menampilkan **🧠 OFF** (abu-abu)
2. ✅ Insights page menampilkan **"AI Insights Disabled"**
3. ✅ **TIDAK ADA** warning "🚫 AI is currently disabled" jika AI sudah OFF
4. ✅ Model selector dan Ask AI button **disabled**

---

## Testing Flow 🧪

### Step 1: Verify OFF State
```
1. Load page
2. Check navbar → Should show "🧠 OFF"
3. Go to Insights page
4. Should show "AI Insights Disabled" message
5. No red warning box
6. No insights cards
7. No recommendations section
```

### Step 2: Toggle ON
```
1. Click 🧠 toggle in navbar
2. Button changes to "🧠 ON" (purple)
3. Green pulse dot appears
4. Insights page shows loading spinner
5. API is called
6. Insights cards appear
7. Recommendations appear
```

### Step 3: Toggle OFF
```
1. Click 🧠 toggle in navbar again
2. Button changes to "🧠 OFF" (gray)
3. Green dot disappears
4. Insights page clears data
5. Shows "AI Insights Disabled" message
6. Recommendations hidden
```

---

## Quick Reset Command (Copy-Paste)

```javascript
localStorage.setItem('ai-enabled','false');location.reload();
```

---

## Debug Commands

Check current AI status:
```javascript
console.log('AI Enabled:', localStorage.getItem('ai-enabled'));
console.log('AI Model:', localStorage.getItem('ai-model'));
```

Force enable AI:
```javascript
localStorage.setItem('ai-enabled','true');location.reload();
```

Force disable AI:
```javascript
localStorage.setItem('ai-enabled','false');location.reload();
```
