import React, { useEffect, useState } from 'react';
import { X, Star, Zap, BookOpen } from 'lucide-react';

export const StreakModal = ({ isOpen, onClose, streakDays = 7 }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-slate-900 rounded-[2rem] w-full max-w-sm relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
                >
                    <X size={24} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center pt-8 pb-8 px-6 text-center">
                    {/* Badge Image Placeholder */}
                    <div className="relative mb-6">
                        <div className="w-40 h-40 bg-gradient-to-b from-amber-100 to-amber-50 rounded-full flex items-center justify-center border-4 border-amber-200 shadow-xl">
                            <div className="w-32 h-32 relative">
                                {/* Using a placeholder SVG or just stylized text if image not available */}
                                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                                    <path d="M50 0 L95 25 V75 L50 100 L5 75 V25 Z" fill="url(#grad1)" stroke="#D97706" strokeWidth="2" />
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FCD34D" />
                                            <stop offset="100%" stopColor="#F59E0B" />
                                        </linearGradient>
                                    </defs>
                                    <text x="50" y="55" fontFamily="Arial" fontSize="40" fill="#78350f" fontWeight="bold" textAnchor="middle">{streakDays}</text>
                                    <text x="50" y="80" fontFamily="Noto Sans Arabic" fontSize="20" fill="#78350f" fontWeight="bold" textAnchor="middle">أيام</text>
                                </svg>
                            </div>
                        </div>
                        {/* Sparkles */}
                        <Star className="absolute top-0 right-0 text-amber-400 fill-amber-400 animate-pulse" size={24} />
                        <Star className="absolute bottom-4 left-0 text-amber-400 fill-amber-400 animate-bounce" size={16} />
                    </div>

                    <h2 className="text-2xl font-black text-[#1e293b] mb-2">{streakDays}-Day Streak</h2>
                    <p className="text-slate-500 text-sm mb-6 max-w-[250px]">
                        Complete a lesson every day for {streakDays} consecutive days to earn this badge.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full space-y-2 mb-8">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Progress</span>
                            <span className="text-green-500">5/7 Days</span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[70%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Reward */}
                    <div className="w-full text-left mb-6">
                        <p className="text-xs font-bold text-slate-900 mb-2">Reward</p>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                    <div className="w-4 h-4 bg-amber-500 rotate-45"></div>
                                </div>
                                <span className="font-bold text-sm text-slate-700">+100 Gems</span>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <span className="font-bold text-sm text-slate-700">+500 XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button onClick={onClose} className="w-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GoalReachedModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Confetti Background Effect (CSS only simple implementation) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: '3s'
                    }}></div>
                ))}
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 text-white rounded-[2rem] w-full max-w-lg relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header Image/Banner */}
                <div className="h-32 bg-gradient-to-b from-yellow-500/20 to-transparent flex items-center justify-center pt-8">
                    <h2 className="text-4xl font-bold text-[#FCD34D] drop-shadow-md">Goal Reached!</h2>
                </div>

                <div className="px-8 pb-8 text-center -mt-6">
                    <div className="bg-white text-black p-8 rounded-3xl shadow-xl relative z-10">

                        {/* Arabic Text */}
                        <h3 className="text-2xl font-arabic font-bold mb-1">دورمعة اليمي</h3>
                        <p className="text-gray-500 text-sm mb-6">Daily Rewards</p>

                        {/* Rewards */}
                        <div className="flex items-center justify-center gap-8 mb-8">
                            <div className="flex flex-col items-center">
                                <Star size={48} className="text-yellow-400 fill-yellow-400 mb-2 drop-shadow-md" />
                                <span className="text-3xl font-black text-slate-800">500</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">XP Earned</span>
                            </div>
                            <div className="w-px h-16 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-500 rotate-45 rounded-lg mb-4 shadow-lg flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white/30 rotate-0"></div>
                                </div>
                                <span className="text-3xl font-black text-slate-800">50</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gems Collected</span>
                            </div>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button onClick={onClose} className="w-full bg-[#F59E0B] text-black font-bold text-lg py-4 rounded-full mt-8 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:bg-[#FBBF24] transition-all transform active:scale-95">
                        Continue
                    </button>

                    <p className="text-gray-500 text-xs mt-4">Keep up the streak! Tomorrow's challenge awaits.</p>
                </div>
            </div>
        </div>
    );
};
