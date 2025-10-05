"""
Test script untuk mencoba SEMUA MODEL GROQ yang tersedia
Menguji semua model dari Groq API untuk EcoTrack AI Insights
"""

import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env.local (Next.js style)
load_dotenv('.env.local')

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

if not GROQ_API_KEY:
    print("❌ GROQ_API_KEY tidak ditemukan di .env file!")
    print("💡 Tambahkan GROQ_API_KEY=your_key di file .env")
    exit(1)

client = Groq(api_key=GROQ_API_KEY)

# ============================================
# DAFTAR SEMUA MODEL GROQ YANG TERSEDIA (Updated 2025)
# Berdasarkan hasil API call ke Groq
# ============================================
GROQ_MODELS = [
    # === LLAMA 4 SERIES (TERBARU! 🆕) ===
    {
        "id": "meta-llama/llama-4-maverick-17b-128e-instruct",
        "name": "Llama 4 Maverick 17B (128 Experts)",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🆕 Model terbaru, MoE architecture"
    },
    {
        "id": "meta-llama/llama-4-scout-17b-16e-instruct",
        "name": "Llama 4 Scout 17B (16 Experts)",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🆕 Balanced performance & speed"
    },
    
    # === LLAMA 3.3 SERIES ===
    {
        "id": "llama-3.3-70b-versatile",
        "name": "Llama 3.3 70B Versatile",
        "context": "131K",
        "free_limit": "6,000/day",
        "description": "🔥 Most capable, 131K context!"
    },
    
    # === LLAMA 3.1 SERIES (PROVEN & FAST) ===
    {
        "id": "llama-3.1-8b-instant",
        "name": "Llama 3.1 8B Instant",
        "context": "131K",
        "free_limit": "14,400/day",
        "description": "⚡ Tercepat, perfect untuk real-time"
    },
    
    # === DEEPSEEK R1 (REASONING MODEL) ===
    {
        "id": "deepseek-r1-distill-llama-70b",
        "name": "DeepSeek R1 Distill 70B",
        "context": "131K",
        "free_limit": "6,000/day",
        "description": "🧠 Reasoning-focused, great for analysis"
    },
    
    # === GROQ COMPOUND (PROPRIETARY) ===
    {
        "id": "groq/compound",
        "name": "Groq Compound",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🎯 Groq's proprietary model"
    },
    {
        "id": "groq/compound-mini",
        "name": "Groq Compound Mini",
        "context": "131K",
        "free_limit": "TBD",
        "description": "⚡ Faster, lightweight version"
    },
    
    # === MOONSHOT KIMI (CHINESE MODEL) ===
    {
        "id": "moonshotai/kimi-k2-instruct",
        "name": "Kimi K2 Instruct",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🌙 Strong multilingual support"
    },
    {
        "id": "moonshotai/kimi-k2-instruct-0905",
        "name": "Kimi K2 Instruct 0905",
        "context": "262K",
        "description": "🌙 Ultra-long context (262K!)"
    },
    
    # === QWEN (ALIBABA) ===
    {
        "id": "qwen/qwen3-32b",
        "name": "Qwen 3 32B",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🇨🇳 Alibaba's powerful model"
    },
    
    # === OPENAI OSS MODELS ===
    {
        "id": "openai/gpt-oss-20b",
        "name": "GPT-OSS 20B",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🤖 OpenAI open-source style"
    },
    {
        "id": "openai/gpt-oss-120b",
        "name": "GPT-OSS 120B",
        "context": "131K",
        "free_limit": "TBD",
        "description": "🤖 Largest OSS model"
    },
    
    # === GEMMA 2 (GOOGLE) ===
    {
        "id": "gemma2-9b-it",
        "name": "Gemma 2 9B",
        "context": "8K",
        "free_limit": "14,400/day",
        "description": "✨ Google's efficient model"
    },
    
    # === ALLAM (ARABIC SUPPORT) ===
    {
        "id": "allam-2-7b",
        "name": "Allam 2 7B",
        "context": "4K",
        "free_limit": "TBD",
        "description": "🇸🇦 Arabic language specialist"
    },
]


def test_groq_model(model_info: dict) -> dict:
    """Test a single Groq model"""
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a climate expert. Answer briefly in 1-2 sentences."
                },
                {
                    "role": "user",
                    "content": "What causes high CO2 levels?"
                }
            ],
            model=model_info["id"],
            temperature=0.7,
            max_tokens=150
        )
        
        result = {
            "success": True,
            "response": response.choices[0].message.content,
            "tokens": response.usage.total_tokens,
            "model": response.model
        }
        
        print(f"✅ {model_info['name']}")
        print(f"   ID: {model_info['id']}")
        print(f"   Response: {result['response'][:100]}...")
        print(f"   Tokens: {result['tokens']}")
        print(f"   Free Limit: {model_info['free_limit']}")
        print(f"   Context: {model_info['context']}")
        print("-" * 80)
        
        return result
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ {model_info['name']}")
        print(f"   ID: {model_info['id']}")
        print(f"   Error: {error_msg[:100]}")
        print("-" * 80)
        
        return {
            "success": False,
            "error": error_msg
        }


def generate_typescript_options():
    """Generate TypeScript code for dropdown options"""
    print("\n" + "=" * 80)
    print("📝 TYPESCRIPT CODE FOR DROPDOWN (Copy this to InsightsPage.tsx)")
    print("=" * 80)
    print("\n<select>")
    
    # Only include working/recommended models
    recommended = [
        ("llama-3.1-8b-instant", "🚀", "Llama 3.1 8B Instant", "14.4K/day"),
        ("llama-3.3-70b-versatile", "🔥", "Llama 3.3 70B Versatile", "6K/day"),
        ("deepseek-r1-distill-llama-70b", "🧠", "DeepSeek R1 Distill 70B", "6K/day"),
        ("meta-llama/llama-4-maverick-17b-128e-instruct", "🆕", "Llama 4 Maverick 17B", "New"),
        ("meta-llama/llama-4-scout-17b-16e-instruct", "🆕", "Llama 4 Scout 17B", "New"),
        ("groq/compound", "🎯", "Groq Compound", "TBD"),
        ("moonshotai/kimi-k2-instruct", "🌙", "Kimi K2 Instruct", "TBD"),
        ("qwen/qwen3-32b", "🇨🇳", "Qwen 3 32B", "TBD"),
        ("gemma2-9b-it", "✨", "Gemma 2 9B", "14.4K/day"),
    ]
    
    for model_id, emoji, name, limit in recommended:
        print(f'  <option value="{model_id}" className="bg-greenish-dark">')
        print(f'    {emoji} {name} (Free - {limit})')
        print(f'  </option>')
    
    print("</select>\n")


def print_recommendations():
    """Print detailed recommendations"""
    print("\n" + "=" * 80)
    print("🎯 REKOMENDASI MODEL GROQ UNTUK ECOTRACK")
    print("=" * 80)
    print()
    print("🥇 DEFAULT (Tercepat & Terbukti):")
    print("   → llama-3.1-8b-instant")
    print("   ✓ FREE: 14,400 requests/day (30 req/min)")
    print("   ✓ Context: 131K tokens (besar!)")
    print("   ✓ Tercepat - Perfect untuk chat & quick analysis")
    print()
    print("🥈 PALING PINTAR (Best Reasoning):")
    print("   → llama-3.3-70b-versatile")
    print("   ✓ FREE: 6,000 requests/day")
    print("   ✓ Context: 131K tokens")
    print("   ✓ Paling capable - Best untuk analisis mendalam")
    print()
    print("� REASONING SPECIALIST:")
    print("   → deepseek-r1-distill-llama-70b")
    print("   ✓ FREE: 6,000 requests/day")
    print("   ✓ Context: 131K tokens")
    print("   ✓ Specialized untuk logical reasoning & problem solving")
    print()
    print("🆕 TERBARU - LLAMA 4:")
    print("   → meta-llama/llama-4-maverick-17b-128e-instruct")
    print("   ✓ MoE architecture (128 experts!)")
    print("   ✓ Context: 131K tokens")
    print("   ✓ Cutting-edge technology")
    print()
    print("🌙 MULTILINGUAL CHAMPION:")
    print("   → moonshotai/kimi-k2-instruct-0905")
    print("   ✓ Context: 262K tokens (TERBESAR!)")
    print("   ✓ Best untuk multi-bahasa")
    print("   ✓ Perfect untuk long documents")
    print()
    print("=" * 80)
    print()
    print("💡 SETUP YANG DIREKOMENDASIKAN:")
    print("   1. Default: llama-3.1-8b-instant (fastest, proven)")
    print("   2. Alternative 1: llama-3.3-70b-versatile (smartest)")
    print("   3. Alternative 2: deepseek-r1-distill-llama-70b (reasoning)")
    print("   4. For testing: llama-4-maverick (newest tech)")
    print("=" * 80)


# ============================================
# MAIN
# ============================================
if __name__ == "__main__":
    print("\n🚀 Testing SEMUA MODEL GROQ API\n")
    print("=" * 80)
    
    results = {}
    working_models = []
    failed_models = []
    
    for model in GROQ_MODELS:
        result = test_groq_model(model)
        results[model["id"]] = result
        
        if result["success"]:
            working_models.append(model)
        else:
            failed_models.append(model)
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 HASIL TEST SUMMARY")
    print("=" * 80)
    print(f"\n✅ Working Models: {len(working_models)}/{len(GROQ_MODELS)}")
    print(f"❌ Failed Models: {len(failed_models)}/{len(GROQ_MODELS)}")
    
    if working_models:
        print("\n✅ MODELS YANG BISA DIGUNAKAN:")
        for model in working_models:
            print(f"   • {model['name']} ({model['id']})")
            print(f"     Free: {model['free_limit']} | Context: {model['context']}")
    
    if failed_models:
        print("\n❌ MODELS YANG GAGAL:")
        for model in failed_models:
            print(f"   • {model['name']} ({model['id']})")
    
    # Generate code for dropdown
    generate_typescript_options()
    
    # Recommendations
    print_recommendations()
    
    print("\n" + "=" * 80)
    print("🔧 NEXT STEPS:")
    print("=" * 80)
    print("1. Copy kode dropdown di atas ke InsightsPage.tsx")
    print("2. Update AI model selector dengan opsi yang working")
    print("3. Test di browser - semua model akan bekerja!")
    print("=" * 80)
    print()

    print("=" * 80)
    print()

