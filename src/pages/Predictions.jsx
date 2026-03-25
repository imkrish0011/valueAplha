import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';
import { supabase } from '../lib/supabase';
import { MATCH_SCHEDULE } from '../lib/matchData';
import { Link } from 'react-router-dom';

export default function Predictions() {
  const { profile } = useAuth();
  const { activeLobby } = useLobby();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      if (!profile || !activeLobby) return;

      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', profile.id)
          .eq('lobby_id', activeLobby.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPredictions(data || []);
      } catch (err) {
        console.error('Error fetching predictions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, [profile?.id, activeLobby?.id]);

  const total = predictions.length;

  return (
    <div>
      <div className="section">
        <h1>My Predictions</h1>
        <p className="text-secondary" style={{ marginTop: '4px', fontSize: '0.9375rem' }}>
          Track all your predictions for lobby <strong>{activeLobby?.code}</strong>
        </p>
      </div>

      {/* Prediction Stats */}
      <div className="section">
        <div className="prediction-stats-row">
          <div className="prediction-stat-card">
            <span className="prediction-stat-number">{total}</span>
            <span className="prediction-stat-label">Total Predictions</span>
          </div>
          <div className="prediction-stat-card correct">
            <span className="prediction-stat-number">0</span>
            <span className="prediction-stat-label">Correct</span>
          </div>
          <div className="prediction-stat-card wrong">
            <span className="prediction-stat-number">0</span>
            <span className="prediction-stat-label">Wrong</span>
          </div>
          <div className="prediction-stat-card pending">
            <span className="prediction-stat-number">{total}</span>
            <span className="prediction-stat-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : predictions.length === 0 ? (
          <div className="empty-state-card large">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <h3>No Predictions Yet</h3>
            <p className="text-secondary">
              Go to <strong>Matches</strong> and make your first prediction to see them here!
            </p>
            <Link to="/matches" className="btn btn-primary mt-4">View Matches</Link>
          </div>
        ) : (
          <div className="predictions-list" style={{ display: 'grid', gap: '16px' }}>
            {predictions.map(pred => {
              const match = MATCH_SCHEDULE.find(m => m.id === pred.match_id);
              if (!match) return null;
              
              const predCount = [pred.winner, pred.most_runs, pred.most_sixes, pred.most_fours, pred.most_wickets].filter(Boolean).length;
              
              return (
                <Link to={`/match/${match.id}`} key={pred.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="match-card-v2" style={{ cursor: 'pointer' }}>
                    <div className="match-card-v2-header">
                      <span className="match-card-v2-league">{match.league}</span>
                      <span className="badge badge-warning">Pending</span>
                    </div>
                    
                    <div className="match-card-v2-teams">
                      <div className="match-card-v2-team">
                        <div className="team-badge" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>{match.teamA.short}</div>
                        <span className="team-name">{match.teamA.short}</span>
                      </div>
                      <div className="match-card-v2-vs">VS</div>
                      <div className="match-card-v2-team">
                        <div className="team-badge" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>{match.teamB.short}</div>
                        <span className="team-name">{match.teamB.short}</span>
                      </div>
                    </div>
                    
                    <div className="match-card-v2-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-secondary" style={{ fontSize: '0.8125rem' }}>{match.date}</span>
                      <span className="badge badge-primary">{predCount}/5 Predicted</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
