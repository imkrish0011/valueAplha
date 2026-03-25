import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';
import { supabase } from '../lib/supabase';

function generateLobbyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function Lobby() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { setActiveLobbyDirect } = useLobby();
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'

  // Join state
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(null);

  // Create state
  const [maxUsers, setMaxUsers] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [createdLobby, setCreatedLobby] = useState(null);
  const [createError, setCreateError] = useState('');
  const [codeCopied, setCopied] = useState(false);

  // My lobbies
  const [myLobbies, setMyLobbies] = useState([]);
  const [loadingLobbies, setLoadingLobbies] = useState(true);

  // Fetch user's lobbies
  useEffect(() => {
    if (!profile) return;

    async function fetchMyLobbies() {
      const { data, error } = await supabase
        .from('lobby_members')
        .select(`
          lobby_id,
          joined_at,
          lobbies (
            id,
            code,
            max_users,
            created_by,
            created_at
          )
        `)
        .eq('user_id', profile.id)
        .order('joined_at', { ascending: false });

      if (!error && data) {
        // Get member counts for each lobby
        const lobbiesWithCounts = await Promise.all(
          data.map(async (item) => {
            // Depending on Supabase schema inference, joined data can sometimes be arrays or objects
            const lobbyData = Array.isArray(item.lobbies) ? item.lobbies[0] : item.lobbies;
            
            if (!lobbyData) return null; // Fallback if RLS blocks read

            const { count } = await supabase
              .from('lobby_members')
              .select('*', { count: 'exact', head: true })
              .eq('lobby_id', item.lobby_id);
              
            return {
              ...lobbyData,
              memberCount: count || 0,
              joinedAt: item.joined_at,
            };
          })
        );
        // Filter out any nulls from failed joins
        setMyLobbies(lobbiesWithCounts.filter(Boolean));
      }
      setLoadingLobbies(false);
    }

    fetchMyLobbies();

    // Real-time subscription for lobby_members changes
    const channel = supabase
      .channel('lobby-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lobby_members' }, () => {
        fetchMyLobbies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  async function handleJoinLobby(e) {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess(null);

    const code = joinCode.toUpperCase().trim();
    if (!code || code.length !== 6) {
      setJoinError('Please enter a valid 6-character lobby code');
      return;
    }

    setIsJoining(true);
    try {
      // Find the lobby
      const { data: lobby, error: lobbyError } = await supabase
        .from('lobbies')
        .select('*')
        .eq('code', code)
        .single();

      if (lobbyError || !lobby) {
        setJoinError('Lobby not found. Check the code and try again.');
        setIsJoining(false);
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('lobby_members')
        .select('*')
        .eq('lobby_id', lobby.id)
        .eq('user_id', profile.id)
        .single();

      if (existingMember) {
        // User is already a member (e.g., they left locally but RLS kept them in DB)
        // Simply log them back into the lobby silently!
        setActiveLobbyDirect(lobby);
        navigate('/dashboard');
        return;
      }

      // Check member count
      const { count } = await supabase
        .from('lobby_members')
        .select('*', { count: 'exact', head: true })
        .eq('lobby_id', lobby.id);

      if (count >= lobby.max_users) {
        setJoinError(`This lobby is full (${count}/${lobby.max_users} members)`);
        setIsJoining(false);
        return;
      }

      // Join the lobby
      const { error: joinErr } = await supabase
        .from('lobby_members')
        .insert([{ lobby_id: lobby.id, user_id: profile.id }]);

      if (joinErr) throw joinErr;

      // Set active lobby and redirect to dashboard
      setActiveLobbyDirect(lobby);
      navigate('/dashboard');
    } catch (err) {
      console.error('Join error:', err);
      setJoinError('Something went wrong. Please try again.');
    } finally {
      setIsJoining(false);
    }
  }

  async function handleCreateLobby() {
    setCreateError('');
    setIsCreating(true);
    setCreatedLobby(null);

    try {
      const code = generateLobbyCode();

      const { data: lobby, error: lobbyErr } = await supabase
        .from('lobbies')
        .insert([{
          code,
          created_by: profile.id,
          max_users: maxUsers,
        }])
        .select()
        .single();

      if (lobbyErr) throw lobbyErr;

      // Creator auto-joins the lobby
      const { error: memberErr } = await supabase
        .from('lobby_members')
        .insert([{ lobby_id: lobby.id, user_id: profile.id }]);

      if (memberErr) throw memberErr;

      // Set active lobby and redirect to dashboard
      setActiveLobbyDirect(lobby);
      navigate('/dashboard');
    } catch (err) {
      console.error('Create error:', err);
      if (err.message?.includes('duplicate')) {
        // Extremely rare collision - retry
        handleCreateLobby();
      } else {
        setCreateError('Failed to create lobby. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="lobby-page">
      {/* Header */}
      <header className="lobby-header">
        <div className="lobby-header-left">
          <div className="lobby-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <span className="lobby-brand">Prediction League</span>
        </div>
        <div className="lobby-header-right">
          <div className="lobby-user-info">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="lobby-user-avatar" />
            ) : (
              <div className="lobby-user-avatar-fallback">
                {profile?.full_name?.charAt(0) || '?'}
              </div>
            )}
            <div className="lobby-user-details">
              <span className="lobby-user-name">{profile?.full_name}</span>
              <span className="lobby-user-username">@{profile?.username}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={signOut}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="lobby-content">
        <div className="lobby-welcome">
          <h1>Welcome, {profile?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-secondary">Join an existing lobby or create a new one to start predicting.</p>
        </div>

        {/* Tab Switcher */}
        <div className="lobby-tabs">
          <button
            className={`lobby-tab ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Enter Lobby Code
          </button>
          <button
            className={`lobby-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create Lobby
          </button>
        </div>

        {/* Join Lobby Panel */}
        {activeTab === 'join' && (
          <div className="lobby-panel animate-in">
            <div className="lobby-panel-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2>Join a Lobby</h2>
            <p className="text-secondary">Enter the 6-character code shared by your lobby admin</p>

            <form onSubmit={handleJoinLobby} className="join-form">
              <div className="code-input-group">
                <input
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                  placeholder="XXXXXX"
                  className="code-input"
                  maxLength={6}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <button
                type="submit"
                className="lobby-action-btn"
                disabled={isJoining || joinCode.length !== 6}
              >
                {isJoining ? (
                  <>
                    <div className="google-btn-spinner" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Lobby
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {joinError && (
              <div className="lobby-message error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {joinError}
              </div>
            )}

            {joinSuccess && (
              <div className="lobby-message success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Successfully joined lobby <strong>{joinSuccess.code}</strong>! ({joinSuccess.memberCount}/{joinSuccess.maxUsers} members)
              </div>
            )}
          </div>
        )}

        {/* Create Lobby Panel */}
        {activeTab === 'create' && (
          <div className="lobby-panel animate-in">
            {!createdLobby ? (
              <>
                <div className="lobby-panel-icon create">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h2>Create a New Lobby</h2>
                <p className="text-secondary">Set up a lobby and invite your friends with a unique code</p>

                <div className="create-form">
                  <div className="form-group">
                    <label htmlFor="maxUsers">Maximum Players</label>
                    <div className="max-users-selector">
                      <button
                        type="button"
                        className="user-count-btn"
                        onClick={() => setMaxUsers(prev => Math.max(2, prev - 1))}
                        disabled={maxUsers <= 2}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="user-count-display">{maxUsers}</span>
                      <button
                        type="button"
                        className="user-count-btn"
                        onClick={() => setMaxUsers(prev => Math.min(50, prev + 1))}
                        disabled={maxUsers >= 50}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    <span className="field-hint">Between 2 and 50 players</span>
                  </div>

                  <button
                    className="lobby-action-btn create-btn"
                    onClick={handleCreateLobby}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <div className="google-btn-spinner" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Lobby
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </>
                    )}
                  </button>

                  {createError && (
                    <div className="lobby-message error">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      {createError}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="lobby-created animate-in">
                <div className="success-icon-big">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2>Lobby Created! 🎉</h2>
                <p className="text-secondary">Share this code with your friends</p>

                <div className="created-code-display">
                  <span className="code-chars">
                    {createdLobby.code.split('').map((char, i) => (
                      <span key={i} className="code-char" style={{ '--i': i }}>
                        {char}
                      </span>
                    ))}
                  </span>
                  <button
                    className="copy-btn"
                    onClick={() => copyCode(createdLobby.code)}
                  >
                    {codeCopied ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="lobby-info-pills">
                  <span className="info-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    Max {createdLobby.max_users} players
                  </span>
                  <span className="info-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Just created
                  </span>
                </div>

                <button
                  className="lobby-action-btn secondary"
                  onClick={() => setCreatedLobby(null)}
                >
                  Create Another Lobby
                </button>
              </div>
            )}
          </div>
        )}

        {/* My Lobbies */}
        <div className="my-lobbies-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            My Lobbies
          </h2>

          {loadingLobbies ? (
            <div className="lobbies-loading">
              <div className="google-btn-spinner" />
              <span>Loading your lobbies...</span>
            </div>
          ) : myLobbies.length === 0 ? (
            <div className="no-lobbies">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15h8" />
                <circle cx="9" cy="9" r="1" />
                <circle cx="15" cy="9" r="1" />
              </svg>
              <p>You haven't joined any lobbies yet</p>
              <span className="text-secondary">Join or create a lobby to get started</span>
            </div>
          ) : (
            <div className="lobbies-grid">
              {myLobbies.map(lobby => (
                <div key={lobby.id} className="lobby-card" onClick={() => { setActiveLobbyDirect(lobby); navigate('/dashboard'); }} style={{ cursor: 'pointer' }}>
                  <div className="lobby-card-header">
                    <span className="lobby-card-code">{lobby.code}</span>
                    <button className="copy-btn-small" onClick={() => copyCode(lobby.code)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                  <div className="lobby-card-body">
                    <div className="lobby-card-stat">
                      <span className="lobby-card-stat-value">{lobby.memberCount}</span>
                      <span className="lobby-card-stat-label">/ {lobby.max_users} players</span>
                    </div>
                    <div className="lobby-member-bar">
                      <div
                        className="lobby-member-fill"
                        style={{ width: `${(lobby.memberCount / lobby.max_users) * 100}%` }}
                      />
                    </div>
                  </div>
                  {lobby.created_by === profile?.id && (
                    <span className="lobby-owner-badge">Owner</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
