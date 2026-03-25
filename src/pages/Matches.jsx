import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLobby } from '../contexts/LobbyContext';
import { MATCH_SCHEDULE, getMatchStatus } from '../lib/matchData';

export default function Matches() {
  const { activeLobby } = useLobby();
  const [filter, setFilter] = useState('all');

  const matches = MATCH_SCHEDULE.map(m => ({
    ...m,
    status: getMatchStatus(m.date),
  }));

  const filtered = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  return (
    <div>
      <div className="section">
        <h1>Matches</h1>
        <p className="text-secondary" style={{ marginTop: '4px', fontSize: '0.9375rem' }}>
          IPL 2026 Schedule — Predict to earn points
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="section">
        <div className="match-filters">
          {['all', 'upcoming', 'live', 'completed'].map(f => (
            <button
              key={f}
              className={`match-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Matches' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="filter-count">
                  {matches.filter(m => m.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="section">
        {filtered.length === 0 ? (
          <div className="empty-state-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15h8" />
              <circle cx="9" cy="9" r="1" />
              <circle cx="15" cy="9" r="1" />
            </svg>
            <p>No {filter} matches found</p>
          </div>
        ) : (
          <div className="matches-grid">
            {filtered.map(match => (
              <Link to={`/match/${match.id}`} key={match.id} style={{ textDecoration: 'none' }}>
                <div className="match-card-v2">
                  <div className="match-card-v2-header">
                    <span className="match-card-v2-league">{match.league}</span>
                    <span className={`status-dot ${match.status}`} />
                  </div>

                  <div className="match-card-v2-teams">
                    <div className="match-card-v2-team">
                      <div className="team-badge">{match.teamA.short}</div>
                      <span className="team-fullname">{match.teamA.name}</span>
                    </div>
                    <div className="match-vs-badge">VS</div>
                    <div className="match-card-v2-team">
                      <div className="team-badge">{match.teamB.short}</div>
                      <span className="team-fullname">{match.teamB.name}</span>
                    </div>
                  </div>

                  <div className="match-card-v2-footer">
                    <span className="match-card-v2-date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {match.date} · {match.time}
                    </span>
                    <span className={`match-status-pill ${match.status}`}>
                      {match.status}
                    </span>
                  </div>

                  <div className="match-card-v2-venue">{match.venue}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
