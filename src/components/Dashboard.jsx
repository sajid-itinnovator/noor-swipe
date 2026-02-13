import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Zap, Clock, Star, BookOpen, Layers, Users, Circle } from 'lucide-react';
import { StreakModal, GoalReachedModal } from './Modals';
import { getProgress } from '../../.agent/skills/progress_tracker/storage_provider';
import { getSessionHistory } from '../../.agent/skills/data_handler/storage_provider';

const Dashboard = ({ settings, user }) => {
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [stats, setStats] = useState({
        xp: 0,
        streak: 0,
        wordsLearned: 0,
        wordsToday: 0,
        timeToday: 0
    });

    useEffect(() => {
        // Load Progress
        const progress = getProgress();
        const history = getSessionHistory();

        // Calculate Words Learned (Level > 0)
        const learnedCount = Object.values(progress.wordProgress || {}).filter(w => w.level > 0).length;

        // Calculate Today's Stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const todaySessions = history.filter(s => s.timestamp >= today);
        const wordsToday = todaySessions.reduce((acc, s) => acc + (s.correct || 0), 0);
        // Estimate time: 30 seconds per word (rough estimate)
        const timeToday = Math.round(wordsToday * 0.5);

        setStats({
            xp: progress.totalStars || 0,
            streak: progress.currentStreak || 0,
            wordsLearned: learnedCount,
            wordsToday: wordsToday,
            timeToday: timeToday
        });

    }, []);

    const dailyGoal = settings?.dailyGoal || 10;
    const goalProgress = Math.min((stats.wordsToday / dailyGoal) * 100, 100);

    // Junior Mode UI Adjustments could go here
    const isJunior = settings?.userProfile === 'junior';

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#111] text-white font-display overflow-y-auto md:overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative min-h-screen md:min-h-0">
                {/* "Kitab" Card */}
                <div className="bg-white text-black rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl flex flex-col items-center text-center relative z-10 transition-transform hover:scale-[1.01] duration-300">
                    {/* Audio Icon */}
                    <div className="absolute top-8 left-8">
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors">
                            <Play size={20} fill="black" />
                        </div>
                    </div>
                    {/* Menu/Dots Icon */}
                    <div className="absolute top-8 right-8">
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-black"></div>
                                <div className="w-1 h-1 rounded-full bg-black"></div>
                                <div className="w-1 h-1 rounded-full bg-black"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 w-full text-center">
                        <h1 className="text-8xl font-arabic mb-2" dir="rtl">كِتَاب</h1>
                    </div>

                    <h2 className="text-4xl font-medium text-gray-800 mb-2">Kitāb</h2>
                    <div className="w-16 h-0.5 bg-gray-200 my-4"></div>
                    <p className="text-2xl text-gray-600 font-medium">Book</p>

                    {/* Review Options (Bottom of card) */}
                    <div className="mt-12 grid grid-cols-2 gap-4 w-full">
                        <button className="bg-[#FFF4E5] border-2 border-[#E8B05C] rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:bg-[#ffeccf] transition-colors relative">
                            <div className="absolute top-3 right-3 text-[#E8B05C]">
                                <Circle size={20} fill="#E8B05C" stroke="none" />
                                <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                            </div>
                            <span className="text-2xl font-arabic">مكتب</span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Maktab - Office</span>
                        </button>
                        <button className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-sm">
                            <span className="text-2xl font-arabic">قلم</span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Qalam - Pen</span>
                        </button>
                        <button className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-sm">
                            <span className="text-2xl font-arabic">ورقة</span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Waraqa - Paper</span>
                        </button>
                        <button className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-sm">
                            <span className="text-2xl font-arabic">حقيبة</span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Haqiba - Bag</span>
                        </button>
                    </div>
                </div>

                {/* Continue Learning Button */}
                <div className="mt-8 w-full max-w-2xl">
                    <Link to="/learn" className="block w-full">
                        <button className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-bold text-lg py-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all transform active:scale-95 cursor-pointer">
                            CONTINUE LEARNING
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right Sidebar (Stats) */}
            <div className="w-full md:w-96 bg-[#1A1A1A] p-6 border-t md:border-t-0 md:border-l border-white/5 flex flex-col gap-6 overflow-y-auto">

                {/* User Profile */}
                <div className="flex items-center justify-end gap-3 mb-4">
                    <div className="absolute top-6 right-6 flex items-center gap-4">
                        <Link to="/profile" className="relative cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-white transition-colors overflow-hidden border-2 border-transparent hover:border-white">
                                {user?.avatar ?
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> :
                                    <Users size={20} />
                                }
                            </div>
                            {/* Notification Dot */}
                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1A1A1A]"></div>
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden border-2 border-transparent group-hover:border-white transition-colors">
                                <img src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1skqy1lwoMBsZrtneEY5yEZ7CEdyD0tETAI4kgQyMeDQwsWKMRNlIytDY_dqLg2oGZ7C_1n-B_VBqkUdv-vOWYM3IKDwSh0acQKDbrP1iFCTVbJqTwz0iDbufFnqyoRbuuva9c_XL1Nnyi87I_BoWOgLH3FdSyT5_2ycB1_HDECHeu7z6JuTTMM5e6unFFHLGBUB7W8zWjkPkf8CYmpv3OJ-CGp9fRxk0rePo1fZaisdhvepTFbsGtaQVysLkA5flLrpHhOK4Sw"} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-bold text-white group-hover:text-[#F59E0B] transition-colors">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-gray-500">{isJunior ? 'Junior Explorer' : 'Level ' + Math.floor(stats.xp / 100 + 1)}</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="mt-16"></div>

                {/* Daily Goals */}
                <div onClick={() => setShowGoalModal(true)} className="bg-[#242624] rounded-3xl p-6 border border-white/5 relative overflow-hidden cursor-pointer hover:border-white/20 transition-colors">
                    {/* Gold Header Background */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#FCD34D] to-[#F59E0B] opacity-20"></div>

                    <h3 className="text-[#F59E0B] font-bold text-sm tracking-widest uppercase mb-6 relative z-10">Daily Goals</h3>

                    <div className="space-y-6 relative z-10">
                        {/* Words Learned Today */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                {/* Circular Progress */}
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="24" cy="24" r="20" className="stroke-gray-700" strokeWidth="4" fill="none" />
                                    <circle cx="24" cy="24" r="20" className="stroke-[#F59E0B]" strokeWidth="4" fill="none" strokeDasharray="126" strokeDashoffset={126 - (126 * goalProgress / 100)} />
                                </svg>
                                <span className="absolute text-[10px] font-bold">{Math.round(goalProgress)}%</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300 font-medium">Daily Words</span>
                                    <span className="text-gray-500">{stats.wordsToday}/{dailyGoal}</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${goalProgress}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Words Learned Total */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <BookOpen size={20} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300 font-medium">Total Learned</span>
                                    <span className="text-gray-500">{stats.wordsLearned}</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-full opacity-50 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* XP Earned */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="24" cy="24" r="20" className="stroke-gray-700" strokeWidth="4" fill="none" />
                                    <circle cx="24" cy="24" r="20" className="stroke-[#F59E0B]" strokeWidth="4" fill="none" strokeDasharray="126" strokeDashoffset="12.6" />
                                </svg>
                                <span className="absolute text-[10px] font-bold">XP</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300 font-medium">XP Earned</span>
                                    <span className="text-gray-500">{stats.xp}</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#F59E0B] w-[90%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streaks */}
                <div onClick={() => setShowStreakModal(true)} className="bg-[#242624] rounded-3xl p-6 border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                    <h3 className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-4">Streaks</h3>

                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full"></div>
                            <Zap size={64} className="text-[#F59E0B] fill-[#F59E0B] relative z-10" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-2 z-20 font-black text-xl text-black">
                                {stats.streak}
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2 font-medium">{stats.streak} Day Streak</p>
                    </div>

                    {/* Week Days */}
                    <div className="flex justify-between items-end gap-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            // This is still static for visual demo as real calendar logic is complex to infer from simple streaks
                            const isActive = day === 'Thu';
                            const isPast = ['Mon', 'Tue', 'Wed'].includes(day);

                            return (
                                <div key={day} className="flex flex-col items-center gap-2">
                                    <span className={`text-[10px] font-bold ${isActive ? 'text-[#F59E0B]' : 'text-gray-600'}`}>{day}</span>
                                    <div className={`w-8 h-10 rounded-lg flex items-center justify-center border-2 transition-all
                                  ${isActive ? 'bg-[#2A2A2A] border-[#F59E0B] text-[#F59E0B]' : ''}
                                  ${isPast ? 'bg-[#2A2A2A] border-[#F59E0B]/30 text-[#F59E0B]/50' : ''}
                                  ${!isActive && !isPast ? 'bg-transparent border-gray-700 text-gray-700' : ''}
                              `}>
                                        {isActive || isPast ? <Zap size={14} fill="currentColor" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <StreakModal isOpen={showStreakModal} onClose={() => setShowStreakModal(false)} />
            <GoalReachedModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} />
        </div>
    );
};

export default Dashboard;
