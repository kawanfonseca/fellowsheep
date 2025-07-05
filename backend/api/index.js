const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// URL base da API do Age of Empires 2 DE
const AOE_API_BASE = 'https://aoe-api.reliclink.com';

// Configurar CORS
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // React dev server
    'https://fellowsheep.vercel.app',  // Produção
    'https://fellowsheep-gaming.vercel.app'  // Alternativa
  ],
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'FellowSheep Gaming API Proxy',
    status: 'running',
    api_base: AOE_API_BASE,
    endpoints: {
      health: '/health',
      leaderboards: '/api/leaderboards',
      leaderboard: '/api/leaderboard/:id',
      player_stats: '/api/player/stats',
      search_player: '/api/search/player'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'fellowsheep-proxy',
    timestamp: new Date().toISOString()
  });
});

// Buscar leaderboards disponíveis
app.get('/api/leaderboards', async (req, res) => {
  try {
    console.log('🔍 Buscando leaderboards disponíveis...');
    
    const response = await axios.get(
      `${AOE_API_BASE}/community/leaderboard/getAvailableLeaderboards?title=age2`,
      { timeout: 30000 }
    );
    
    console.log('✅ Leaderboards carregados com sucesso');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Erro ao buscar leaderboards:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar leaderboards',
      message: error.message
    });
  }
});

// Buscar ranking específico
app.get('/api/leaderboard/:leaderboardId', async (req, res) => {
  try {
    const { leaderboardId } = req.params;
    const { start = 0, count = 1000, sort_by = 1 } = req.query;
    
    console.log(`🔍 Buscando ranking ${leaderboardId}...`);
    
    const response = await axios.get(
      `${AOE_API_BASE}/community/leaderboard/getLeaderboard2`,
      {
        params: {
          title: 'age2',
          leaderboard_id: leaderboardId,
          start: parseInt(start),
          count: parseInt(count),
          sortBy: parseInt(sort_by)
        },
        timeout: 30000
      }
    );
    
    console.log(`✅ Ranking ${leaderboardId} carregado com sucesso`);
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erro ao buscar ranking ${req.params.leaderboardId}:`, error.message);
    res.status(500).json({
      error: 'Erro ao buscar ranking',
      message: error.message
    });
  }
});

// Buscar estatísticas de jogadores
app.get('/api/player/stats', async (req, res) => {
  try {
    const { profile_ids } = req.query;
    
    if (!profile_ids) {
      return res.status(400).json({
        error: 'profile_ids é obrigatório'
      });
    }
    
    console.log(`🔍 Buscando estatísticas para jogadores: ${profile_ids}`);
    
    const response = await axios.get(
      `${AOE_API_BASE}/community/leaderboard/GetPersonalStat`,
      {
        params: {
          title: 'age2',
          profile_ids: `[${profile_ids}]`
        },
        timeout: 30000
      }
    );
    
    console.log('✅ Estatísticas de jogadores carregadas com sucesso');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas de jogadores:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
});

// Buscar jogador por nome
app.get('/api/search/player', async (req, res) => {
  try {
    const { name, leaderboard_id = 3 } = req.query;
    
    if (!name) {
      return res.status(400).json({
        error: 'name é obrigatório'
      });
    }
    
    console.log(`🔍 Buscando jogador: ${name} no ranking ${leaderboard_id}`);
    
    // Primeiro buscar o ranking completo
    const response = await axios.get(
      `${AOE_API_BASE}/community/leaderboard/getLeaderboard2`,
      {
        params: {
          title: 'age2',
          leaderboard_id: parseInt(leaderboard_id),
          start: 0,
          count: 1000,
          sortBy: 1
        },
        timeout: 30000
      }
    );
    
    // Filtrar jogadores por nome
    const searchTerm = name.toLowerCase();
    const filteredPlayers = response.data.filter(player => {
      const playerName = (player.name || player.profileName || '').toLowerCase();
      return playerName.includes(searchTerm);
    });
    
    console.log(`✅ Busca por '${name}' retornou ${filteredPlayers.length} resultados`);
    res.json(filteredPlayers);
  } catch (error) {
    console.error(`❌ Erro ao buscar jogador '${req.query.name}':`, error.message);
    res.status(500).json({
      error: 'Erro ao buscar jogador',
      message: error.message
    });
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Rota para 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 FellowSheep Gaming Backend Proxy');
  console.log('='.repeat(50));
  console.log(`📍 Host: 0.0.0.0`);
  console.log(`🔌 Porta: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
}); 