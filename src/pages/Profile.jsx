import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useNavigate } from 'react-router-dom';
import { getUserRank } from '../utils/rankUtils';

const BASE_ACHIEVEMENTS = [
  { id: 'first_pred', icon: '🎯', title: 'First Prediction', desc: 'Make your first match prediction' },
  { id: 'streak_3', icon: '🔥', title: 'Hat-Trick', desc: 'Get 3 predictions correct in a row' },
  { id: 'streak_5', icon: '⚡', title: 'On Fire', desc: 'Get 5 predictions correct in a row' },
  { id: 'first_lobby', icon: '🏠', title: 'Lobby Founder', desc: 'Create your first lobby' },
  { id: 'join_lobby', icon: '🤝', title: 'Team Player', desc: 'Join a lobby' },
  { id: 'perfect_match', icon: '💎', title: 'Crystal Ball', desc: 'Get all predictions correct in one match' },
  { id: 'top_3', icon: '🏆', title: 'Podium Finish', desc: 'Reach top 3 in a lobby leaderboard' },
  { id: 'ten_preds', icon: '📊', title: 'Regular', desc: 'Make 10 predictions' },
];

export default function Profile() {
  const { profile, signOut } = useAuth();
  const { activeLobby, leaveLobby, clearLobbyLocal } = useLobby();
  const { leaderboardData } = useLeaderboard();
  const navigate = useNavigate();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const myStats = leaderboardData.find(p => p.id === profile?.id);
  const totalPoints = myStats?.points || 0;
  const accuracy = myStats?.accuracy || 0;
  const predictionsCount = myStats?.predictions || 0;
  
  // Dynamically calculate some achievements
  const ACHIEVEMENTS = BASE_ACHIEVEMENTS.map(ach => {
    let unlocked = false;
    if (ach.id === 'join_lobby') unlocked = true; // They are in a lobby
    if (ach.id === 'first_lobby' && activeLobby?.created_by === profile?.id) unlocked = true;
    if (ach.id === 'first_pred' && predictionsCount > 0) unlocked = true;
    if (ach.id === 'ten_preds' && predictionsCount >= 10) unlocked = true;
    if (ach.id === 'top_3' && myStats?.rank <= 3 && totalPoints > 0) unlocked = true;
    
    // Streaks and perfect match need full match history tracking, so keeping false for now
    
    return { ...ach, unlocked };
  });

  function handleSignOut() {
    clearLobbyLocal();
    signOut();
  }

  async function confirmLeaveLobby() {
    setShowLeaveModal(false);
    await leaveLobby();
    navigate('/lobby');
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  return (
    <div>
      <div className="section">
        <h1>Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="section">
        <div className="profile-card">
          <div className="profile-card-top">
            <div className="profile-card-avatar">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" />
              ) : (
                <span>{profile?.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
              )}
            </div>
            <div className="profile-card-info">
              <h2>{profile?.full_name}</h2>
              <span className="profile-username">@{profile?.username}</span>
              <span className="profile-joined" style={{ marginBottom: '8px', display: 'block' }}>Member since {memberSince}</span>
              <div className="profile-rank" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '100px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '1.2em' }}>{getUserRank(totalPoints).icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{getUserRank(totalPoints).title}</span>
              </div>
            </div>
          </div>
          <div className="profile-card-stats">
            <div className="profile-mini-stat">
              <span className="profile-mini-stat-value">{totalPoints}</span>
              <span className="profile-mini-stat-label">Points</span>
            </div>
            <div className="profile-mini-stat">
              <span className="profile-mini-stat-value">{predictionsCount}</span>
              <span className="profile-mini-stat-label">Predictions</span>
            </div>
            <div className="profile-mini-stat">
              <span className="profile-mini-stat-value">{accuracy}%</span>
              <span className="profile-mini-stat-label">Accuracy</span>
            </div>
            <div className="profile-mini-stat">
              <span className="profile-mini-stat-value">0</span>
              <span className="profile-mini-stat-label">Win Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="section">
        <div className="section-header">
          <h2>🏅 Achievements</h2>
          <span className="badge badge-primary">
            {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">{ach.icon}</span>
              <div className="achievement-info">
                <span className="achievement-title">{ach.title}</span>
                <span className="achievement-desc">{ach.desc}</span>
              </div>
              {ach.unlocked && (
                <svg className="achievement-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <div className="section-header">
          <h2>📋 Recent Activity</h2>
        </div>
        <div className="empty-state-card">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p>No activity yet</p>
          <span className="text-secondary">Start making predictions to build your history</span>
        </div>
      </div>

      {/* Actions */}
      <div className="section">
        <div className="profile-actions">
          <button className="profile-action-btn" onClick={() => setShowLeaveModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Leave Lobby
          </button>
          <button className="profile-action-btn danger" onClick={handleSignOut}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Cool Leave Lobby Modal */}
      {showLeaveModal && (
        <div className="modal-backdrop" onClick={() => setShowLeaveModal(false)}>
          <div className="modal leave-modal animate-in" onClick={e => e.stopPropagation()}>
            <div className="modal-icon warning">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h2>Leave Lobby?</h2>
            <p className="text-secondary">
              If you leave, you will be disconnected from the leaderboard and stop earning points for this lobby.
              You can always join back later if you have the 6-digit code.
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowLeaveModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmLeaveLobby}>Yes, Leave Lobby</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
