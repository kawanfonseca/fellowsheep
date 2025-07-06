const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// URL base da API do Age of Empires 2 DE
const AOE_API_BASE = 'https://aoe-api.worldsedgelink.com/community';

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
      leaderboards: '/api/leaderboards',
      leaderboard: '/api/leaderboard/:id',
      player_stats: '/api/player/stats',
      search_player: '/api/search/player'
    }
  });
});

// Buscar leaderboards disponíveis
app.get('/api/leaderboards', async (req, res) => {
  try {
    console.log('🔍 Buscando leaderboards disponíveis...');
    const response = await axios.get(
      `${AOE_API_BASE}/leaderboard/getAvailableLeaderboards`,
      {
        params: {
          title: 'age2',
          platform: 'PC_STEAM'
        },
        timeout: 30000
      }
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
    let { start = 0, count = 1000, sort_by = 1 } = req.query;
    // Garantir que todos os parâmetros são válidos
    start = isNaN(parseInt(start)) ? 0 : parseInt(start);
    count = isNaN(parseInt(count)) ? 1000 : parseInt(count);
    const sortBy = isNaN(parseInt(sort_by)) ? 1 : parseInt(sort_by);
    if (!leaderboardId) {
      return res.status(400).json({ error: 'leaderboardId é obrigatório' });
    }
    console.log(`🔍 Buscando ranking ${leaderboardId}...`);
    const response = await axios.get(
      `${AOE_API_BASE}/leaderboard/getLeaderBoard2`,
      {
        params: {
          title: 'age2',
          leaderboard_id: leaderboardId,
          platform: 'PC_STEAM',
          start,
          count,
          sortBy
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
    // Buscar o ranking completo
    const response = await axios.get(
      `${AOE_API_BASE}/leaderboard/getLeaderBoard2`,
      {
        params: {
          title: 'age2',
          leaderboard_id: parseInt(leaderboard_id),
          platform: 'PC_STEAM',
          start: 0,
          count: 1000,
          sortBy: 1
        },
        timeout: 30000
      }
    );
    // Filtrar jogadores por nome
    const searchTerm = name.toLowerCase();
    const filteredPlayers = response.data.statGroups
      ? response.data.statGroups.flatMap(group => group.members)
        .filter(player => (player.alias || player.name || '').toLowerCase().includes(searchTerm))
      : [];
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
  console.log('='.repeat(50));
}); 