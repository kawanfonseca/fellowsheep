// Serviço para buscar dados de jogos ao vivo e streams
class LiveService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutos para dados ao vivo
    this.backendBaseUrl = 'https://fellowsheepapi.vercel.app';
  }

  // Verificar se o cache ainda é válido
  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  // Simular delay de rede
  async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  }

  // Buscar jogos ao vivo do clã usando backend (proxy + filtro FS)
  async getLiveGames() {
    const cacheKey = 'live_games';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      // Preferir endpoint com composição dos times; fallback para leaderboard filtrado
      let resp = await fetch(`${this.backendBaseUrl}/api/liveFsMatches`);
      if (!resp.ok) throw new Error('Erro ao buscar jogos ao vivo');
      let data = await resp.json();

      if (!Array.isArray(data) || data.length === 0) {
        // Fallback
        resp = await fetch(`${this.backendBaseUrl}/api/liveFs1v1`);
        data = await resp.json();
        const gamesFromLb = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.profile_id,
          player1: p.name,
          player2: 'Adversário',
          map: 'Ranked Queue',
          gameType: '1v1 Random Map',
          startTime: new Date((p.last_match_time || 0) * 1000) || new Date(),
          status: 'playing',
          score: '0-0',
        }));
        this.cache.set(cacheKey, { data: gamesFromLb, timestamp: Date.now() });
        return gamesFromLb;
      }

      // Mapear para UI atual a partir de partidas com times
      const games = data.map((m) => {
        const team0Names = (m.teams?.team0 || []).map(p => p.name).join(', ');
        const team1Names = (m.teams?.team1 || []).map(p => p.name).join(', ');
        return {
          id: m.id,
          player1: team0Names || 'Time A',
          player2: team1Names || 'Time B',
          map: m.mapname || 'Ranked',
          gameType: m.gameType || 'Ranked',
          startTime: new Date((m.startgametime || 0) * 1000) || new Date(),
          status: 'playing',
          score: '0-0',
        };
      });

      this.cache.set(cacheKey, {
        data: games,
        timestamp: Date.now()
      });
      
      return games;
    } catch (error) {
      console.error('Erro ao buscar jogos ao vivo:', error);
      return [];
    }
  }

  // Buscar streams ao vivo da Twitch
  async getTwitchStreams() {
    const cacheKey = 'twitch_streams';
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }
    try {
      const resp = await fetch(`${this.backendBaseUrl}/api/streams/twitch`);
      const data = await resp.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Erro ao buscar streams da Twitch:', error);
      return [];
    }
  }

  // Buscar streams ao vivo do YouTube
  async getYouTubeStreams() {
    const cacheKey = 'youtube_streams';
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }
    try {
      const resp = await fetch(`${this.backendBaseUrl}/api/streams/youtube`);
      const data = await resp.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Erro ao buscar streams do YouTube:', error);
      return [];
    }
  }

  // Buscar todos os streams ao vivo
  async getAllLiveStreams() {
    try {
      const resp = await fetch(`${this.backendBaseUrl}/api/streams`);
      const data = await resp.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao buscar todos os streams:', error);
      return [];
    }
  }

  // Buscar jogos ao vivo e partidas recentes para a Home
  async getLiveAndRecentGames() {
    try {
      const [liveResp, recentResp] = await Promise.all([
        fetch(`${this.backendBaseUrl}/api/liveFsMatches`),
        fetch(`${this.backendBaseUrl}/api/recentFsMatches`)
      ]);
      const liveData = await liveResp.json();
      const recentData = await recentResp.json();

      const mapMatchToCard = (m) => ({
        id: m.id,
        gameType: m.gameType,
        map: m.mapname,
        startTime: new Date((m.startgametime || 0) * 1000) || new Date(),
        team0: (m.teams?.team0 || []).map(p => p.name),
        team1: (m.teams?.team1 || []).map(p => p.name),
      });

      const live = Array.isArray(liveData) ? liveData.map(mapMatchToCard) : [];
      const recent = Array.isArray(recentData) ? recentData.map(mapMatchToCard) : [];

      return { live, recent };
    } catch (e) {
      return { live: [], recent: [] };
    }
  }

  // Formatar tempo de jogo
  formatGameTime(startTime) {
    const now = new Date();
    const diff = now - startTime;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Limpar cache expirado
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }
}

export default new LiveService(); 