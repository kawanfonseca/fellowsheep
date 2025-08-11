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
      // Aqui você pode integrar com a API da Twitch
      // Por enquanto, usando dados mockados
      await this.simulateNetworkDelay();
      
      const twitchStreams = [
        {
          id: 1,
          username: 'fs_kawan',
          title: 'Age of Empires 2 DE - Ranked Games',
          game: 'Age of Empires II: Definitive Edition',
          viewerCount: 245,
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzY0NDFhNSIvPjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZzLkthd2FuIExpdmU8L3RleHQ+PC9zdmc+',
          url: 'https://twitch.tv/fs_kawan',
          platform: 'twitch'
        },
        {
          id: 2,
          username: 'sheepking_aoe',
          title: 'Empire Wars Tournament Practice',
          game: 'Age of Empires II: Definitive Edition',
          viewerCount: 189,
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzY0NDFhNSIvPjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNoZWVwS2luZyBMaXZlPC90ZXh0Pjwvc3ZnPg==',
          url: 'https://twitch.tv/sheepking_aoe',
          platform: 'twitch'
        }
      ];

      this.cache.set(cacheKey, {
        data: twitchStreams,
        timestamp: Date.now()
      });
      
      return twitchStreams;
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
      // Aqui você pode integrar com a API do YouTube
      // Por enquanto, usando dados mockados
      await this.simulateNetworkDelay();
      
      const youtubeStreams = [
        {
          id: 1,
          username: 'FellowSheep Gaming',
          title: 'Team Games Night - Age of Empires 2 DE',
          game: 'Age of Empires II: Definitive Edition',
          viewerCount: 156,
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2ZmMDAwMCIvPjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZlbGxvd1NoZWVwIExpdmU8L3RleHQ+PC9zdmc+',
          url: 'https://youtube.com/watch?v=live_stream',
          platform: 'youtube'
        }
      ];

      this.cache.set(cacheKey, {
        data: youtubeStreams,
        timestamp: Date.now()
      });
      
      return youtubeStreams;
    } catch (error) {
      console.error('Erro ao buscar streams do YouTube:', error);
      return [];
    }
  }

  // Buscar todos os streams ao vivo
  async getAllLiveStreams() {
    try {
      const [twitchStreams, youtubeStreams] = await Promise.all([
        this.getTwitchStreams(),
        this.getYouTubeStreams()
      ]);

      return [...twitchStreams, ...youtubeStreams];
    } catch (error) {
      console.error('Erro ao buscar todos os streams:', error);
      return [];
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