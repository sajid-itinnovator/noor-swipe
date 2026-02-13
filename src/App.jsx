import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import SwipeGame from './components/SwipeGame';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Badges from './components/Badges';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import Onboarding from './components/Onboarding';
import { setMuted } from '../.agent/skills/audio_engine/audio_player';
import { getUser } from './utils/user_storage';

// Default Settings
const DEFAULT_SETTINGS = {
  userProfile: 'adult',
  hintLanguage: 'Hindi', // 'Hindi', 'Marathi', 'English'
  audioEnabled: true,
  dailyGoal: 10,
  darkMode: true // Default to dark mode as per design
};

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn("Failed to parse settings from localStorage, resetting to default.", e);
      return DEFAULT_SETTINGS;
    }
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Load User on Mount
  useEffect(() => {
    const existingUser = getUser();
    if (existingUser) {
      setUser(existingUser);
      setSettings(prev => ({ ...prev, userProfile: existingUser.profileType || 'adult' }));
    } else {
      // Redirect to onboarding if no user found
      if (location.pathname !== '/onboarding') {
        navigate('/onboarding');
      }
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setMuted(!settings.audioEnabled);

    // Apply Dark Mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  const handleUserComplete = (newUser) => {
    setUser(newUser);
    setSettings(prev => ({ ...prev, userProfile: newUser.profileType || 'adult' }));
  };

  if (loadingUser) return <div className="min-h-screen bg-black flex items-center justify-center text-[#F59E0B]">Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/onboarding" element={<Onboarding onComplete={handleUserComplete} />} />
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard settings={settings} user={user} />} />
              <Route path="/learn" element={
                <SwipeGame
                  settings={settings}
                  onOpenSettings={() => { }}
                />
              } />
              <Route path="/badges" element={<Badges />} />
              <Route path="/leaderboard" element={<Leaderboard user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default App;
