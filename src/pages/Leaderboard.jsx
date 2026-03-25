import { useAuth } from '../contexts/AuthContext';
import { useLobby } from '../contexts/LobbyContext';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Leaderboard() {
  const { profile } = useAuth();
  const { activeLobby } = useLobby();
  const { leaderboardData, loading } = useLeaderboard();

  return (
    <div>
      <div className="section">
        <h1>Leaderboard</h1>
        <p className="text-secondary" style={{ marginTop: '4px', fontSize: '0.9375rem' }}>
          Lobby <strong>{activeLobby?.code}</strong> — {leaderboardData.length} players competing
        </p>
      </div>

      {loading && (
        <div className="section" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner"></div>
          <p className="text-muted mt-2">Loading scores...</p>
        </div>
      )}

      {/* Podium */}
      {leaderboardData.length >= 1 && (
        <div className="section">
          <div className="podium">
            {leaderboardData.length >= 2 && (
              <div className="podium-place second">
                <div className="podium-avatar">
                  {leaderboardData[1].avatar_url ? (
                    <img src={leaderboardData[1].avatar_url} alt="" />
                  ) : (
                    <span>{leaderboardData[1].full_name?.charAt(0)}</span>
                  )}
                </div>
                <span className="podium-name">{leaderboardData[1].full_name?.split(' ')[0]}</span>
                <span className="podium-points">{leaderboardData[1].points} pts</span>
                <div className="podium-bar">2</div>
              </div>
            )}
            <div className="podium-place first">
              <div className="podium-crown">👑</div>
              <div className="podium-avatar gold">
                {leaderboardData[0].avatar_url ? (
                  <img src={leaderboardData[0].avatar_url} alt="" />
                ) : (
                  <span>{leaderboardData[0].full_name?.charAt(0)}</span>
                )}
              </div>
              <span className="podium-name">{leaderboardData[0].full_name?.split(' ')[0]}</span>
              <span className="podium-points">{leaderboardData[0].points} pts</span>
              <div className="podium-bar tall">1</div>
            </div>
            {leaderboardData.length >= 3 && (
              <div className="podium-place third">
                <div className="podium-avatar">
                  {leaderboardData[2].avatar_url ? (
                    <img src={leaderboardData[2].avatar_url} alt="" />
                  ) : (
                    <span>{leaderboardData[2].full_name?.charAt(0)}</span>
                  )}
                </div>
                <span className="podium-name">{leaderboardData[2].full_name?.split(' ')[0]}</span>
                <span className="podium-points">{leaderboardData[2].points} pts</span>
                <div className="podium-bar short">3</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Table */}
      <div className="section">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Points</th>
                <th>Accuracy</th>
                <th>Predictions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map(player => (
                <tr key={player.id} className={player.id === profile?.id ? 'current-user' : ''}>
                  <td className="rank-cell">
                    {player.rank <= 3 ? (
                      <span className={`rank-medal rank-${player.rank}`}>
                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      player.rank
                    )}
                  </td>
                  <td>
                    <div className="player-cell">
                      {player.avatar_url ? (
                        <img src={player.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      ) : (
                        <div className="avatar">{player.full_name?.charAt(0)}</div>
                      )}
                      <span>
                        {player.full_name}
                        {player.id === profile?.id && <span className="you-badge" style={{ marginLeft: 6 }}>You</span>}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{player.points}</td>
                  <td className="text-secondary">{player.accuracy}%</td>
                  <td className="text-secondary">{player.predictions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
