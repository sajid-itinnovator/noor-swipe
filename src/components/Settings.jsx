import React, { useState } from 'react';
import { User, Layers, Bell, Lock, Moon, Volume2, Mail, ChevronRight, Check } from 'lucide-react';

const Settings = ({ settings, setSettings }) => {
    const [activeTab, setActiveTab] = useState('interface');

    // Fallback if settings are not passed (e.g. testing)
    const currentSettings = settings || {};

    const toggleSetting = (key) => {
        if (setSettings) {
            setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'interface', label: 'Interface', icon: Layers },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Lock },
    ];

    return (
        <div className="flex h-full bg-[#f6f8f6] dark:bg-[#121212] text-slate-900 dark:text-white font-display overflow-hidden">
            {/* Settings Sidebar */}
            <div className="w-full md:w-64 bg-white dark:bg-[#1e1e1e] border-r border-slate-200 dark:border-white/5 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-200 dark:border-white/5">
                    <h1 className="text-xl font-bold">App Settings</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-[#137fec]/10 text-[#137fec] font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile Tab Select (Horizontal) - Optional for smaller screens if needed, 
                but aiming for responsive, the main layout sidebar handles nav. 
                For Settings internal nav, on mobile this might be a drill-down.
                For now, preserving the desktop side-by-side view as requested.
            */}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
                <div className="max-w-2xl mx-auto">
                    {activeTab === 'interface' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Interface Settings</h2>
                                <p className="text-slate-500 dark:text-slate-400">Customize your learning experience</p>
                            </div>

                            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                                {/* Dark Mode */}
                                <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                            <Moon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Dark Mode</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Enable for low-light conditions.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting('darkMode')}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${currentSettings.darkMode ? 'bg-[#137fec]' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${currentSettings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                {/* Sound Effects */}
                                <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#ec7f13]/10 flex items-center justify-center text-[#ec7f13]">
                                            <Volume2 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Sound Effects</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Play audio cues during lessons.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting('audioEnabled')}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${currentSettings.audioEnabled ? 'bg-[#ec7f13]' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${currentSettings.audioEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                {/* Email Notifications */}
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#ec7f13]/10 flex items-center justify-center text-[#ec7f13]">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Email Notifications</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive progress updates and reminders.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting('emailNotifications')}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${currentSettings.emailNotifications ? 'bg-[#ec7f13]' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${currentSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm p-6">
                                <h3 className="font-bold mb-4">Notifications Settings</h3>
                                {/* Placeholder for more settings */}
                                <div className="space-y-4 opacity-50">
                                    <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/2"></div>
                                </div>
                            </div>

                            <div className="flex justify-center text-sm text-slate-400 gap-6 mt-10">
                                <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Help Center</a>
                                <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
                                <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
                            </div>
                        </div>
                    )}
                    {activeTab !== 'interface' && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                <Lock size={24} />
                            </div>
                            <p>Coming Soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
