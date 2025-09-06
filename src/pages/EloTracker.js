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
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerHistory, setPlayerHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [progressGoals, setProgressGoals] = useState({ weekly: 100, monthly: 300 });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData();
    loadPlayers();
  }, []);

  // Carregar histórico quando jogador selecionado muda
  useEffect(() => {
    if (selectedPlayer) {
      loadPlayerHistory(selectedPlayer);
    } else {
      setPlayerHistory(null);
    }
  }, [selectedPlayer]);

  /**
   * Carrega lista de players disponíveis
   */
  const loadPlayers = async () => {
    try {
      // Como não temos endpoint específico, vamos usar os dados do summary
      const result = await trackerApi.getSummary({ includeDetails: true });
      const playerList = result.data.byAccount.map(account => ({
        id: account.profile_id,
        nick: account.player?.nick || `Player ${account.profile_id}`,
        steam: account.player?.steam || null,
        country: account.player?.country || 'unknown'
      }));
      setPlayers(playerList);
    } catch (err) {
      console.error('Erro ao carregar lista de players:', err);
      setPlayers([]);
    }
  };

  /**
   * Carrega histórico detalhado de um jogador específico
   */
  const loadPlayerHistory = async (profileId) => {
    setLoadingHistory(true);
    setErrorHistory(null);

    try {
      const result = await trackerApi.getPlayerHistory(profileId, {
        sort: 'asc' // Mais antigo primeiro para análise de progresso
      });
      setPlayerHistory(result.data);
    } catch (err) {
      console.error('Erro ao carregar histórico do jogador:', err);
      setErrorHistory(err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

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

    let volume, summary;

    if (selectedPlayer && data.volume?.byAccount && data.summary?.byAccount) {
      // Dados específicos do jogador selecionado
      const playerVolume = data.volume.byAccount.find(acc => acc.profile_id === selectedPlayer);
      const playerSummary = data.summary.byAccount.find(acc => acc.profile_id === selectedPlayer);

      if (!playerVolume || !playerSummary) return <div className="no-data">Dados do jogador não encontrados</div>;

      volume = {
        week: playerVolume.week,
        month: playerVolume.month
      };
      summary = playerSummary;
    } else {
      // Dados consolidados
      if (!data.volume?.consolidated || !data.summary?.consolidated) return null;
      volume = data.volume.consolidated;
      summary = data.summary.consolidated;
    }

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
   * Renderiza análise de progresso detalhada
   */
  const renderProgressAnalysis = () => {
    if (loadingHistory) return <LoadingSpinner />;
    if (errorHistory) return <ErrorMessage message={errorHistory} />;
    if (!playerHistory) return <div className="no-data">Carregando análise de progresso...</div>;

    const progress = playerHistory.progress;
    if (!progress) return <div className="no-data">Dados de progresso não disponíveis</div>;

    return (
      <div className="progress-analysis">
        <div className="progress-periods">
          <div className="progress-card">
            <h3>📅 Última Semana</h3>
            <div className="progress-stats">
              <div className="stat">
                <label>Jogos</label>
                <value>{progress.lastWeek.games}</value>
              </div>
              <div className="stat">
                <label>Progresso Elo</label>
                <value className={trackerApi.utils.formatDelta(progress.lastWeek.elo_change).className}>
                  {trackerApi.utils.formatDelta(progress.lastWeek.elo_change).value}
                </value>
              </div>
              <div className="stat">
                <label>Win Rate</label>
                <value>{progress.lastWeek.win_rate}%</value>
              </div>
              <div className="stat">
                <label>Elo Médio</label>
                <value className={trackerApi.utils.formatElo(progress.lastWeek.avg_elo).className}>
                  {trackerApi.utils.formatElo(progress.lastWeek.avg_elo).value}
                </value>
              </div>
              <div className="stat">
                <label>Elo/Jogo</label>
                <value className={trackerApi.utils.formatDelta(progress.lastWeek.elo_per_game).className}>
                  {trackerApi.utils.formatDelta(progress.lastWeek.elo_per_game).value}
                </value>
              </div>
              <div className="stat">
                <label>Jogos/Dia</label>
                <value>{progress.lastWeek.games_per_day}</value>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <h3>📆 Último Mês</h3>
            <div className="progress-stats">
              <div className="stat">
                <label>Jogos</label>
                <value>{progress.lastMonth.games}</value>
              </div>
              <div className="stat">
                <label>Progresso Elo</label>
                <value className={trackerApi.utils.formatDelta(progress.lastMonth.elo_change).className}>
                  {trackerApi.utils.formatDelta(progress.lastMonth.elo_change).value}
                </value>
              </div>
              <div className="stat">
                <label>Win Rate</label>
                <value>{progress.lastMonth.win_rate}%</value>
              </div>
              <div className="stat">
                <label>Elo Médio</label>
                <value className={trackerApi.utils.formatElo(progress.lastMonth.avg_elo).className}>
                  {trackerApi.utils.formatElo(progress.lastMonth.avg_elo).value}
                </value>
              </div>
              <div className="stat">
                <label>Elo/Jogo</label>
                <value className={trackerApi.utils.formatDelta(progress.lastMonth.elo_per_game).className}>
                  {trackerApi.utils.formatDelta(progress.lastMonth.elo_per_game).value}
                </value>
              </div>
              <div className="stat">
                <label>Jogos/Dia</label>
                <value>{progress.lastMonth.games_per_day}</value>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <h3>📊 Último Trimestre</h3>
            <div className="progress-stats">
              <div className="stat">
                <label>Jogos</label>
                <value>{progress.lastQuarter.games}</value>
              </div>
              <div className="stat">
                <label>Progresso Elo</label>
                <value className={trackerApi.utils.formatDelta(progress.lastQuarter.elo_change).className}>
                  {trackerApi.utils.formatDelta(progress.lastQuarter.elo_change).value}
                </value>
              </div>
              <div className="stat">
                <label>Win Rate</label>
                <value>{progress.lastQuarter.win_rate}%</value>
              </div>
              <div className="stat">
                <label>Elo Médio</label>
                <value className={trackerApi.utils.formatElo(progress.lastQuarter.avg_elo).className}>
                  {trackerApi.utils.formatElo(progress.lastQuarter.avg_elo).value}
                </value>
              </div>
              <div className="stat">
                <label>Elo/Jogo</label>
                <value className={trackerApi.utils.formatDelta(progress.lastQuarter.elo_per_game).className}>
                  {trackerApi.utils.formatDelta(progress.lastQuarter.elo_per_game).value}
                </value>
              </div>
              <div className="stat">
                <label>Jogos/Dia</label>
                <value>{progress.lastQuarter.games_per_day}</value>
              </div>
            </div>
          </div>

          <div className="progress-card overall">
            <h3>🏆 Geral</h3>
            <div className="progress-stats">
              <div className="stat">
                <label>Total de Jogos</label>
                <value>{progress.overall.games}</value>
              </div>
              <div className="stat">
                <label>Progresso Total</label>
                <value className={trackerApi.utils.formatDelta(progress.overall.elo_change).className}>
                  {trackerApi.utils.formatDelta(progress.overall.elo_change).value}
                </value>
              </div>
              <div className="stat">
                <label>Win Rate Geral</label>
                <value>{progress.overall.win_rate}%</value>
              </div>
              <div className="stat">
                <label>Elo Atual</label>
                <value className={trackerApi.utils.formatElo(progress.overall.end_elo).className}>
                  {trackerApi.utils.formatElo(progress.overall.end_elo).value}
                </value>
              </div>
              <div className="stat">
                <label>Elo/Jogo</label>
                <value className={trackerApi.utils.formatDelta(progress.overall.elo_per_game).className}>
                  {trackerApi.utils.formatDelta(progress.overall.elo_per_game).value}
                </value>
              </div>
              <div className="stat">
                <label>Jogos/Dia</label>
                <value>{progress.overall.games_per_day}</value>
              </div>
            </div>
          </div>
        </div>

        <div className="progress-insights">
          <h3>💡 Insights de Progresso</h3>
          <div className="insights-list">
            {generateProgressInsights(progress)}
          </div>
        </div>

        {/* Volume vs Progress Correlation */}
        {playerHistory.volume_progress_correlation && (
          <div className="correlation-analysis">
            <h3>📈 Análise: Volume vs Progresso</h3>
            {renderVolumeProgressCorrelation(playerHistory.volume_progress_correlation)}
          </div>
        )}

        {/* Game Patterns Analysis */}
        {playerHistory.game_patterns && (
          <div className="game-patterns-analysis">
            <h3>🎯 Padrões de Jogo</h3>
            {renderGamePatternsAnalysis(playerHistory.game_patterns)}
          </div>
        )}
      </div>
    );
  };

  /**
   * Gera insights baseados nos dados de progresso
   */
  const generateProgressInsights = (progress) => {
    const insights = [];

    // Análise de volume vs progresso
    const weekGames = progress.lastWeek.games;
    const weekProgress = progress.lastWeek.elo_change;
    const monthGames = progress.lastMonth.games;
    const monthProgress = progress.lastMonth.elo_change;

    if (weekGames > 0 && monthGames > 0) {
      const weekEfficiency = weekProgress / weekGames;
      const monthEfficiency = monthProgress / monthGames;

      if (weekEfficiency > monthEfficiency * 1.5) {
        insights.push({
          type: 'positive',
          icon: '📈',
          message: `Você está progredindo ${Math.round(weekEfficiency/monthEfficiency * 100 - 100)}% mais eficiente esta semana!`
        });
      } else if (weekEfficiency < monthEfficiency * 0.7) {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          message: `Seu progresso semanal está abaixo da média mensal. Considere ajustar sua estratégia.`
        });
      }
    }

    // Análise de volume
    if (weekGames < 5) {
      insights.push({
        type: 'info',
        icon: '🎯',
        message: `Poucos jogos na semana (${weekGames}). Para melhor análise, considere jogar mais regularmente.`
      });
    } else if (weekGames > 20) {
      insights.push({
        type: 'positive',
        icon: '🔥',
        message: `Excelente volume semanal (${weekGames} jogos)! Você está muito ativo.`
      });
    }

    // Análise de win rate
    const weekWinRate = progress.lastWeek.win_rate;
    if (weekWinRate > 60) {
      insights.push({
        type: 'positive',
        icon: '👑',
        message: `Win rate excelente esta semana (${weekWinRate}%)! Continue assim!`
      });
    } else if (weekWinRate < 45) {
      insights.push({
        type: 'warning',
        icon: '📉',
        message: `Win rate abaixo do ideal (${weekWinRate}%). Foque em melhorar sua performance.`
      });
    }

    // Análise de progresso consistente
    if (progress.lastWeek.elo_change > 0 && progress.lastMonth.elo_change > 0 && progress.lastQuarter.elo_change > 0) {
      insights.push({
        type: 'positive',
        icon: '📊',
        message: `Progresso consistente em todos os períodos! Você está no caminho certo.`
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        icon: '📝',
        message: 'Continue jogando regularmente para gerar mais insights sobre seu progresso.'
      });
    }

    return insights.map((insight, index) => (
      <div key={index} className={`insight-item insight-${insight.type}`}>
        <span className="insight-icon">{insight.icon}</span>
        <span className="insight-message">{insight.message}</span>
      </div>
    ));
  };

  /**
   * Renderiza análise de correlação volume vs progresso
   */
  const renderVolumeProgressCorrelation = (correlation) => {
    if (!correlation || !correlation.correlation_coefficient) {
      return (
        <div className="correlation-insight">
          <div className="correlation-summary">
            <p>{correlation.analysis}</p>
            <p><strong>Recomendação:</strong> {correlation.recommendation}</p>
          </div>
        </div>
      );
    }

    const getCorrelationColor = (coeff) => {
      if (coeff > 0.5) return '#28a745';
      if (coeff > 0.2) return '#17a2b8';
      if (coeff > -0.2) return '#ffc107';
      if (coeff > -0.5) return '#fd7e14';
      return '#dc3545';
    };

    const getCorrelationStrength = (coeff) => {
      const abs = Math.abs(coeff);
      if (abs > 0.7) return 'Forte';
      if (abs > 0.5) return 'Moderada';
      if (abs > 0.3) return 'Fraca';
      return 'Muito Fraca';
    };

    return (
      <div className="correlation-analysis-content">
        <div className="correlation-summary">
          <div className="correlation-metric">
            <span className="metric-label">Coeficiente de Correlação:</span>
            <span
              className="metric-value"
              style={{ color: getCorrelationColor(correlation.correlation_coefficient) }}
            >
              {correlation.correlation_coefficient}
            </span>
            <span className="metric-strength">
              ({getCorrelationStrength(correlation.correlation_coefficient)})
            </span>
          </div>
          <p className="correlation-analysis-text">{correlation.analysis}</p>
          <div className="correlation-recommendation">
            <strong>💡 Recomendação:</strong> {correlation.recommendation}
          </div>
        </div>

        <div className="efficiency-brackets">
          <h4>Eficiência por Volume de Jogos</h4>
          <div className="brackets-grid">
            {correlation.efficiency_brackets.map((bracket, index) => (
              <div key={index} className="bracket-card">
                <h5>{bracket.bracket}</h5>
                <div className="bracket-stats">
                  <div className="bracket-stat">
                    <label>Média de Jogos:</label>
                    <value>{bracket.avg_games}</value>
                  </div>
                  <div className="bracket-stat">
                    <label>Elo/Jogo:</label>
                    <value className={trackerApi.utils.formatDelta(bracket.avg_efficiency).className}>
                      {trackerApi.utils.formatDelta(bracket.avg_efficiency).value}
                    </value>
                  </div>
                  <div className="bracket-stat">
                    <label>Win Rate:</label>
                    <value>{bracket.avg_win_rate}%</value>
                  </div>
                  <div className="bracket-stat">
                    <label>Sample:</label>
                    <value>{bracket.sample_size} semanas</value>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="correlation-meta">
          <small>
            Análise baseada em {correlation.total_weeks_analyzed} semanas de dados
          </small>
        </div>
      </div>
    );
  };

  /**
   * Renderiza análise de padrões de jogo
   */
  const renderGamePatternsAnalysis = (patterns) => {
    if (!patterns) return null;

    return (
      <div className="game-patterns-content">
        {/* Resumo dos padrões */}
        <div className="patterns-summary">
          <div className="pattern-card">
            <h4>📅 Dia Principal</h4>
            <div className="pattern-value">{patterns.peak_day}</div>
            <small>Dia com mais jogos</small>
          </div>

          <div className="pattern-card">
            <h4>🕐 Horário Principal</h4>
            <div className="pattern-value">{patterns.peak_hour}:00</div>
            <small>Horário com mais jogos</small>
          </div>

          <div className="pattern-card">
            <h4>📊 Consistência</h4>
            <div className="pattern-value">{patterns.consistency_score}%</div>
            <small>Distribuição semanal</small>
          </div>
        </div>

        {/* Distribuição por dia da semana */}
        <div className="weekday-distribution">
          <h4>Distribuição por Dia da Semana</h4>
          <div className="weekday-grid">
            {Object.entries(patterns.weekday_distribution).map(([day, stats]) => (
              <div key={day} className="weekday-item">
                <div className="weekday-name">{day.slice(0, 3)}</div>
                <div className="weekday-stats">
                  <div className="weekday-games">{stats.games} jogos</div>
                  <div className="weekday-winrate">{stats.win_rate}% WR</div>
                  <div className={`weekday-elo ${stats.avg_elo_change >= 0 ? 'positive' : 'negative'}`}>
                    {trackerApi.utils.formatDelta(stats.avg_elo_change).value}/jogo
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights dos padrões */}
        {patterns.insights && patterns.insights.length > 0 && (
          <div className="pattern-insights">
            <h4>💡 Insights dos Padrões</h4>
            <div className="insights-list">
              {patterns.insights.map((insight, index) => (
                <div key={index} className={`insight-item insight-${insight.type}`}>
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-message">{insight.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renderiza metas de progresso
   */
  const renderProgressGoals = () => {
    if (!playerHistory) return null;

    const currentPeriodData = getCurrentPeriodData();
    const weeklyProgress = currentPeriodData.games > 0 ? currentPeriodData.elo_change : 0;
    const weeklyGoal = progressGoals.weekly;
    const weeklyPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

    return (
      <div className="goals-container">
        <div className="goal-item">
          <div className="goal-header">
            <span>Meta Semanal: {weeklyGoal} Elo</span>
            <span className="goal-progress">{weeklyProgress}/{weeklyGoal}</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${weeklyProgress >= weeklyGoal ? 'completed' : weeklyProgress >= weeklyGoal * 0.8 ? 'good' : 'normal'}`}
              style={{ width: `${weeklyPercent}%` }}
            ></div>
          </div>
          <div className="goal-status">
            {weeklyProgress >= weeklyGoal ? '🎉 Meta atingida!' :
             weeklyPercent >= 80 ? '🔥 Quase lá!' :
             '📈 Continue jogando!'}
          </div>
        </div>

        <div className="goal-settings">
          <h4>⚙️ Ajustar Metas</h4>
          <div className="goal-inputs">
            <div className="goal-input">
              <label>Semanal:</label>
              <input
                type="number"
                value={progressGoals.weekly}
                onChange={(e) => setProgressGoals(prev => ({ ...prev, weekly: Number(e.target.value) }))}
                min="0"
                max="1000"
              />
            </div>
            <div className="goal-input">
              <label>Mensal:</label>
              <input
                type="number"
                value={progressGoals.monthly}
                onChange={(e) => setProgressGoals(prev => ({ ...prev, monthly: Number(e.target.value) }))}
                min="0"
                max="2000"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza análise avançada
   */
  const renderAdvancedAnalysis = () => {
    if (!playerHistory || !playerHistory.matches) return null;

    const matches = playerHistory.matches.slice(0, 100); // Últimos 100 jogos
    const performanceByDay = analyzePerformanceByDay(matches);
    const winStreaks = analyzeWinStreaks(matches);
    const bestPerformingDays = Object.entries(performanceByDay)
      .sort(([,a], [,b]) => b.avgEloChange - a.avgEloChange)
      .slice(0, 3);

    return (
      <div className="advanced-analysis-content">
        <div className="performance-by-day">
          <h4>🏆 Dias de Melhor Performance</h4>
          <div className="performance-grid">
            {bestPerformingDays.map(([day, stats]) => (
              <div key={day} className="performance-card">
                <div className="day-name">{getPortugueseDayName(day)}</div>
                <div className="day-stats">
                  <div className="stat">
                    <span className="label">Elo/Jogo:</span>
                    <span className={stats.avgEloChange >= 0 ? 'positive' : 'negative'}>
                      {stats.avgEloChange > 0 ? '+' : ''}{stats.avgEloChange}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Win Rate:</span>
                    <span>{stats.winRate}%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Jogos:</span>
                    <span>{stats.games}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="win-streaks">
          <h4>🔥 Sequências de Vitórias</h4>
          <div className="streaks-list">
            {winStreaks.slice(0, 5).map((streak, index) => (
              <div key={index} className="streak-item">
                <div className="streak-info">
                  <span className="streak-length">{streak.length} vitórias</span>
                  <span className="streak-elo">+{streak.eloGain} Elo</span>
                </div>
                <div className="streak-period">
                  {new Date(streak.start * 1000).toLocaleDateString('pt-BR')} - {new Date(streak.end * 1000).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations">
          <h4>💡 Recomendações Personalizadas</h4>
          <div className="recommendations-list">
            {generatePersonalizedRecommendations()}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Obtém dados do período selecionado
   */
  const getCurrentPeriodData = () => {
    if (!playerHistory || !playerHistory.progress) return { games: 0, elo_change: 0 };

    switch (selectedPeriod) {
      case 'week': return playerHistory.progress.lastWeek;
      case 'month': return playerHistory.progress.lastMonth;
      case 'quarter': return playerHistory.progress.lastQuarter;
      case 'all': return playerHistory.progress.overall;
      default: return playerHistory.progress.lastMonth;
    }
  };

  /**
   * Analisa performance por dia da semana
   */
  const analyzePerformanceByDay = (matches) => {
    const dayStats = {};

    matches.forEach(match => {
      const date = new Date(match.ended_at * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (!dayStats[dayName]) {
        dayStats[dayName] = { games: 0, wins: 0, eloChange: 0 };
      }

      dayStats[dayName].games++;
      if (match.won === true) dayStats[dayName].wins++;
      if (match.rating_before && match.rating_after) {
        dayStats[dayName].eloChange += match.rating_after - match.rating_before;
      }
    });

    // Calcular médias
    Object.keys(dayStats).forEach(day => {
      const stats = dayStats[day];
      dayStats[day] = {
        games: stats.games,
        winRate: stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0,
        avgEloChange: stats.games > 0 ? Math.round(stats.eloChange / stats.games) : 0
      };
    });

    return dayStats;
  };

  /**
   * Analisa sequências de vitórias
   */
  const analyzeWinStreaks = (matches) => {
    const streaks = [];
    let currentStreak = null;

    matches.forEach(match => {
      if (match.won === true) {
        if (!currentStreak) {
          currentStreak = {
            length: 1,
            start: match.ended_at,
            end: match.ended_at,
            eloGain: match.rating_after - match.rating_before
          };
        } else {
          currentStreak.length++;
          currentStreak.end = match.ended_at;
          if (match.rating_before && match.rating_after) {
            currentStreak.eloGain += match.rating_after - match.rating_before;
          }
        }
      } else {
        if (currentStreak && currentStreak.length >= 3) {
          streaks.push(currentStreak);
        }
        currentStreak = null;
      }
    });

    // Adicionar última sequência se existir
    if (currentStreak && currentStreak.length >= 3) {
      streaks.push(currentStreak);
    }

    return streaks.sort((a, b) => b.length - a.length);
  };

  /**
   * Gera recomendações personalizadas
   */
  const generatePersonalizedRecommendations = () => {
    if (!playerHistory || !playerHistory.progress) return [];

    const recommendations = [];
    const weekly = playerHistory.progress.lastWeek;
    const monthly = playerHistory.progress.lastMonth;

    // Recomendação baseada no volume
    if (weekly.games < 10) {
      recommendations.push({
        icon: '🎯',
        title: 'Aumente o Volume',
        description: 'Jogue mais jogos por semana para acelerar seu progresso.',
        priority: 'high'
      });
    }

    // Recomendação baseada na eficiência
    if (weekly.games > 15 && weekly.elo_per_game < 5) {
      recommendations.push({
        icon: '🎯',
        title: 'Melhore a Qualidade',
        description: 'Foque em jogos de melhor qualidade ao invés de quantidade.',
        priority: 'high'
      });
    }

    // Recomendação baseada no win rate
    if (weekly.win_rate < 45) {
      recommendations.push({
        icon: '📈',
        title: 'Trabalhe o Win Rate',
        description: 'Seu win rate está baixo. Considere revisar estratégias.',
        priority: 'medium'
      });
    }

    // Recomendação baseada na consistência
    if (weekly.elo_change < 0 && monthly.elo_change > 0) {
      recommendations.push({
        icon: '📊',
        title: 'Seja Mais Consistente',
        description: 'Você progride no mês mas perde na semana. Mantenha o ritmo.',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  /**
   * Converte nome do dia para português
   */
  const getPortugueseDayName = (englishDay) => {
    const dayMap = {
      'Monday': 'Segunda',
      'Tuesday': 'Terça',
      'Wednesday': 'Quarta',
      'Thursday': 'Quinta',
      'Friday': 'Sexta',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };
    return dayMap[englishDay] || englishDay;
  };

  /**
   * Renderiza tabela por conta
   */
  const renderAccountsTable = () => {
    if (loading.summary) return <LoadingSpinner />;
    if (error.summary) return <ErrorMessage message={error.summary} />;
    if (!data.summary?.byAccount) return null;

    let accountsToShow = data.summary.byAccount;

    // Filtrar por jogador selecionado se aplicável
    if (selectedPlayer) {
      accountsToShow = accountsToShow.filter(account => account.profile_id === selectedPlayer);
      if (accountsToShow.length === 0) {
        return <div className="no-data">Jogador não encontrado nos dados</div>;
      }
    }

    const sortedAccounts = getSortedData(accountsToShow, 'profile_id');

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

    // Se um jogador estiver selecionado, mostrar timeline específica ou mensagem
    if (selectedPlayer) {
      return (
        <div className="timeline-container">
          <div className="timeline-header">
            <h3>📊 Timeline Individual - {players.find(p => p.id === selectedPlayer)?.nick || `Player ${selectedPlayer}`}</h3>
            <p className="timeline-note">
              Para visualizar a timeline individual, use os dados do histórico do jogador selecionado.
            </p>
          </div>

          {playerHistory && playerHistory.matches && playerHistory.matches.length > 0 && (
            <div className="timeline-chart">
              <PlayerHistoryChart
                matches={playerHistory.matches}
                granularity={timelineGranularity}
                days={timelineDays}
              />
            </div>
          )}
        </div>
      );
    }

    // Timeline consolidada (comportamento original)
    return (
      <div className="timeline-container">
        <div className="timeline-header">
          <h3>📊 Linha do Tempo Consolidada - Últimos {timelineDays} dias</h3>
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
   * Componente de gráfico para histórico individual do jogador
   */
  const PlayerHistoryChart = ({ matches, granularity, days }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
      if (!matches || matches.length === 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;

      // Limpar canvas
      ctx.clearRect(0, 0, width, height);

      // Filtrar dados por período
      const now = Math.floor(Date.now() / 1000);
      const fromTs = now - (days * 24 * 60 * 60);
      const filteredMatches = matches.filter(m => m.ended_at >= fromTs);

      if (filteredMatches.length === 0) return;

      // Agrupar por período
      const groupedData = {};
      const bucketSize = granularity === 'day' ? 24 * 60 * 60 : 7 * 24 * 60 * 60;

      filteredMatches.forEach(match => {
        const bucketStart = Math.floor(match.ended_at / bucketSize) * bucketSize;
        if (!groupedData[bucketStart]) {
          groupedData[bucketStart] = [];
        }
        groupedData[bucketStart].push(match);
      });

      // Calcular médias por bucket
      const timelineData = Object.entries(groupedData)
        .map(([bucketTs, bucketMatches]) => {
          const avgElo = bucketMatches.reduce((sum, m) => sum + (m.rating_after || 0), 0) / bucketMatches.length;
          return {
            bucket: new Date(parseInt(bucketTs) * 1000).toISOString().split('T')[0],
            avg_elo: Math.round(avgElo),
            last_elo: bucketMatches[bucketMatches.length - 1].rating_after,
            games: bucketMatches.length
          };
        })
        .sort((a, b) => a.bucket.localeCompare(b.bucket));

      // Configurações do gráfico
      const padding = 40;
      const chartWidth = width - 2 * padding;
      const chartHeight = height - 2 * padding;

      // Encontrar min/max dos dados
      const eloValues = timelineData.map(d => d.last_elo).filter(v => Number.isFinite(v));
      if (eloValues.length === 0) return;

      const minElo = Math.min(...eloValues);
      const maxElo = Math.max(...eloValues);
      const eloRange = maxElo - minElo || 100;

      // Função para mapear coordenadas
      const mapX = (index) => padding + (index / (timelineData.length - 1)) * chartWidth;
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
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      timelineData.forEach((point, index) => {
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
      timelineData.forEach((point, index) => {
        if (Number.isFinite(point.last_elo)) {
          const x = mapX(index);
          const y = mapY(point.last_elo);

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();

          // Tooltip básico
          ctx.fillStyle = '#2c3e50';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(point.games.toString(), x, y - 8);
        }
      });

      // Labels dos eixos
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';

      // Labels Y (Elo)
      ctx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const elo = minElo + (i / 5) * eloRange;
        const y = padding + chartHeight - (i / 5) * chartHeight;
        ctx.fillText(Math.round(elo).toString(), padding - 10, y + 4);
      }

      // Labels X (Datas) - apenas algumas
      ctx.textAlign = 'center';
      const labelIndices = [0, Math.floor(timelineData.length / 2), timelineData.length - 1];
      labelIndices.forEach(index => {
        if (index < timelineData.length) {
          const x = mapX(index);
          const date = trackerApi.utils.formatDate(timelineData[index].bucket);
          ctx.fillText(date, x, height - padding + 20);
        }
      });

    }, [matches, granularity, days]);

    return (
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="timeline-canvas"
      />
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
      {/* Banner de versão atualizada */}
      <div className="version-banner">
        🎉 Versão Melhorada! Análise individual de jogadores disponível!
      </div>

      <div className="tracker-header">
        <div className="header-content">
          <h1>🚀 ELO TRACKER PRO v2.0 - MELHORADO!</h1>
          <div className="header-actions">
            <div className="player-selector">
              <label htmlFor="player-select">👤 Jogador: <span className="new-feature">NOVO!</span></label>
              <select
                id="player-select"
                value={selectedPlayer || ''}
                onChange={(e) => setSelectedPlayer(e.target.value ? Number(e.target.value) : null)}
                className="player-dropdown"
              >
                <option value="">Todos os jogadores</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.nick} (ID: {player.id})
                  </option>
                ))}
              </select>
            </div>
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
          <h2>
            📈 {selectedPlayer ? `Dados de ${players.find(p => p.id === selectedPlayer)?.nick || `Player ${selectedPlayer}`}` : 'Visão Geral Consolidada'}
          </h2>
          {renderOverviewCards()}
        </section>

        {/* Progress Analysis - Only show when player is selected */}
        {selectedPlayer && (
          <section className="progress-analysis-section">
            <div className="section-header">
              <h2>📊 Análise de Progresso Detalhada</h2>
              <div className="period-selector">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="period-dropdown"
                >
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="quarter">Este Trimestre</option>
                  <option value="all">Todo Período</option>
                </select>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
                >
                  {showAdvanced ? '🔽' : '▶️'} Avançado
                </button>
              </div>
            </div>
            {renderProgressAnalysis()}

            {/* Goals Section */}
            <div className="goals-section">
              <h3>🎯 Metas de Progresso</h3>
              {renderProgressGoals()}
            </div>

            {/* Advanced Analysis */}
            {showAdvanced && (
              <div className="advanced-analysis">
                <h3>📈 Análise Avançada</h3>
                {renderAdvancedAnalysis()}
              </div>
            )}
          </section>
        )}

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
