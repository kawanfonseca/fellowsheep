import axios from 'axios';

// Configuração da API base
const getApiBaseUrl = () => {
  // Usar variável de ambiente se disponível
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback baseado no ambiente
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  return 'https://fellowsheepapi.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

// Cliente axios configurado
const trackerApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout para operações de pull
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging em desenvolvimento
if (import.meta.env.DEV) {
  trackerApi.interceptors.request.use(
    (config) => {
      console.log(`🚀 [TrackerAPI] ${config.method?.toUpperCase()} ${config.url}`, config.params);
      return config;
    },
    (error) => {
      console.error('🚨 [TrackerAPI] Request Error:', error);
      return Promise.reject(error);
    }
  );

  trackerApi.interceptors.response.use(
    (response) => {
      console.log(`✅ [TrackerAPI] ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error('🚨 [TrackerAPI] Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

/**
 * Executa pull de matches para atualizar dados
 * @param {number} profileId - ID do perfil específico (opcional)
 * @param {number} since - Timestamp desde quando buscar (opcional)
 * @returns {Promise<Object>}
 */
export const pull = async (profileId = null, since = null) => {
  try {
    const params = {};
    if (profileId) params.profile_id = profileId;
    if (since) params.since = since;

    const response = await trackerApi.post('/api/tracker/pull', null, { params });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao executar pull: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Obtém volume de jogos por conta e consolidado
 * @param {Object} options - Opções de filtro
 * @param {string} options.ladder - Tipo de ladder (default: rm_1v1)
 * @param {number} options.from - Timestamp início
 * @param {number} options.to - Timestamp fim
 * @returns {Promise<Object>}
 */
export const getVolume = async (options = {}) => {
  try {
    const params = {
      ladder: options.ladder || 'rm_1v1',
      ...(options.from && { from: options.from }),
      ...(options.to && { to: options.to }),
    };

    const response = await trackerApi.get('/api/tracker/volume', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter volume: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Obtém métricas completas (summary)
 * @param {Object} options - Opções de filtro
 * @param {string} options.ladder - Tipo de ladder (default: rm_1v1)
 * @param {number} options.from - Timestamp início
 * @param {number} options.to - Timestamp fim
 * @param {boolean} options.includeDetails - Incluir detalhes do jogador
 * @returns {Promise<Object>}
 */
export const getSummary = async (options = {}) => {
  try {
    const params = {
      ladder: options.ladder || 'rm_1v1',
      includeDetails: options.includeDetails ? 'true' : 'false',
      ...(options.from && { from: options.from }),
      ...(options.to && { to: options.to }),
    };

    // Timeout mais longo para summary com detalhes
    const timeoutMs = options.includeDetails ? 15000 : 10000;
    
    const response = await trackerApi.get('/api/tracker/summary', { 
      params,
      timeout: timeoutMs
    });
    return response.data;
  } catch (error) {
    // Fallback: tentar sem detalhes se deu timeout com detalhes
    if (options.includeDetails && (error.code === 'ECONNABORTED' || error.message.includes('timeout'))) {
      console.warn('Timeout com detalhes, tentando sem detalhes...');
      try {
        const fallbackOptions = { ...options, includeDetails: false };
        const fallbackResponse = await getSummary(fallbackOptions);
        
        // Adicionar dados básicos dos jogadores
        if (fallbackResponse.data?.byAccount) {
          fallbackResponse.data.byAccount.forEach(account => {
            account.player = {
              nick: 'Unknown',
              country: 'unknown',
              ratingNow: null
            };
          });
        }
        
        return fallbackResponse;
      } catch (fallbackError) {
        throw new Error(`Erro ao obter summary (fallback): ${fallbackError.message}`);
      }
    }
    
    throw new Error(`Erro ao obter summary: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Obtém timeline de evolução do Elo
 * @param {Object} options - Opções de filtro
 * @param {string} options.granularity - day|week (default: day)
 * @param {number} options.days - Número de dias (default: 90)
 * @param {string} options.ladder - Tipo de ladder (default: rm_1v1)
 * @returns {Promise<Object>}
 */
export const getTimeline = async (options = {}) => {
  try {
    const params = {
      granularity: options.granularity || 'day',
      days: options.days || 90,
      ladder: options.ladder || 'rm_1v1',
    };

    const response = await trackerApi.get('/api/tracker/timeline', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter timeline: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Obtém ciclos de Elo (+100 pontos)
 * @param {Object} options - Opções de filtro
 * @param {string} options.ladder - Tipo de ladder (default: rm_1v1)
 * @returns {Promise<Object>}
 */
export const getCycles = async (options = {}) => {
  try {
    const params = {
      ladder: options.ladder || 'rm_1v1',
    };

    const response = await trackerApi.get('/api/tracker/cycles', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter cycles: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Verifica status da API
 * @returns {Promise<boolean>}
 */
export const checkApiStatus = async () => {
  try {
    const response = await trackerApi.get('/api');
    return response.status === 200;
  } catch (error) {
    console.warn('API não está disponível:', error.message);
    return false;
  }
};

/**
 * Utilitários para formatação de dados
 */
export const utils = {
  /**
   * Formata número com separadores de milhares
   * @param {number} num 
   * @returns {string}
   */
  formatNumber: (num) => {
    if (!Number.isFinite(num)) return 'N/A';
    return num.toLocaleString('pt-BR');
  },

  /**
   * Formata Elo com classe CSS baseada no valor
   * @param {number} elo 
   * @returns {Object}
   */
  formatElo: (elo) => {
    if (!Number.isFinite(elo)) return { value: 'N/A', className: 'elo-na' };
    
    let className = 'elo-bronze';
    if (elo >= 2000) className = 'elo-master';
    else if (elo >= 1800) className = 'elo-diamond';
    else if (elo >= 1600) className = 'elo-gold';
    else if (elo >= 1400) className = 'elo-silver';

    return { value: elo, className };
  },

  /**
   * Formata delta com sinal e classe CSS
   * @param {number} delta 
   * @returns {Object}
   */
  formatDelta: (delta) => {
    if (!Number.isFinite(delta)) return { value: 'N/A', className: 'delta-neutral' };
    
    const sign = delta >= 0 ? '+' : '';
    const className = delta >= 0 ? 'delta-positive' : 'delta-negative';
    
    return { value: `${sign}${delta}`, className };
  },

  /**
   * Formata data para exibição
   * @param {string} dateStr - String de data ISO
   * @returns {string}
   */
  formatDate: (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  },

  /**
   * Formata timestamp Unix para data/hora
   * @param {number} timestamp - Unix timestamp em segundos
   * @returns {string}
   */
  formatTimestamp: (timestamp) => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  },

  /**
   * Calcula tempo relativo (ex: "2 dias atrás")
   * @param {number} timestamp - Unix timestamp em segundos
   * @returns {string}
   */
  getRelativeTime: (timestamp) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const diff = now - timestamp;
      
      if (diff < 60) return 'Agora mesmo';
      if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} dias atrás`;
      if (diff < 2592000) return `${Math.floor(diff / 604800)} sem atrás`;
      
      return `${Math.floor(diff / 2592000)} meses atrás`;
    } catch (error) {
      return 'Tempo desconhecido';
    }
  },

  /**
   * Calcula porcentagem de vitórias
   * @param {number} wins 
   * @param {number} total 
   * @returns {string}
   */
  calculateWinrate: (wins, total) => {
    if (!Number.isFinite(wins) || !Number.isFinite(total) || total === 0) {
      return '0%';
    }
    const percentage = (wins / total) * 100;
    return `${percentage.toFixed(1)}%`;
  },

  /**
   * Obtém cor baseada no tipo de tilt
   * @param {string} tiltType 
   * @returns {string}
   */
  getTiltColor: (tiltType) => {
    switch (tiltType) {
      case 'loss_streak': return 'red';
      case 'elo_drop': return 'orange';
      default: return 'gray';
    }
  },

  /**
   * Obtém descrição amigável do tipo de tilt
   * @param {string} tiltType 
   * @returns {string}
   */
  getTiltDescription: (tiltType) => {
    switch (tiltType) {
      case 'loss_streak': return 'Sequência de derrotas';
      case 'elo_drop': return 'Queda de Elo';
      default: return 'Tilt detectado';
    }
  }
};

// Configurações padrão para diferentes cenários
export const presets = {
  // Última semana
  lastWeek: {
    from: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60),
    to: Math.floor(Date.now() / 1000)
  },
  
  // Último mês
  lastMonth: {
    from: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
    to: Math.floor(Date.now() / 1000)
  },
  
  // Últimos 3 meses
  last3Months: {
    from: Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60),
    to: Math.floor(Date.now() / 1000)
  }
};

export default {
  pull,
  getVolume,
  getSummary,
  getTimeline,
  getCycles,
  checkApiStatus,
  utils,
  presets
};
