from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import logging
from typing import Optional

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FellowSheep Gaming API Proxy",
    description="Backend proxy para a API do Age of Empires 2 DE",
    version="1.0.0"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "https://fellowsheep.vercel.app",  # Produção
        "https://fellowsheep-gaming.vercel.app"  # Alternativa
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URL base da API do Age of Empires 2 DE
AOE_API_BASE = "https://aoe-api.reliclink.com"

@app.get("/")
async def root():
    return {
        "message": "FellowSheep Gaming API Proxy",
        "status": "running",
        "api_base": AOE_API_BASE
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fellowsheep-proxy"}

@app.get("/api/leaderboards")
async def get_available_leaderboards():
    """Buscar leaderboards disponíveis"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{AOE_API_BASE}/community/leaderboard/getAvailableLeaderboards?title=age2"
            )
            response.raise_for_status()
            data = response.json()
            logger.info("✅ Leaderboards carregados com sucesso")
            return data
    except Exception as e:
        logger.error(f"❌ Erro ao buscar leaderboards: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar leaderboards: {str(e)}")

@app.get("/api/leaderboard/{leaderboard_id}")
async def get_leaderboard(
    leaderboard_id: int = 3,
    start: int = 0,
    count: int = 1000,
    sort_by: int = 1
):
    """Buscar ranking específico"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{AOE_API_BASE}/community/leaderboard/getLeaderboard2",
                params={
                    "title": "age2",
                    "leaderboard_id": leaderboard_id,
                    "start": start,
                    "count": count,
                    "sortBy": sort_by
                }
            )
            response.raise_for_status()
            data = response.json()
            logger.info(f"✅ Ranking {leaderboard_id} carregado com sucesso")
            return data
    except Exception as e:
        logger.error(f"❌ Erro ao buscar ranking {leaderboard_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar ranking: {str(e)}")

@app.get("/api/player/stats")
async def get_player_stats(profile_ids: str):
    """Buscar estatísticas de jogadores específicos"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{AOE_API_BASE}/community/leaderboard/GetPersonalStat",
                params={
                    "title": "age2",
                    "profile_ids": f"[{profile_ids}]"
                }
            )
            response.raise_for_status()
            data = response.json()
            logger.info(f"✅ Estatísticas de jogadores carregadas com sucesso")
            return data
    except Exception as e:
        logger.error(f"❌ Erro ao buscar estatísticas de jogadores: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar estatísticas: {str(e)}")

@app.get("/api/search/player")
async def search_player(name: str, leaderboard_id: int = 3):
    """Buscar jogador por nome"""
    try:
        # Primeiro buscar o ranking completo e depois filtrar
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{AOE_API_BASE}/community/leaderboard/getLeaderboard2",
                params={
                    "title": "age2",
                    "leaderboard_id": leaderboard_id,
                    "start": 0,
                    "count": 1000,
                    "sortBy": 1
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Filtrar jogadores por nome
            search_term = name.lower()
            filtered_players = [
                player for player in data
                if search_term in (player.get('name', '') or '').lower() or 
                   search_term in (player.get('profileName', '') or '').lower()
            ]
            
            logger.info(f"✅ Busca por '{name}' retornou {len(filtered_players)} resultados")
            return filtered_players
    except Exception as e:
        logger.error(f"❌ Erro ao buscar jogador '{name}': {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar jogador: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 