import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Dashboard() {
  const { profile } = useAuth();
  const { activeLobby, members } = useLobby();
  const { leaderboardData } = useLeaderboard();
  const [codeCopied, setCopied] = useState(false);

  const myStats = leaderboardData.find(p => p.id === profile?.id);
  const myRank = myStats?.rank || '—';
  const totalPoints = myStats?.points || 0;
  const accuracy = myStats?.accuracy || 0;

  function copyCode() {
    navigator.clipboard.writeText(activeLobby?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      {/* Page Header */}
      <div className="section">
        <h1>Dashboard</h1>
        <p className="text-secondary" style={{ marginTop: '4px', fontSize: '0.9375rem' }}>
          Welcome back, {profile?.full_name?.split(' ')[0]} 👋
        </p>
      </div>

      {/* Lobby Info Card */}
      {activeLobby && (
        <div className="section">
          <div className="dashboard-lobby-card">
            <div className="dashboard-lobby-header">
              <div>
                <div className="room-code-label">ACTIVE LOBBY</div>
                <div className="dashboard-lobby-code">
                  {activeLobby.code}
                  <button className="copy-btn-small" onClick={copyCode} title="Copy code">
                    {codeCopied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="dashboard-lobby-stat">
                <span className="dashboard-lobby-count">{members.length}</span>
                <span className="text-muted">/ {activeLobby.max_users} players</span>
              </div>
            </div>
            <div className="lobby-member-bar">
              <div
                className="lobby-member-fill"
                style={{ width: `${(members.length / activeLobby.max_users) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="section">
        <div className="grid-4">
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(108, 61, 232, 0.15)', color: 'var(--primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <div className="stat-card-label">My Rank</div>
            <div className="stat-card-value">{myRank}</div>
            <div className="stat-card-change text-muted">Current standing</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div className="stat-card-label">Total Points</div>
            <div className="stat-card-value">{totalPoints}</div>
            <div className="stat-card-change text-muted">Across all matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="stat-card-label">Accuracy</div>
            <div className="stat-card-value">{accuracy}%</div>
            <div className="stat-card-change text-muted">Prediction success rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
            <div className="stat-card-label">Win Streak</div>
            <div className="stat-card-value">0</div>
            <div className="stat-card-change text-muted">Keep going!</div>
          </div>
        </div>
      </div>

      {/* Lobby Members */}
      <div className="section">
        <div className="section-header">
          <h2>Lobby Members</h2>
          <span className="badge badge-primary">{members.length} online</span>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Username</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id} className={member.id === profile?.id ? 'current-user' : ''}>
                  <td className="rank-cell">{index + 1}</td>
                  <td>
                    <div className="player-cell">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      ) : (
                        <div className="avatar">{member.full_name?.charAt(0) || '?'}</div>
                      )}
                      <span>
                        {member.full_name}
                        {member.id === profile?.id && <span className="you-badge" style={{ marginLeft: 6 }}>You</span>}
                      </span>
                    </div>
                  </td>
                  <td className="text-secondary">@{member.username}</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Loading members...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
