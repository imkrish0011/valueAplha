import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLobby } from '../contexts/LobbyContext';

export function useLeaderboard() {
  const { activeLobby, members } = useLobby();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores(forceNetwork = false) {
      if (!activeLobby || !members || members.length === 0) {
        setLeaderboardData([]);
        setLoading(false);
        return;
      }

      const cacheKey = `leaderboard_${activeLobby.id}`;
      
      // Try cache first
      if (!forceNetwork) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            // 5 minutes TTL
            if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
              setLeaderboardData(parsed.data);
              setLoading(false);
              return;
            }
          } catch(e) {}
        }
      }

      setLoading(true);
      try {
        const { data: predictions, error } = await supabase
          .from('predictions')
          .select('user_id, points, match_id')
          .eq('lobby_id', activeLobby.id);

        if (error) throw error;

        // Aggregate points per user
        const userStats = {};
        
        // Initialize all members
        members.forEach(m => {
          userStats[m.id] = {
            ...m,
            points: 0,
            predictionsCount: 0,
            correctCount: 0, // Mock: hard to know without full actual results vs predictions, but we can assume > 0 points means some correct
          };
        });

        // Add up the points from the predictions
        (predictions || []).forEach(pred => {
          if (userStats[pred.user_id]) {
            userStats[pred.user_id].predictionsCount += 1;
            userStats[pred.user_id].points += (pred.points || 0);
            if ((pred.points || 0) > 0) {
              userStats[pred.user_id].correctCount += 1;
            }
          }
        });

        // Format as array, calculate accuracy, and sort by points descending
        const leaderboard = Object.values(userStats).map(stat => {
          const accuracy = stat.predictionsCount > 0 
            ? Math.round((stat.correctCount / stat.predictionsCount) * 100) 
            : 0;
            
          return {
            ...stat,
            accuracy,
            predictions: stat.predictionsCount
          };
        });

        // Sort: Highest points first, tie-breaker is accuracy, then prediction count, then name
        leaderboard.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
          if (b.predictionsCount !== a.predictionsCount) return b.predictionsCount - a.predictionsCount;
          
          const nameA = a.full_name || 'Unknown User';
          const nameB = b.full_name || 'Unknown User';
          return nameA.localeCompare(nameB);
        });

        // Assign ranks (handling ties properly)
        let currentRank = 1;
        for (let i = 0; i < leaderboard.length; i++) {
          if (i > 0 && leaderboard[i].points === leaderboard[i-1].points && leaderboard[i].accuracy === leaderboard[i-1].accuracy) {
            leaderboard[i].rank = leaderboard[i-1].rank;
          } else {
            leaderboard[i].rank = currentRank;
          }
          currentRank++;
        }

        setLeaderboardData(leaderboard);
        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({ data: leaderboard, timestamp: Date.now() }));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
    
    // Set up a real-time subscription for predictions in this lobby to live-update the leaderboard!
    if (!activeLobby) return;
    
    const channel = supabase
      .channel('leaderboard-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'predictions',
        filter: `lobby_id=eq.${activeLobby.id}`
      }, () => {
        // Refetch when any prediction is made/updated bypass cache
        fetchScores(true);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeLobby?.id, members]);

  return { leaderboardData, loading };
}
