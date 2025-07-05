#!/usr/bin/env python3
"""
Script para iniciar o servidor backend FellowSheep Gaming
"""

import uvicorn
import os

def main():
    # Configurar variáveis de ambiente
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    print("🚀 FellowSheep Gaming Backend Proxy")
    print("=" * 50)
    print(f"📍 Host: {host}")
    print(f"🔌 Porta: {port}")
    print(f"🔄 Reload: {reload}")
    print(f"🌐 URL: http://{host}:{port}")
    print(f"📚 API Docs: http://{host}:{port}/docs")
    print(f"❤️  Health Check: http://{host}:{port}/health")
    print("=" * 50)
    
    # Iniciar servidor
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

if __name__ == "__main__":
    main() 