import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const LobbyContext = createContext({});

export function useLobby() {
  return useContext(LobbyContext);
}

export function LobbyProvider({ children }) {
  const { profile } = useAuth();
  const [activeLobby, setActiveLobby] = useState(() => {
    // Check localStorage synchronously to avoid flash
    const savedCode = localStorage.getItem('activeLobbyCode');
    return savedCode ? { code: savedCode, _restoring: true } : null;
  });
  const [members, setMembers] = useState([]);

  // Restore saved lobby from Supabase when profile is ready
  useEffect(() => {
    if (!profile) return;
    if (!activeLobby?._restoring) return;

    const code = activeLobby.code;
    supabase
      .from('lobbies')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setActiveLobby(data);
        } else {
          setActiveLobby(null);
          localStorage.removeItem('activeLobbyCode');
        }
      });
  }, [profile, activeLobby?._restoring]);

  // Real-time subscription for lobby member changes
  useEffect(() => {
    if (!activeLobby || activeLobby._restoring) return;

    fetchMembers(activeLobby.id);

    const channel = supabase
      .channel(`lobby-${activeLobby.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lobby_members',
        filter: `lobby_id=eq.${activeLobby.id}`,
      }, () => {
        fetchMembers(activeLobby.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeLobby?.id, activeLobby?._restoring]);

  async function fetchMembers(lobbyId) {
    const { data, error } = await supabase
      .from('lobby_members')
      .select(`
        user_id,
        joined_at,
        profiles (
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .eq('lobby_id', lobbyId)
      .order('joined_at', { ascending: true });

    if (!error && data) {
      const validMembers = data.map(m => {
        const profileData = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
        if (!profileData) return null; // Safe fallback if RLS or DB link fails
        return {
          ...profileData,
          joinedAt: m.joined_at,
        };
      }).filter(Boolean); // Drop missing profiles so UI doesn't crash on undefined properties
      
      setMembers(validMembers);
    }
  }

  function setActiveLobbyDirect(lobby) {
    setActiveLobby(lobby);
    localStorage.setItem('activeLobbyCode', lobby.code);
  }

  async function leaveLobby() {
    if (activeLobby && profile) {
      try {
        await supabase
          .from('lobby_members')
          .delete()
          .eq('lobby_id', activeLobby.id)
          .eq('user_id', profile.id);
      } catch (err) {
        console.error('Failed to leave lobby:', err);
      }
    }
    clearLobbyLocal();
  }

  function clearLobbyLocal() {
    setActiveLobby(null);
    setMembers([]);
    localStorage.removeItem('activeLobbyCode');
  }

  // Consider "active" if we have a real lobby (not _restoring placeholder)
  const resolvedLobby = activeLobby?._restoring ? null : activeLobby;

  const value = {
    activeLobby: resolvedLobby,
    members,
    setActiveLobbyDirect,
    leaveLobby,
    clearLobbyLocal,
  };

  return (
    <LobbyContext.Provider value={value}>
      {children}
    </LobbyContext.Provider>
  );
}
