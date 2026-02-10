import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import SwipeGame from './components/SwipeGame';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import { setMuted } from '../.agent/skills/audio_engine/audio_player';

// Default Settings
const DEFAULT_SETTINGS = {
  userProfile: 'adult',
  hintLanguage: 'Hindi', // 'Hindi', 'Marathi', 'English'
  audioEnabled: true,
  dailyGoal: 10
};

function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn("Failed to parse settings from localStorage, resetting to default.", e);
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setMuted(!settings.audioEnabled);
  }, [settings]);

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetProgress={handleResetProgress}
      />

      <Routes>
        <Route
          path="/"
          element={
            <SwipeGame
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
