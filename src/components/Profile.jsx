import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Award, Zap, Scroll, Users, PenTool, Star, Clock } from 'lucide-react';
import { getProgress } from '../../.agent/skills/progress_tracker/storage_provider';
import { getSessionHistory } from '../../.agent/skills/data_handler/storage_provider';

const Profile = ({ user }) => {
    const [profileData, setProfileData] = useState({
        name: user?.name || "Learner",
        level: 1,
        title: "Novice",
        xp: 0,
        nextLevelXp: 100,
        wordsLearned: 0,
        accuracy: 0,
        avatar: user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBNi_u9yy9mJQXJshKVUmM5Xr5F-E4atyWBeNzlcvK3Hxd6k5GGxyT9hiuZdMcLsv9GaEA9I4srGBgaBQDdEyNPH148SCp8ig4IsARIzPcmHgMZxM-Whnirtg2jBfVfgxBpmUAP3LUsbirp2uLkFPK_ovdRWOEDgoqy0Z9z_jCyNT80QMV2ls-LICG9JPuJtz0VqZivF_mvCnLRtHKkLCvkEq7UxWocifll5wlDycUjk2N2kp3X8rU8JySuT-gZLFwJB1ABceCplSE"
    });

    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const progress = getProgress();
        const history = getSessionHistory();

        // Calculate Stats
        const xp = progress.totalStars || 0;
        const level = Math.floor(xp / 100) + 1;
        const nextLevelXp = level * 100; // Simple linear progression for now

        let title = "Novice";
        if (level > 5) title = "Apprentice";
        if (level > 10) title = "Scholar";
        if (level > 20) title = "Master";

        const words = Object.values(progress.wordProgress || {});
        const wordsLearned = words.filter(w => w.level > 0).length;

        // Calculate Accuracy
        let totalCorrect = 0;
        let totalIncorrect = 0;
        words.forEach(w => {
            totalCorrect += (w.correct || 0);
            totalIncorrect += (w.incorrect || 0);
        });
        const totalAttempts = totalCorrect + totalIncorrect;
        const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

        setProfileData(prev => ({
            ...prev,
            level,
            title,
            xp,
            nextLevelXp,
            wordsLearned,
            accuracy
        }));

        // Badge Logic
        const newBadges = [
            { id: 1, name: "First Steps", description: "Complete your first session", icon: Award, unlocked: history.length > 0 },
            { id: 2, name: "Vocabulary Master", description: "Learn 50 words", icon: Scroll, unlocked: wordsLearned >= 50 },
            { id: 3, name: "Daily Streak: 3", description: "Maintain a 3-day streak", icon: Zap, unlocked: (progress.currentStreak || 0) >= 3 },
            { id: 4, name: "Perfect accuracy", description: "Achieve 100% accuracy", icon: Star, unlocked: accuracy === 100 && totalAttempts > 10 },
            { id: 5, name: "Grammar Guru", description: "Coming soon...", icon: BookOpen, unlocked: false },
            { id: 6, name: "Speed Learner", description: "Coming soon...", icon: Clock, unlocked: false },
            { id: 7, name: "Community Champion", description: "Coming soon...", icon: Users, unlocked: false },
            { id: 8, name: "Script Expert", description: "Coming soon...", icon: PenTool, unlocked: false },
        ];
        setBadges(newBadges);

    }, []);

    return (
        <div className="bg-[#0f1115] min-h-screen text-white font-display p-6 md:p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-b from-[#F97316] to-[#F59E0B]">
                            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full rounded-full object-cover border-4 border-[#0f1115]" />
                        </div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {profileData.name} - Level {profileData.level} <span className="text-gray-400 font-normal">({profileData.title})</span>
                        </h1>

                        {/* XP Bar */}
                        <div className="relative h-12 bg-[#1e2330] rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] flex items-center justify-end px-4"
                                style={{ width: `${Math.min((profileData.xp / profileData.nextLevelXp) * 100, 100)}%` }}
                            >
                                <Star className="text-white/80 fill-white/50" size={20} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-shadow-sm">
                                {profileData.xp.toLocaleString()} / {profileData.nextLevelXp.toLocaleString()} XP
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Column */}
                    <div className="space-y-6">
                        {/* Words Learned Card */}
                        <div className="bg-[#151921] border border-white/5 p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:border-[#F97316]/30 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-gray-400 font-medium">Total Words Learned</span>
                            </div>
                            <div className="text-5xl font-bold tracking-tight">{profileData.wordsLearned.toLocaleString()}</div>
                        </div>

                        {/* Accuracy Card */}
                        <div className="bg-[#151921] border border-white/5 p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:border-[#F97316]/30 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                                    <Target size={24} />
                                </div>
                                <span className="text-gray-400 font-medium">Accuracy</span>
                            </div>
                            <div className="text-5xl font-bold tracking-tight">{profileData.accuracy}%</div>
                        </div>
                    </div>

                    {/* Badges Column (Spans 2 columns) */}
                    <div className="md:col-span-2 bg-[#151921] border border-white/5 p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-8">Badge Collection</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                            {badges.map((badge) => (
                                <div key={badge.id} className="flex flex-col items-center text-center group">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg ${badge.unlocked
                                        ? 'bg-gradient-to-br from-yellow-400 to-[#F59E0B] shadow-orange-500/20'
                                        : 'bg-gray-700/50 grayscale opacity-50'
                                        }`}>
                                        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${badge.unlocked ? 'border-yellow-200/50' : 'border-gray-600'
                                            }`}>
                                            <badge.icon size={32} className={badge.unlocked ? 'text-yellow-900' : 'text-gray-400'} />
                                        </div>
                                    </div>
                                    <h3 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</h3>
                                    <p className="text-[10px] text-gray-400 leading-tight px-2">{badge.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
