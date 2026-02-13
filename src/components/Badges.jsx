import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Award, Scroll, Zap, Star, BookOpen, Clock, Users, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProgress } from '../../.agent/skills/progress_tracker/storage_provider';
import { getSessionHistory } from '../../.agent/skills/data_handler/storage_provider';

const Badges = () => {
    const [badges, setBadges] = useState([]);
    const [unlockedCount, setUnlockedCount] = useState(0);

    useEffect(() => {
        const progress = getProgress();
        const history = getSessionHistory();

        const words = Object.values(progress.wordProgress || {});
        const wordsLearned = words.filter(w => w.level > 0).length;
        const currentStreak = progress.currentStreak || 0;

        let totalCorrect = 0;
        let totalIncorrect = 0;
        words.forEach(w => {
            totalCorrect += (w.correct || 0);
            totalIncorrect += (w.incorrect || 0);
        });
        const totalAttempts = totalCorrect + totalIncorrect;
        const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

        const badgeList = [
            { id: 1, name: "First Steps", description: "Complete your first session", icon: Award, unlocked: history.length > 0 },
            { id: 2, name: "Vocabulary Master", description: "Learn 50 words", icon: Scroll, unlocked: wordsLearned >= 50 },
            { id: 3, name: "Daily Streak: 3", description: "Maintain a 3-day streak", icon: Zap, unlocked: currentStreak >= 3 },
            { id: 4, name: "Perfect Quiz", description: "Achieve 100% accuracy (min 10 attempts)", icon: Star, unlocked: accuracy === 100 && totalAttempts > 10 },
            { id: 5, name: "Speed Demon", description: "Review 20 words in one session", icon: Clock, unlocked: history.some(s => (s.correct + s.incorrect) >= 20) },
            { id: 6, name: "7-Day Streak", description: "Maintain a 7-day streak", icon: Zap, unlocked: currentStreak >= 7 },
            { id: 7, name: "Alphabet Master", description: "Learn 28 letters", icon: BookOpen, unlocked: false }, // Placeholder logic for now
            { id: 8, name: "Grammar Guru", description: "Complete Grammar Level 1", icon: PenTool, unlocked: false },
        ];

        setBadges(badgeList);
        setUnlockedCount(badgeList.filter(b => b.unlocked).length);

    }, []);

    return (
        <div className="min-h-screen pb-24 bg-[#0f1115]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-dark/80 ios-blur pt-12 pb-4 px-6 border-b border-white/5 flex items-center justify-between">
                <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-white">My Badges</h1>
                <div className="w-10"></div>
            </header>

            <main className="px-6 py-8">
                {/* Progress Card */}
                <div className="bg-card-bg p-4 rounded-2xl border border-white/5 shadow-xl mb-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/60 font-medium">Collection Progress</span>
                        <span className="text-sm font-bold text-primary-green">{unlockedCount} / {badges.length}</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary-green h-full rounded-full shadow-[0_0_10px_rgba(19,236,91,0.5)] transition-all duration-1000"
                            style={{ width: `${(unlockedCount / Math.max(badges.length, 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Milestones */}
                <section className="mb-10">
                    <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold mb-6">Badges</h2>
                    <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                        {badges.map((badge) => (
                            <div key={badge.id} className={`flex flex-col items-center ${!badge.unlocked ? 'opacity-40 grayscale' : ''}`}>
                                <div className="relative w-20 h-20 mb-3 group">
                                    {badge.unlocked && <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full group-hover:bg-yellow-500/30 transition-all"></div>}
                                    <div className={`relative w-full h-full rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg ${badge.unlocked ? 'bg-gradient-to-tr from-yellow-600 to-yellow-300' : 'bg-charcoal'}`}>
                                        {badge.unlocked ? (
                                            <badge.icon size={32} className="text-white drop-shadow-md" />
                                        ) : (
                                            <Lock size={24} className="text-white/50" />
                                        )}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-semibold text-center leading-tight ${badge.unlocked ? 'text-zinc-300' : 'text-white/50'}`}>{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Background Orbs */}
            <div className="fixed top-[20%] left-[-20%] w-64 h-64 bg-primary-green/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[20%] right-[-20%] w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
        </div>
    );
};

export default Badges;
