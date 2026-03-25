import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LobbyProvider, useLobby } from './contexts/LobbyContext';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import Lobby from './pages/Lobby';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Leaderboard from './pages/Leaderboard';
import Predictions from './pages/Predictions';
import Profile from './pages/Profile';
import MatchDetail from './pages/MatchDetail';
import Navbar from './components/Navbar';

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}

function AppRoutes() {
  const { user, profile, loading: authLoading } = useAuth();
  const { activeLobby } = useLobby();

  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-content">
          <div className="app-loading-spinner" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in → Login page
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Logged in but no profile → Profile Setup
  if (!profile) {
    return (
      <Routes>
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    );
  }

  // Has profile but no active lobby → Lobby selection
  if (!activeLobby) {
    return (
      <Routes>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="*" element={<Navigate to="/lobby" replace />} />
      </Routes>
    );
  }

  // Fully authenticated + in an active lobby → Main App
  return (
    <Routes>
      <Route path="/lobby" element={<Lobby />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LobbyProvider>
        <AppRoutes />
      </LobbyProvider>
    </AuthProvider>
  );
}
