import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Save, RotateCcw } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, onUpdateSettings, onResetProgress }) => {
    if (!isOpen) return null;

    const languages = ['English', 'Hindi', 'Marathi'];
    const profiles = ['adult', 'junior', 'teen'];
    const goals = [5, 10, 15, 20];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-gray-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 flex items-center justify-between text-white">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span>⚙️</span> Settings
                        </h2>
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">

                        {/* Profile Section */}
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">User Profile</label>
                            <div className="grid grid-cols-3 gap-2">
                                {profiles.map(profile => (
                                    <button
                                        key={profile}
                                        onClick={() => onUpdateSettings({ ...settings, userProfile: profile })}
                                        className={`py-2 rounded-xl text-sm font-bold capitalize transition-all ${settings.userProfile === profile
                                                ? 'bg-teal-500 text-white shadow-lg scale-105'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {profile}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Audio Section */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${settings.audioEnabled ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400'}`}>
                                    {settings.audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                                </div>
                                <span className="font-bold">Sound Effects</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.audioEnabled}
                                    onChange={(e) => onUpdateSettings({ ...settings, audioEnabled: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                            </label>
                        </div>

                        {/* Hint Language */}
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Hint Audio Language</label>
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                {languages.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => onUpdateSettings({ ...settings, hintLanguage: lang })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${settings.hintLanguage === lang
                                                ? 'bg-white text-teal-600 shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Goal */}
                        <div>
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Daily Goal (Words)</label>
                            <div className="flex items-center justify-between gap-2">
                                {goals.map(goal => (
                                    <button
                                        key={goal}
                                        onClick={() => onUpdateSettings({ ...settings, dailyGoal: goal })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${settings.dailyGoal === goal
                                                ? 'border-teal-500 bg-teal-50 text-teal-600'
                                                : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="border-t pt-4">
                            <button
                                onClick={onResetProgress}
                                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl transition font-bold"
                            >
                                <RotateCcw size={18} />
                                Reset Progress
                            </button>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
                        Changes custom settings for this browser.
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsModal;
