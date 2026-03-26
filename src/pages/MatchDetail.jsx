import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';
import { getMatchById, getPlayersForMatch, getTimeUntilMatch, getPredictionWindow, formatTimeDiff, TEAM_PLAYERS } from '../lib/matchData';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

const CATEGORIES = [
  { key: 'winner', label: 'Match Winner', icon: '🏆', desc: 'Which team will win?', type: 'team' },
  { key: 'mostRuns', label: 'Most Runs', icon: '🏏', desc: 'Player who will score the most runs', type: 'player' },
  { key: 'mostSixes', label: 'Most Sixes', icon: '💥', desc: 'Player who will hit the most sixes', type: 'player' },
  { key: 'mostFours', label: 'Most Fours', icon: '4️⃣', desc: 'Player who will hit the most fours', type: 'player' },
  { key: 'mostWickets', label: 'Most Wickets', icon: '🎯', desc: 'Player who will take the most wickets', type: 'player' },
];

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { activeLobby } = useLobby();

  const match = getMatchById(id);
  const [predictions, setPredictions] = useState({});
  const [activeCategory, setActiveCategory] = useState('winner');
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [editCount, setEditCount] = useState(0);
  const [predictionPoints, setPredictionPoints] = useState(0); // Track points for confetti

  const MAX_EDITS = 3;
  const maxEditsReached = editCount >= MAX_EDITS;

  // Live timer state
  const [predWindow, setPredWindow] = useState(match ? getPredictionWindow(match.date, match.time) : { status: 'closed', timeUntilEvent: 0 });
  const [liveTimeLeft, setLiveTimeLeft] = useState(match ? getTimeUntilMatch(match.date, match.time) : null);

  if (!match) {
    return (
      <div>
        <div className="section">
          <button className="back-link" onClick={() => navigate('/matches')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Matches
          </button>
        </div>
        <div className="empty-state-card large">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h3>Match Not Found</h3>
          <p className="text-secondary">This match doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // 4. Live Ticking Timer Effect
  useEffect(() => {
    if (!match || match.status === 'completed') return;
    
    const interval = setInterval(() => {
      setPredWindow(getPredictionWindow(match.date, match.time));
      setLiveTimeLeft(getTimeUntilMatch(match.date, match.time, true)); // Assume true passes for seconds if we update matchData
    }, 1000);
    return () => clearInterval(interval);
  }, [match]);

  const canPredict = predWindow.status === 'open';
  
  const allPlayers = getPlayersForMatch(match);
  const teamAPlayers = TEAM_PLAYERS[match.teamA.short] || [];
  const teamBPlayers = TEAM_PLAYERS[match.teamB.short] || [];

  useEffect(() => {
    async function fetchExistingPrediction() {
      if (!profile || !activeLobby || !match) return;
      
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*, edit_count, points')
          .eq('user_id', profile.id)
          .eq('lobby_id', activeLobby.id)
          .eq('match_id', match.id)
          .maybeSingle();

        if (data && !error) {
          const loadedPreds = {};
          if (data.winner) loadedPreds.winner = data.winner;
          
          if (data.most_runs) {
            const p = allPlayers.find(player => player.name === data.most_runs);
            if (p) loadedPreds.mostRuns = p;
          }
          if (data.most_sixes) {
            const p = allPlayers.find(player => player.name === data.most_sixes);
            if (p) loadedPreds.mostSixes = p;
          }
          if (data.most_fours) {
            const p = allPlayers.find(player => player.name === data.most_fours);
            if (p) loadedPreds.mostFours = p;
          }
          if (data.most_wickets) {
            const p = allPlayers.find(player => player.name === data.most_wickets);
            if (p) loadedPreds.mostWickets = p;
          }
          
          setPredictions(loadedPreds);
          setEditCount(data.edit_count || 0);
          setPredictionPoints(data.points || 0);
          if (Object.keys(loadedPreds).length > 0) {
            setSubmitted(true);
          }
        }
      } catch (err) {
        console.error("Error fetching prediction:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    
    fetchExistingPrediction();
  }, [match?.id, profile?.id, activeLobby?.id]);

  // 3. Perfect Match Confetti Animation 🎉
  useEffect(() => {
    if (match?.status === 'completed' && predictionPoints === 100 && !loadingInitial) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);
      return () => clearInterval(interval);
    }
  }, [match?.status, predictionPoints, loadingInitial]);

  const completedCount = Object.keys(predictions).length;
  const totalCategories = CATEGORIES.length;

  function selectPrediction(category, value) {
    setPredictions(prev => ({ ...prev, [category]: value }));
  }

  async function handleSubmit() {
    if (completedCount < 1) return;

    // 1. SAFETY CHECK: Block submission if they are already at max edits
    if (editCount >= MAX_EDITS) {
      setError("You have reached the maximum of 3 edits for this match.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // 2. LOGIC FIX: Check if they already had predictions loaded from the DB.
      const isUpdating = editCount > 0 || Object.keys(predictions).length > 0;
      const newEditCount = isUpdating ? editCount + 1 : 0;

      const { error: dbError } = await supabase
        .from('predictions')
        .upsert({
          user_id: profile.id,
          lobby_id: activeLobby.id,
          match_id: match.id,
          winner: predictions.winner || null,
          most_runs: predictions.mostRuns?.name || null,
          most_sixes: predictions.mostSixes?.name || null,
          most_fours: predictions.mostFours?.name || null,
          most_wickets: predictions.mostWickets?.name || null,
          edit_count: newEditCount
        }, { onConflict: 'user_id,lobby_id,match_id' });

      if (dbError) throw dbError;
      
      // Update local state to reflect the new count
      setEditCount(newEditCount);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to save predictions.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleShareText() {
    const text = `🏏 IPL Predictor: ${match.teamA.short} vs ${match.teamB.short}\n` +
      CATEGORIES.map(c => predictions[c.key] ? `${c.icon} ${c.label}: ${typeof predictions[c.key] === 'string' ? predictions[c.key] : predictions[c.key].name}` : '').filter(Boolean).join('\n') +
      `\n🔗 Can you beat my score?`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Predictions copied to clipboard! (Wordle Style)');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  async function handleDownloadImage() {
    const node = document.getElementById('shareable-card');
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { cacheBust: true, style: { background: '#161625' } });
      const link = document.createElement('a');
      link.download = `prediction-${match.teamA.short}-vs-${match.teamB.short}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image: ', err);
    }
  }

  const filteredPlayers = searchQuery
    ? allPlayers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allPlayers;

  return (
    <div>
      {/* Back Button */}
      <div className="section">
        <button className="back-link" onClick={() => navigate('/matches')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Matches
        </button>
      </div>

      {/* Match Header */}
      <div className="section">
        <div className="match-detail-card">
          <div className="match-detail-header">
            <span className="match-card-v2-league">{match.league}</span>
            <span className={`match-status-pill ${match.status}`}>{match.status}</span>
          </div>

          <div className="match-detail-teams">
            <div className="match-detail-team">
              <div className="team-badge-large">{match.teamA.short}</div>
              <span className="match-detail-team-name">{match.teamA.name}</span>
            </div>
            <div className="match-detail-vs">
              <span className="match-vs-badge">VS</span>
              {liveTimeLeft && (
                <div className="countdown-display" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Starts in {liveTimeLeft}</span>
                </div>
              )}
            </div>
            <div className="match-detail-team">
              <div className="team-badge-large">{match.teamB.short}</div>
              <span className="match-detail-team-name">{match.teamB.name}</span>
            </div>
          </div>

          <div className="match-detail-info">
            <div className="match-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{match.date} · {match.time} IST</span>
            </div>
            <div className="match-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span>{match.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Window Not Open Yet */}
      {predWindow.status === 'too_early' && match.status === 'upcoming' && (
        <div className="section">
          <div className="prediction-locked-card" style={{ background: 'rgba(56, 189, 248, 0.06)', borderColor: 'rgba(56, 189, 248, 0.15)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <h3 style={{ color: 'var(--text-primary)' }}>Predictions Haven't Opened</h3>
              <p className="text-secondary">
                Predictions open 7 hours prior to the match and close at the toss. 
                They will be available in <strong>{formatTimeDiff(predWindow.timeUntilEvent)}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Locked Warning */}
      {predWindow.status === 'closed' && match.status === 'upcoming' && (
        <div className="section">
          <div className="prediction-locked-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <h3>Predictions Locked</h3>
              <p className="text-secondary">Predictions close 30 minutes before the match starts. This match's predictions are now locked.</p>
            </div>
          </div>
        </div>
      )}

      {/* Live / Completed Status */}
      {match.status === 'live' && (
        <div className="section">
          <div className="match-status-card live">
            <div className="status-card-icon"><span className="live-dot" /></div>
            <h3>Match In Progress</h3>
            <p className="text-secondary">This match is currently live. Predictions are locked.</p>
          </div>
        </div>
      )}

      {match.status === 'completed' && (
        <div className="section">
          <div className="match-status-card completed">
            <div className="status-card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3>Match Completed</h3>
            <p className="text-secondary">This match has ended. Results will be updated soon.</p>
          </div>
        </div>
      )}

      {/* Submitted Success */}
      {submitted && (
        <div className="section">
          <div className="prediction-success-card">
            
            <div id="shareable-card" style={{ padding: '24px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div className="success-icon-big">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>{match.teamA.short} vs {match.teamB.short} Predictions 🎉</h3>
              <p className="text-secondary">
                {completedCount} out of {totalCategories} predictions locked in.
              </p>
              <div className="submitted-summary">
                {Object.entries(predictions).map(([key, value]) => {
                  const cat = CATEGORIES.find(c => c.key === key);
                  return (
                    <div key={key} className="submitted-item">
                      <span className="submitted-icon">{cat?.icon}</span>
                      <span className="submitted-label">{cat?.label}:</span>
                      <strong>{typeof value === 'string' ? value : value?.name || value}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share / Action Buttons (Not included in image export) */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn" onClick={handleShareText} style={{ flex: 1, minWidth: '180px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Copy Text (Wordle)
              </button>
              <button className="btn" onClick={handleDownloadImage} style={{ flex: 1, minWidth: '180px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', background: 'var(--elevated)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Image
              </button>
            </div>
            
            {/* Allow editing if still open and edits remain */}
            {canPredict && (
              maxEditsReached ? (
                <p className="text-secondary" style={{ marginTop: '24px', color: 'var(--danger, #ef4444)' }}>
                  ⚠️ You have reached the maximum of 3 edits for this match.
                </p>
              ) : (
                <button 
                  className="btn btn-outline" 
                  style={{ marginTop: '16px', width: '100%' }}
                  onClick={() => setSubmitted(false)}
                >
                  Edit Predictions ({MAX_EDITS - editCount} edit{MAX_EDITS - editCount !== 1 ? 's' : ''} remaining)
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Loading State for Existing */}
      {loadingInitial && canPredict && !submitted && (
        <div className="section" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner"></div>
          <p className="text-muted" style={{ marginTop: '16px' }}>Loading your predictions...</p>
        </div>
      )}

      {/* Prediction Form */}
      {canPredict && !submitted && match.status === 'upcoming' && (
        <div className="section">
          <div className="section-header">
            <h2>🎯 Make Your Predictions</h2>
            {predictionWindow.status === 'open' && (
              <span className="lock-timer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Locks in {formatTimeDiff(predictionWindow.timeUntilEvent)}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="prediction-progress">
            <div className="prediction-progress-text">
              <span>{completedCount}/{totalCategories} predictions made</span>
            </div>
            <div className="prediction-progress-bar">
              <div className="prediction-progress-fill" style={{ width: `${(completedCount / totalCategories) * 100}%` }} />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`category-tab ${activeCategory === cat.key ? 'active' : ''} ${predictions[cat.key] ? 'completed' : ''}`}
                onClick={() => { setActiveCategory(cat.key); setSearchQuery(''); }}
              >
                <span className="category-tab-icon">{cat.icon}</span>
                <span className="category-tab-label">{cat.label}</span>
                {predictions[cat.key] && (
                  <svg className="category-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="category-content">
            {/* Winner Selection */}
            {activeCategory === 'winner' && (
              <div className="category-panel animate-in">
                <p className="text-secondary" style={{ marginBottom: '16px' }}>Which team will win this match?</p>
                <div className="team-select-grid">
                  <button
                    className={`team-select-card ${predictions.winner === match.teamA.short ? 'selected' : ''}`}
                    onClick={() => selectPrediction('winner', match.teamA.short)}
                  >
                    <div className="team-badge-large">{match.teamA.short}</div>
                    <span>{match.teamA.name}</span>
                    {predictions.winner === match.teamA.short && <span className="team-selected-badge">✓ Selected</span>}
                  </button>
                  <button
                    className={`team-select-card ${predictions.winner === match.teamB.short ? 'selected' : ''}`}
                    onClick={() => selectPrediction('winner', match.teamB.short)}
                  >
                    <div className="team-badge-large">{match.teamB.short}</div>
                    <span>{match.teamB.name}</span>
                    {predictions.winner === match.teamB.short && <span className="team-selected-badge">✓ Selected</span>}
                  </button>
                </div>
              </div>
            )}

            {/* Player Selection Categories */}
            {activeCategory !== 'winner' && (
              <div className="category-panel animate-in">
                <p className="text-secondary" style={{ marginBottom: '16px' }}>
                  {CATEGORIES.find(c => c.key === activeCategory)?.desc}
                </p>

                {/* Search */}
                <div className="player-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search player..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Players By Team */}
                <div className="players-by-team">
                  {/* Team A Players */}
                  <div className="player-team-section">
                    <div className="player-team-header">{match.teamA.short}</div>
                    <div className="player-grid">
                      {teamAPlayers
                        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(player => (
                        <button
                          key={player.id}
                          className={`player-card ${predictions[activeCategory]?.id === player.id ? 'selected' : ''}`}
                          onClick={() => selectPrediction(activeCategory, player)}
                        >
                          <div className="player-card-avatar">{player.name.charAt(0)}</div>
                          <div className="player-card-info">
                            <span className="player-card-name">{player.name}</span>
                            <span className="player-card-role">{player.role}</span>
                          </div>
                          {predictions[activeCategory]?.id === player.id && (
                            <svg className="player-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Team B Players */}
                  <div className="player-team-section">
                    <div className="player-team-header">{match.teamB.short}</div>
                    <div className="player-grid">
                      {teamBPlayers
                        .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(player => (
                        <button
                          key={player.id}
                          className={`player-card ${predictions[activeCategory]?.id === player.id ? 'selected' : ''}`}
                          onClick={() => selectPrediction(activeCategory, player)}
                        >
                          <div className="player-card-avatar">{player.name.charAt(0)}</div>
                          <div className="player-card-info">
                            <span className="player-card-name">{player.name}</span>
                            <span className="player-card-role">{player.role}</span>
                          </div>
                          {predictions[activeCategory]?.id === player.id && (
                            <svg className="player-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          {completedCount > 0 && (
            <div className="predict-submit-area">
              {error && (
                <div className="error-message" style={{ marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              <button 
                className="predict-submit-btn" 
                onClick={handleSubmit}
                disabled={submitting}
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? (
                  <div className="spinner" style={{ width: 16, height: 16, borderLeftColor: 'white' }}></div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                )}
                {submitting ? 'Saving...' : `Submit ${completedCount} Prediction${completedCount > 1 ? 's' : ''}`}
                {!submitting && completedCount < totalCategories && ` (${totalCategories - completedCount} optional remaining)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
