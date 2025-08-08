import axios from 'axios';
import fsClanIds from '../data/fsClanIds';
// Base sem "/api" para evitar duplicação ao montar rotas
const API_BASE_URL = 'https://fellowsheepapi.vercel.app';
const NIGHTBOT_BASE_URL = 'https://data.aoe2companion.com/api/nightbot/rank';

// Dados mockados para fallback
const MOCK_DATA = {
  leaderboards: [
    { id: 3, name: '1v1 Random Map' },
    { id: 4, name: '1v1 Empire Wars' },
    { id: 13, name: 'Team Random Map' },
    { id: 14, name: 'Team Empire Wars' }
  ],
  players: [
    // { profileId: 1, name: 'Fs.Kawan', rating: 1850, games: 245, wins: 198, profileName: 'Fs.Kawan' },
    // { profileId: 2, name: 'Fs.SheepKing', rating: 1820, games: 189, wins: 156, profileName: 'Fs.SheepKing' },
    // { profileId: 3, name: 'Fs.WoolWarrior', rating: 1780, games: 167, wins: 134, profileName: 'Fs.WoolWarrior' },
    // { profileId: 4, name: 'Fs.FlockCommander', rating: 1750, games: 145, wins: 112, profileName: 'Fs.FlockCommander' },
    // { profileId: 5, name: 'Fs.RamMaster', rating: 1720, games: 134, wins: 98, profileName: 'Fs.RamMaster' },
    // { profileId: 6, name: 'Fs.CastleBuilder', rating: 1680, games: 156, wins: 108, profileName: 'Fs.CastleBuilder' },
    // { profileId: 7, name: 'Fs.SiegeExpert', rating: 1650, games: 123, wins: 89, profileName: 'Fs.SiegeExpert' },
    // { profileId: 8, name: 'Fs.ArcherQueen', rating: 1620, games: 145, wins: 98, profileName: 'Fs.ArcherQueen' },
    // { profileId: 9, name: 'Fs.KnightRider', rating: 1590, games: 134, wins: 87, profileName: 'Fs.KnightRider' },
    // { profileId: 10, name: 'Fs.VillagerPro', rating: 1560, games: 112, wins: 76, profileName: 'Fs.VillagerPro' },
    // { profileId: 11, name: 'TheViper', rating: 1900, games: 300, wins: 245, profileName: 'TheViper' },
    // { profileId: 12, name: 'DauT', rating: 1880, games: 289, wins: 234, profileName: 'DauT' },
    // { profileId: 13, name: 'TaToH', rating: 1860, games: 267, wins: 212, profileName: 'TaToH' },
    // { profileId: 14, name: 'Liereyy', rating: 1840, games: 245, wins: 198, profileName: 'Liereyy' },
    // { profileId: 15, name: 'Hera', rating: 1820, games: 223, wins: 187, profileName: 'Hera' },
    // { profileId: 16, name: 'Yo', rating: 1800, games: 201, wins: 165, profileName: 'Yo' },
    // { profileId: 17, name: 'MbL', rating: 1780, games: 189, wins: 154, profileName: 'MbL' },
    // { profileId: 18, name: 'Villese', rating: 1760, games: 178, wins: 143, profileName: 'Villese' },
    // { profileId: 19, name: 'ACCM', rating: 1740, games: 167, wins: 132, profileName: 'ACCM' },
    // { profileId: 20, name: 'Nicov', rating: 1720, games: 156, wins: 121, profileName: 'Nicov' },
    // { profileId: 21, name: 'Fs.TowerRush', rating: 1530, games: 98, wins: 65, profileName: 'Fs.TowerRush' },
    // { profileId: 22, name: 'Fs.ScoutRush', rating: 1500, games: 87, wins: 54, profileName: 'Fs.ScoutRush' },
    // { profileId: 23, name: 'Fs.MonkRush', rating: 1470, games: 76, wins: 43, profileName: 'Fs.MonkRush' },
    // { profileId: 24, name: 'Fs.PaladinRush', rating: 1440, games: 65, wins: 32, profileName: 'Fs.PaladinRush' },
    // { profileId: 25, name: 'Fs.CamelRush', rating: 1410, games: 54, wins: 21, profileName: 'Fs.CamelRush' }
  ]
};

class AoeApiService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    this.backendAvailable = true; // Sempre assume backend disponível em produção
  }

  // Verificar se o cache ainda é válido
  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  // Simular delay de rede
  async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }

  // Buscar leaderboards disponíveis
  async getAvailableLeaderboards() {
    const cacheKey = 'available_leaderboards';
    console.log('DEBUG: getAvailableLeaderboards:start');
    
    if (this.isCacheValid(cacheKey)) {
      console.log('DEBUG: getAvailableLeaderboards:cache_hit');
      return this.cache.get(cacheKey).data;
    }
    // TODO: Remover mock
    console.log('DEBUG: getAvailableLeaderboards:using_mock');
    return MOCK_DATA.leaderboards;

    try {
      console.log('DEBUG: getAvailableLeaderboards:request', { url: `${API_BASE_URL}/leaderboard` });
      const response = await axios.get(`${API_BASE_URL}/leaderboard`);
      console.log('DEBUG: getAvailableLeaderboards:response', { status: response.status });
      const data = response.data;
      
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('DEBUG: getAvailableLeaderboards:error', error);
      // Fallback para dados mockados em caso de erro
      await this.simulateNetworkDelay();
      return MOCK_DATA.leaderboards;
    }
  }

  // Buscar ranking completo
  async getLeaderboard(leaderboardId = 3, start = 0, count = 1000) {
    const cacheKey = `leaderboard_${leaderboardId}_${start}_${count}`;
    console.log('DEBUG: getLeaderboard:start', { leaderboardId, start, count });
    
    if (this.isCacheValid(cacheKey)) {
      console.log('DEBUG: getLeaderboard:cache_hit', { cacheKey });
      return this.cache.get(cacheKey).data;
    }

    try {
      // Buscar do backend fellowsheepapi
      const endpointMap = {
        3: `${API_BASE_URL}/api/rankAll1v1`,   // 1v1 RM
        4: `${API_BASE_URL}/api/rankAllEw`,    // 1v1 EW
        13: `${API_BASE_URL}/api/rankAllTg`,   // TG RM
        14: `${API_BASE_URL}/api/rankAllTg`    // (fallback) TG EW não disponível
      };
      const url = endpointMap[leaderboardId] || endpointMap[3];
      console.log('DEBUG: getLeaderboard:request', { url });
      const response = await fetch(url);
      console.log('DEBUG: getLeaderboard:response', { ok: response.ok, status: response.status });
      const raw = await response.json();
      console.log('DEBUG: getLeaderboard:raw_type', { isArray: Array.isArray(raw), hasPlayers: Array.isArray(raw?.players), hasLeaderboard: Array.isArray(raw?.leaderboard) });

      // Garantir que seja um array
      const data = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.players)
          ? raw.players
          : Array.isArray(raw.leaderboard)
            ? raw.leaderboard
            : [];
      console.log('DEBUG: getLeaderboard:parsed', { length: data.length, sample: data[0] });

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('DEBUG: getLeaderboard:error', error);
      // Fallback para dados mockados em caso de erro
      await this.simulateNetworkDelay();
      let players = [...MOCK_DATA.players];
      
      // Adicionar variação baseada no leaderboard ID
      if (leaderboardId === 4) { // Empire Wars
        players = players.map(p => ({ ...p, rating: p.rating + Math.floor(Math.random() * 100) - 50 }));
      } else if (leaderboardId === 13) { // Team
        players = players.map(p => ({ ...p, rating: p.rating + Math.floor(Math.random() * 50) - 25 }));
      }
      
      // Ordenar por rating
      players.sort((a, b) => b.rating - a.rating);
      
      // Aplicar paginação
      const paginatedPlayers = players.slice(start, start + count);
      
      this.cache.set(cacheKey, {
        data: paginatedPlayers,
        timestamp: Date.now()
      });
      
      return paginatedPlayers;
    }
  }

  // Buscar estatísticas pessoais de jogadores
  async getPersonalStats(profileIds) {
    console.log('DEBUG: getPersonalStats:start', { profileIds });
    if (!profileIds || profileIds.length === 0) return [];
    
    const cacheKey = `personal_stats_${profileIds.join('_')}`;
    
    if (this.isCacheValid(cacheKey)) {
      console.log('DEBUG: getPersonalStats:cache_hit', { cacheKey });
      return this.cache.get(cacheKey).data;
    }

    try {
      // Backend não possui endpoint em lote; buscar em paralelo por jogador
      const buildUrl = (id) => `${API_BASE_URL}/api/player?profile_id=${encodeURIComponent(id)}`;
      const requests = profileIds.map(async (id) => {
        console.log('DEBUG: getPersonalStats:request', { id, url: buildUrl(id) });
        const resp = await fetch(buildUrl(id));
        console.log('DEBUG: getPersonalStats:response', { id, ok: resp.ok, status: resp.status });
        if (!resp.ok) return null;
        const data = await resp.json();
        return {
          profileId: id,
          name: data.nick,
          rating: data.rm1v1Stats?.rating || 0,
          games: (data.rm1v1Stats?.wins || 0) + (data.rm1v1Stats?.losses || 0),
          wins: data.rm1v1Stats?.wins || 0,
          losses: data.rm1v1Stats?.losses || 0,
          winRate: data.rm1v1Stats ? (((data.rm1v1Stats.wins || 0) / (((data.rm1v1Stats.wins || 0) + (data.rm1v1Stats.losses || 0)) || 1)) * 100).toFixed(1) : '0.0'
        };
      });

      const results = (await Promise.all(requests)).filter(Boolean);
      console.log('DEBUG: getPersonalStats:parsed', { length: results.length, sample: results[0] });

      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      });

      return results;
    } catch (error) {
      console.error('DEBUG: getPersonalStats:error', error);
      // Fallback para dados mockados em caso de erro
      await this.simulateNetworkDelay();
      const stats = profileIds.map(id => {
        const player = MOCK_DATA.players.find(p => p.profileId === id);
        return player ? {
          profileId: player.profileId,
          name: player.name,
          rating: player.rating,
          games: player.games,
          wins: player.wins,
          losses: player.games - player.wins,
          winRate: ((player.wins / player.games) * 100).toFixed(1)
        } : null;
      }).filter(Boolean);
      
      this.cache.set(cacheKey, {
        data: stats,
        timestamp: Date.now()
      });
      
      return stats;
    }
  }

  // Filtrar jogadores por "Fs." no nome
  filterFsPlayers(players) {
    if (!players || !Array.isArray(players)) return [];
    
    return players.filter(player => {
      const name = player.nickname;
      return name.toLowerCase().includes('fs.');
    });
  }

  // Buscar ranking do Clan baseado na lista fixa usando a API Nightbot do AOE2 Companion
  async getFsRanking(leaderboardId = 3) {
    const cacheKey = `fs_ranking_${leaderboardId}`;
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    // Utilizar o backend fellowsheepapi para obter o ranking do clã baseado na lista oficial
    const endpointMap = {
      3: `${API_BASE_URL}/api/rankFS1v1`, // 1v1 RM
      4: `${API_BASE_URL}/api/rankFSEw`,  // 1v1 EW
      13: `${API_BASE_URL}/api/rankFSTg`, // Team RM
      14: `${API_BASE_URL}/api/rankFSTg`  // (fallback) Team EW -> usar TG RM
    };

    const url = endpointMap[leaderboardId] || endpointMap[3];
    const resp = await fetch(url);
    const ranking = await resp.json();
    const fsPlayers = Array.isArray(ranking)
      ? ranking.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      : [];

    const data = {
      allPlayers: fsPlayers,
      fsPlayers,
      totalFsPlayers: fsPlayers.length,
      totalPlayers: fsPlayers.length
    };

    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  // Buscar jogador por nome
  async searchPlayerByName(searchTerm, leaderboardId = 3) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search/player?name=${encodeURIComponent(searchTerm)}&leaderboard_id=${leaderboardId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar jogador (usando fallback):', error);
      // Fallback para busca local
      const allPlayers = await this.getLeaderboard(leaderboardId, 0, 1000);
      const searchLower = searchTerm.toLowerCase();
      
      return allPlayers.filter(player => {
        const name = player.name || player.profileName || '';
        return name.toLowerCase().includes(searchLower);
      });
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
      if (now - value.timestamp >= this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }


}

export default new AoeApiService(); 
