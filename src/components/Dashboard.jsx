import React, { useState, useEffect } from 'react';
import { getAllStats, getWeakLinks } from '../../.agent/skills/progress_tracker/telemetry_logger';
import { getStreakData, exportUserData } from '../../.agent/skills/data_handler/storage_provider';
import { getWord } from '../../.agent/skills/data_handler/vocabulary_loader';
import StreakCalendar from './StreakCalendar';
import ProgressBar from './ProgressBar';
import { ArrowLeft, Download, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [streakData, setStreakData] = useState({});
    const [weakLinks, setWeakLinks] = useState([]);

    useEffect(() => {
        // Load data on mount
        setStats(getAllStats());
        setStreakData(getStreakData());
        setWeakLinks(getWeakLinks());
    }, []);

    const handleExport = () => {
        exportUserData();
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 pb-20 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                        Parent Dashboard
                    </h1>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                >
                    <Download size={16} />
                    Export Data
                </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Progress Section */}
                <ProgressBar wordStats={stats} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weak Links Section */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" size={20} />
                            Needs Practice
                        </h3>

                        {weakLinks.length === 0 ? (
                            <div className="text-white/50 text-center py-8">
                                No weak links identified yet. Great job!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {weakLinks.slice(0, 10).map(wordId => {
                                    const stat = stats[wordId] || { correct: 0, total: 0 };
                                    const word = getWord(wordId);
                                    const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;

                                    return (
                                        <div key={wordId} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                            <div>
                                                <div className="font-bold text-amber-100">{word?.phonics || wordId}</div>
                                                <div className="text-xs text-white/50">{word?.meaning_en || 'Unknown'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-red-400 font-bold">{100 - accuracy}% Error</div>
                                                <div className="text-xs text-white/30">{stat.total - stat.correct}/{stat.total} missed</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Streak Calendar */}
                    <StreakCalendar streakData={streakData} />
                </div>

                {/* Profile Breakdown Placeholder */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 opacity-50">
                    <h3 className="text-xl font-bold text-white mb-4">Profile Breakdown</h3>
                    <div className="text-center py-8 text-white/50">
                        Profile-specific data will appear here once multiple profiles track sufficient data.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
