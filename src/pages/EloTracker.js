import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import trackerApi from '../services/trackerApi';
import './EloTracker.css';

const EloTracker = () => {
  const { t } = useTranslation();
  
  // Estados principais
  const [loading, setLoading] = useState({
    pull: false,
    volume: false,
    summary: false,
    timeline: false,
    cycles: false
  });
  
  const [error, setError] = useState({});
  const [data, setData] = useState({
    volume: null,
    summary: null,
    timeline: null,
    cycles: null
  });

  // Estados de controle
  const [lastUpdate, setLastUpdate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [timelineGranularity, setTimelineGranularity] = useState('day');
  const [timelineDays, setTimelineDays] = useState(90);

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData();
  }, []);

  /**
   * Carrega todos os dados do tracker
   */
  const loadAllData = async () => {
    await Promise.all([
      loadVolume(),
      loadSummary(),
      loadTimeline(),
      loadCycles()
    ]);
  };

  /**
   * Executa pull de dados
   */
  const handlePull = async () => {
    setLoading(prev => ({ ...prev, pull: true }));
    setError(prev => ({ ...prev, pull: null }));

    try {
      const result = await trackerApi.pull();
      console.log('Pull resultado:', result);
      
      setLastUpdate(new Date());
      
      // Recarregar todos os dados após o pull
      await loadAllData();
      
      // Mostrar toast de sucesso (implementar se necessário)
      console.log('✅ Dados atualizados com sucesso!');
      
    } catch (err) {
      console.error('Erro no pull:', err);
      setError(prev => ({ ...prev, pull: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, pull: false }));
    }
  };

  /**
   * Carrega dados de volume
   */
  const loadVolume = async () => {
    setLoading(prev => ({ ...prev, volume: true }));
    setError(prev => ({ ...prev, volume: null }));

    try {
      const result = await trackerApi.getVolume();
      setData(prev => ({ ...prev, volume: result.data }));
    } catch (err) {
      console.error('Erro ao carregar volume:', err);
      setError(prev => ({ ...prev, volume: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, volume: false }));
    }
  };

  /**
   * Carrega dados de summary
   */
  const loadSummary = async () => {
    setLoading(prev => ({ ...prev, summary: true }));
    setError(prev => ({ ...prev, summary: null }));

    try {
      const result = await trackerApi.getSummary({ includeDetails: true });
      setData(prev => ({ ...prev, summary: result.data }));
    } catch (err) {
      console.error('Erro ao carregar summary:', err);
      setError(prev => ({ ...prev, summary: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  /**
   * Carrega dados de timeline
   */
  const loadTimeline = async () => {
    setLoading(prev => ({ ...prev, timeline: true }));
    setError(prev => ({ ...prev, timeline: null }));

    try {
      const result = await trackerApi.getTimeline({
        granularity: timelineGranularity,
        days: timelineDays
      });
      setData(prev => ({ ...prev, timeline: result.data }));
    } catch (err) {
      console.error('Erro ao carregar timeline:', err);
      setError(prev => ({ ...prev, timeline: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, timeline: false }));
    }
  };

  /**
   * Carrega dados de cycles
   */
  const loadCycles = async () => {
    setLoading(prev => ({ ...prev, cycles: true }));
    setError(prev => ({ ...prev, cycles: null }));

    try {
      const result = await trackerApi.getCycles();
      setData(prev => ({ ...prev, cycles: result.data }));
    } catch (err) {
      console.error('Erro ao carregar cycles:', err);
      setError(prev => ({ ...prev, cycles: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, cycles: false }));
    }
  };

  /**
   * Atualiza timeline quando parâmetros mudam
   */
  useEffect(() => {
    loadTimeline();
  }, [timelineGranularity, timelineDays]);

  /**
   * Função de ordenação para tabelas
   */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Ordena dados baseado na configuração atual
   */
  const getSortedData = (dataArray, defaultKey = 'profile_id') => {
    if (!Array.isArray(dataArray)) return [];
    
    const key = sortConfig.key || defaultKey;
    const direction = sortConfig.direction;
    
    return [...dataArray].sort((a, b) => {
      let aVal = getNestedValue(a, key);
      let bVal = getNestedValue(b, key);
      
      // Tratar valores nulos
      if (aVal === null || aVal === undefined) aVal = -Infinity;
      if (bVal === null || bVal === undefined) bVal = -Infinity;
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  /**
   * Obtém valor aninhado de um objeto (ex: "rollingAvg.g30")
   */
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  /**
   * Renderiza indicador de loading
   */
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>Carregando...</span>
    </div>
  );

  /**
   * Renderiza mensagem de erro
   */
  const ErrorMessage = ({ message }) => (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <span>{message}</span>
    </div>
  );

  /**
   * Renderiza cards de overview consolidado
   */
  const renderOverviewCards = () => {
    if (loading.volume || loading.summary) return <LoadingSpinner />;
    if (error.volume || error.summary) return <ErrorMessage message={error.volume || error.summary} />;
    if (!data.volume?.consolidated || !data.summary?.consolidated) return null;

    const volume = data.volume.consolidated;
    const summary = data.summary.consolidated;

    return (
      <div className="overview-cards">
        <div className="card volume-card">
          <h3>📊 Volume</h3>
          <div className="stats-grid">
            <div className="stat">
              <label>Esta Semana</label>
              <value>{trackerApi.utils.formatNumber(volume.week)}</value>
            </div>
            <div className="stat">
              <label>Este Mês</label>
              <value>{trackerApi.utils.formatNumber(volume.month)}</value>
            </div>
          </div>
        </div>

        <div className="card percentiles-card">
          <h3>🎯 Percentis</h3>
          <div className="stats-grid">
            <div className="stat">
              <label>P25 (Base)</label>
              <value className={trackerApi.utils.formatElo(summary.percentiles.p25).className}>
                {trackerApi.utils.formatElo(summary.percentiles.p25).value}
              </value>
            </div>
            <div className="stat">
              <label>P50 (Médio)</label>
              <value className={trackerApi.utils.formatElo(summary.percentiles.p50).className}>
                {trackerApi.utils.formatElo(summary.percentiles.p50).value}
              </value>
            </div>
            <div className="stat">
              <label>P75 (Alto)</label>
              <value className={trackerApi.utils.formatElo(summary.percentiles.p75).className}>
                {trackerApi.utils.formatElo(summary.percentiles.p75).value}
              </value>
            </div>
          </div>
        </div>

        <div className="card rolling-avg-card">
          <h3>📈 Médias Móveis</h3>
          <div className="stats-grid">
            <div className="stat">
              <label>g30</label>
              <value className={trackerApi.utils.formatElo(summary.rollingAvg.g30).className}>
                {trackerApi.utils.formatElo(summary.rollingAvg.g30).value}
              </value>
            </div>
            <div className="stat">
              <label>g50</label>
              <value className={trackerApi.utils.formatElo(summary.rollingAvg.g50).className}>
                {trackerApi.utils.formatElo(summary.rollingAvg.g50).value}
              </value>
            </div>
            <div className="stat">
              <label>g100</label>
              <value className={trackerApi.utils.formatElo(summary.rollingAvg.g100).className}>
                {trackerApi.utils.formatElo(summary.rollingAvg.g100).value}
              </value>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza tabela por conta
   */
  const renderAccountsTable = () => {
    if (loading.summary) return <LoadingSpinner />;
    if (error.summary) return <ErrorMessage message={error.summary} />;
    if (!data.summary?.byAccount) return null;

    const sortedAccounts = getSortedData(data.summary.byAccount, 'profile_id');

    return (
      <div className="accounts-table-container">
        <h3>👤 Por Conta</h3>
        <div className="table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('profile_id')} className="sortable">
                  ID {sortConfig.key === 'profile_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('player.nick')} className="sortable">
                  Nick {sortConfig.key === 'player.nick' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('volume.week')} className="sortable">
                  Semana {sortConfig.key === 'volume.week' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('volume.month')} className="sortable">
                  Mês {sortConfig.key === 'volume.month' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rollingAvg.g10')} className="sortable">
                  g10 {sortConfig.key === 'rollingAvg.g10' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rollingAvg.g30')} className="sortable">
                  g30 {sortConfig.key === 'rollingAvg.g30' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rollingAvg.g100')} className="sortable">
                  g100 {sortConfig.key === 'rollingAvg.g100' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('delta.g30')} className="sortable">
                  Δ30 {sortConfig.key === 'delta.g30' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Tilt</th>
              </tr>
            </thead>
            <tbody>
              {sortedAccounts.map((account) => {
                const recentTilt = account.tilt && account.tilt.length > 0 ? account.tilt[0] : null;
                
                return (
                  <tr key={account.profile_id}>
                    <td>{account.profile_id}</td>
                    <td className="nick-cell">
                      <span className="nick">{account.player?.nick || 'Unknown'}</span>
                      {account.player?.country && (
                        <span className="country">{account.player.country}</span>
                      )}
                    </td>
                    <td>{trackerApi.utils.formatNumber(account.volume.week)}</td>
                    <td>{trackerApi.utils.formatNumber(account.volume.month)}</td>
                    <td className={trackerApi.utils.formatElo(account.rollingAvg.g10).className}>
                      {trackerApi.utils.formatElo(account.rollingAvg.g10).value}
                    </td>
                    <td className={trackerApi.utils.formatElo(account.rollingAvg.g30).className}>
                      {trackerApi.utils.formatElo(account.rollingAvg.g30).value}
                    </td>
                    <td className={trackerApi.utils.formatElo(account.rollingAvg.g100).className}>
                      {trackerApi.utils.formatElo(account.rollingAvg.g100).value}
                    </td>
                    <td className={trackerApi.utils.formatDelta(account.delta.g30).className}>
                      {trackerApi.utils.formatDelta(account.delta.g30).value}
                    </td>
                    <td className="tilt-cell">
                      {recentTilt ? (
                        <span 
                          className={`tilt-indicator tilt-${trackerApi.utils.getTiltColor(recentTilt.type)}`}
                          title={`${trackerApi.utils.getTiltDescription(recentTilt.type)}: ${recentTilt.losses} derrotas, -${recentTilt.eloDrop} Elo`}
                        >
                          ⚠️
                        </span>
                      ) : (
                        <span className="no-tilt">✅</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /**
   * Renderiza gráfico de timeline (simples com canvas)
   */
  const renderTimeline = () => {
    if (loading.timeline) return <LoadingSpinner />;
    if (error.timeline) return <ErrorMessage message={error.timeline} />;
    if (!data.timeline || data.timeline.length === 0) {
      return <div className="no-data">Nenhum dado de timeline disponível</div>;
    }

    return (
      <div className="timeline-container">
        <div className="timeline-header">
          <h3>📊 Linha do Tempo - Últimos {timelineDays} dias</h3>
          <div className="timeline-controls">
            <select 
              value={timelineGranularity} 
              onChange={(e) => setTimelineGranularity(e.target.value)}
            >
              <option value="day">Por Dia</option>
              <option value="week">Por Semana</option>
            </select>
            <select 
              value={timelineDays} 
              onChange={(e) => setTimelineDays(Number(e.target.value))}
            >
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
              <option value={90}>90 dias</option>
              <option value={180}>180 dias</option>
            </select>
          </div>
        </div>
        
        <div className="timeline-chart">
          <SimpleChart data={data.timeline} />
        </div>
      </div>
    );
  };

  /**
   * Renderiza tabela de ciclos
   */
  const renderCycles = () => {
    if (loading.cycles) return <LoadingSpinner />;
    if (error.cycles) return <ErrorMessage message={error.cycles} />;
    if (!data.cycles || data.cycles.length === 0) {
      return <div className="no-data">Nenhum ciclo de Elo encontrado</div>;
    }

    return (
      <div className="cycles-container">
        <h3>🎯 Ciclos +100 Elo</h3>
        <div className="table-wrapper">
          <table className="cycles-table">
            <thead>
              <tr>
                <th>De</th>
                <th>Para</th>
                <th>Jogos</th>
                <th>Dias</th>
                <th>Jogos/Dia</th>
              </tr>
            </thead>
            <tbody>
              {data.cycles.map((cycle, index) => (
                <tr key={index}>
                  <td className="elo-from">{cycle.elo_from}</td>
                  <td className="elo-to">{cycle.elo_to}</td>
                  <td>{trackerApi.utils.formatNumber(cycle.games_in_cycle)}</td>
                  <td>{cycle.days_in_cycle}</td>
                  <td>{(cycle.games_in_cycle / cycle.days_in_cycle).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="elo-tracker">
      <div className="tracker-header">
        <div className="header-content">
          <h1>📊 Elo Tracker</h1>
          <div className="header-actions">
            {lastUpdate && (
              <span className="last-update">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </span>
            )}
            <button 
              className={`update-button ${loading.pull ? 'loading' : ''}`}
              onClick={handlePull}
              disabled={loading.pull}
            >
              {loading.pull ? '⏳ Atualizando...' : '🔄 Atualizar'}
            </button>
          </div>
        </div>
        {error.pull && <ErrorMessage message={error.pull} />}
      </div>

      <div className="tracker-content">
        {/* Overview Cards */}
        <section className="overview-section">
          <h2>📈 Visão Geral Consolidada</h2>
          {renderOverviewCards()}
        </section>

        {/* Accounts Table */}
        <section className="accounts-section">
          {renderAccountsTable()}
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          {renderTimeline()}
        </section>

        {/* Cycles */}
        <section className="cycles-section">
          {renderCycles()}
        </section>
      </div>
    </div>
  );
};

/**
 * Componente de gráfico simples usando canvas
 */
const SimpleChart = ({ data }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Configurações
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Encontrar min/max dos dados
    const eloValues = data.map(d => d.last_elo).filter(v => Number.isFinite(v));
    if (eloValues.length === 0) return;

    const minElo = Math.min(...eloValues);
    const maxElo = Math.max(...eloValues);
    const eloRange = maxElo - minElo || 100; // Evitar divisão por zero

    // Função para mapear coordenadas
    const mapX = (index) => padding + (index / (data.length - 1)) * chartWidth;
    const mapY = (elo) => padding + chartHeight - ((elo - minElo) / eloRange) * chartHeight;

    // Desenhar grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Grid horizontal
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Grid vertical
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i / 4) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Desenhar linha do gráfico
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let firstPoint = true;
    data.forEach((point, index) => {
      if (Number.isFinite(point.last_elo)) {
        const x = mapX(index);
        const y = mapY(point.last_elo);
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });

    ctx.stroke();

    // Desenhar pontos
    ctx.fillStyle = '#3498db';
    data.forEach((point, index) => {
      if (Number.isFinite(point.last_elo)) {
        const x = mapX(index);
        const y = mapY(point.last_elo);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Labels dos eixos
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Labels Y (Elo)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const elo = minElo + (i / 5) * eloRange;
      const y = padding + chartHeight - (i / 5) * chartHeight;
      ctx.fillText(Math.round(elo).toString(), padding - 10, y + 4);
    }

    // Labels X (Datas) - apenas algumas
    ctx.textAlign = 'center';
    const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];
    labelIndices.forEach(index => {
      if (index < data.length) {
        const x = mapX(index);
        const date = trackerApi.utils.formatDate(data[index].bucket);
        ctx.fillText(date, x, height - padding + 20);
      }
    });

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={300}
      className="timeline-canvas"
    />
  );
};

export default EloTracker;
