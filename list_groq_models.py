"""
Script untuk mendapatkan daftar SEMUA model Groq yang tersedia saat ini
"""

import os
from dotenv import load_dotenv
from groq import Groq

# Load .env.local
load_dotenv('.env.local')

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Get all available models
print("\n🔍 Fetching all available Groq models...\n")
print("=" * 80)

try:
    models = client.models.list()
    
    print(f"📊 Total Models Available: {len(models.data)}\n")
    
    for model in models.data:
        print(f"✅ {model.id}")
        if hasattr(model, 'context_window'):
            print(f"   Context: {model.context_window}")
        if hasattr(model, 'owned_by'):
            print(f"   Owned by: {model.owned_by}")
        print()
    
    print("=" * 80)
    print("\n💾 Saving model list to models.txt...")
    
    with open('groq_models.txt', 'w') as f:
        for model in models.data:
            f.write(f"{model.id}\n")
    
    print("✅ Model list saved to groq_models.txt")
    
except Exception as e:
    print(f"❌ Error: {e}")
