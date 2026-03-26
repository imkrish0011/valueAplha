import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';

const navItems = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/matches', label: 'Matches',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14.5 12.5-5-3v6l5-3z" /><circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    to: '/leaderboard', label: 'Leaderboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    to: '/predictions', label: 'Predictions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { activeLobby } = useLobby();
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <span>Prediction League</span>
            {activeLobby && (
              <span className="navbar-lobby-badge">{activeLobby.code}</span>
            )}
          </div>

          <div className="navbar-links">
            {navItems.map(({ to, label, icon }) => (
              <NavLink key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
            
            <NavLink to="/profile" className={`nav-link mobile-only-flex ${location.pathname === '/profile' ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </NavLink>

            {/* Mobile Rules Button */}
            <button
              className={`nav-link mobile-only-flex rules-toggle-btn ${showRules ? 'active' : ''}`}
              onClick={() => setShowRules(prev => !prev)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Rules</span>
            </button>
          </div>

          <div className="navbar-right desktop-only-flex">
            {/* Rules Button */}
            <button
              className={`nav-link rules-toggle-btn ${showRules ? 'active' : ''}`}
              onClick={() => setShowRules(prev => !prev)}
              title="Rules & Scoring"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Rules</span>
            </button>

            <button className="nav-link" onClick={() => navigate('/lobby')} title="Lobbies">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Lobbies</span>
            </button>
            <NavLink to="/profile" className="navbar-user">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="navbar-avatar-img" />
              ) : (
                <div className="avatar">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Rules Overlay */}
      {showRules && <div className="rules-overlay" onClick={() => setShowRules(false)} />}

      {/* Rules Panel */}
      <div className={`rules-panel ${showRules ? 'open' : ''}`}>
        <div className="rules-panel-header">
          <h3>📋 Rules & Scoring</h3>
          <button className="rules-close-btn" onClick={() => setShowRules(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="rules-panel-body">
          {/* Prediction Window */}
          <div className="rules-section">
            <div className="rules-section-icon">⏰</div>
            <div>
              <h4>Prediction Window</h4>
              <ul className="rules-list">
                <li>Opens <strong>7 hours</strong> before the match</li>
                <li>Closes <strong>30 minutes</strong> before the match starts (toss)</li>
              </ul>
            </div>
          </div>

          {/* Edit Limits */}
          <div className="rules-section">
            <div className="rules-section-icon">✏️</div>
            <div>
              <h4>Edit Limits</h4>
              <ul className="rules-list">
                <li>You can edit your prediction up to <strong>3 times</strong> per match</li>
                <li>First submission does not count as an edit</li>
                <li>Edits remaining are shown on the button</li>
              </ul>
            </div>
          </div>

          {/* Point System */}
          <div className="rules-section">
            <div className="rules-section-icon">⭐</div>
            <div>
              <h4>Point System</h4>
              <div className="rules-points-table">
                <div className="rules-point-row">
                  <span>🏆 Correct Match Winner</span>
                  <span className="rules-pts">+10 pts</span>
                </div>
                <div className="rules-point-row">
                  <span>🏏 Correct Most Runs</span>
                  <span className="rules-pts">+20 pts</span>
                </div>
                <div className="rules-point-row">
                  <span>🎯 Correct Most Wickets</span>
                  <span className="rules-pts">+20 pts</span>
                </div>
                <div className="rules-point-row">
                  <span>💥 Correct Most Sixes</span>
                  <span className="rules-pts">+15 pts</span>
                </div>
                <div className="rules-point-row">
                  <span>4️⃣ Correct Most Fours</span>
                  <span className="rules-pts">+15 pts</span>
                </div>
                <div className="rules-point-row highlight">
                  <span>🌟 Perfect Prediction (all 5 correct)</span>
                  <span className="rules-pts bonus">+20 pts</span>
                </div>
                <div className="rules-point-row penalty">
                  <span>⚠️ Non-Starter Penalty</span>
                  <span className="rules-pts penalty">−15 pts</span>
                </div>
              </div>
              <p className="rules-max-note">Max possible per match: <strong>100 pts</strong></p>
            </div>
          </div>

          {/* Categories */}
          <div className="rules-section">
            <div className="rules-section-icon">📝</div>
            <div>
              <h4>Prediction Categories</h4>
              <ul className="rules-list">
                <li>Match Winner (team pick)</li>
                <li>Most Runs, Most Sixes, Most Fours, Most Wickets (player picks)</li>
                <li>All categories are optional — submit as many as you like</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
