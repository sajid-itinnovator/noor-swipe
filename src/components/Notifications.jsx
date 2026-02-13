import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    return (
        <div className="min-h-screen bg-blue-bg-light dark:bg-blue-bg-dark text-slate-900 dark:text-slate-100 font-display pb-12 flex justify-center">
            {/* Mobile Container (Phone Form Factor) */}
            <div className="w-full max-w-md bg-blue-bg-light dark:bg-blue-bg-dark min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
                {/* Subtle Arabic Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" data-alt="Subtle Arabic geometric pattern background" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhw1S5N_-XcTZz9Ql2aBrRcJvnOIQF5pudnMJBTw_-ZkZteppSANV7eKmjlDcv4vNnh9J-bRT8Stb1hEVjh8cddQDqvJe46wwjXpHKpDrLGUD1YNU3gXpOLu4YU0QkqZq5b9T-Yt9FJOJGDJEq1f2JYCJvtu50TWsrjYOKgAvtAHemT5RdiwJ0O_-Q97MH9lkLTr_PQEj0cy8OpViW-8m245S3LqIUTTox9pTQRgINv6aAwnQDjLdo4RqnI_poBzt5lU9S9H84z0M')" }}></div>

                {/* Header */}
                <header className="sticky top-0 z-40 bg-blue-bg-light/80 dark:bg-blue-bg-dark/80 backdrop-blur-md px-4 h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <Link to="/settings" className="w-10 h-10 flex items-center justify-start text-primary hover:opacity-70 transition-opacity">
                        <span className="material-icons-round text-3xl">chevron_left</span>
                    </Link>
                    <h1 className="text-lg font-semibold tracking-tight">Notifications</h1>
                    <div className="w-10"></div> {/* Spacer for balance */}
                </header>

                <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    {/* System Status Banner (Conditional Look) */}
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start space-x-3">
                        <span className="material-icons-round text-primary mt-0.5">info</span>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-primary">System Permissions Active</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Notifications are enabled in your iOS settings for Al-Kalimah.</p>
                        </div>
                    </div>

                    {/* Preferences Group */}
                    <section className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 pb-2">Engagement</h2>
                        <div className="bg-white dark:bg-blue-charcoal rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800/50">
                            {/* Daily Reminders Row */}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-icons-round">calendar_today</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Daily Reminders</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Keep your streak alive with a daily nudge.</p>
                                        </div>
                                    </div>
                                    {/* iOS Switch */}
                                    <div className="relative inline-block w-12 h-7 transition duration-200 ease-in-out cursor-pointer">
                                        <input type="checkbox" id="toggle-daily" className="sr-only peer" defaultChecked />
                                        <label htmlFor="toggle-daily" className="block w-full h-full bg-slate-700 rounded-full peer-checked:bg-primary transition-colors duration-200 relative
                                            before:content-[''] before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform before:duration-200 peer-checked:before:translate-x-full shadow-inner"
                                        ></label>
                                    </div>
                                </div>
                                {/* Time Picker Element */}
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-blue-bg-dark/50 p-3 rounded-xl">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Set Reminder Time</span>
                                        <div className="flex items-center space-x-2 bg-slate-200 dark:bg-blue-charcoal px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">08:30</span>
                                            <span className="text-xs font-bold text-primary">AM</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-wide">Standard Morning Review</p>
                                </div>
                            </div>

                            {/* Streak Alerts Row */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                        <span className="material-icons-round">local_fire_department</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Streak Alerts</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Notified when your streak is at risk.</p>
                                    </div>
                                </div>
                                <div className="relative inline-block w-12 h-7 transition duration-200 ease-in-out cursor-pointer">
                                    <input type="checkbox" id="toggle-streak" className="sr-only peer" defaultChecked />
                                    <label htmlFor="toggle-streak" className="block w-full h-full bg-slate-700 rounded-full peer-checked:bg-primary transition-colors duration-200 relative
                                        before:content-[''] before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform before:duration-200 peer-checked:before:translate-x-full shadow-inner"
                                    ></label>
                                </div>
                            </div>

                            {/* Leaderboard Updates Row */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                        <span className="material-icons-round">leaderboard</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Leaderboard Updates</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">When someone overtakes your rank.</p>
                                    </div>
                                </div>
                                <div className="relative inline-block w-12 h-7 transition duration-200 ease-in-out cursor-pointer">
                                    <input type="checkbox" id="toggle-leaderboard" className="sr-only peer" />
                                    <label htmlFor="toggle-leaderboard" className="block w-full h-full bg-slate-700 rounded-full peer-checked:bg-primary transition-colors duration-200 relative
                                        before:content-[''] before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform before:duration-200 peer-checked:before:translate-x-full shadow-inner"
                                    ></label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content Group */}
                    <section className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 pb-2">Platform</h2>
                        <div className="bg-white dark:bg-blue-charcoal rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/50">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <span className="material-icons-round">auto_awesome</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">New Content</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Announcements for new vocab sets.</p>
                                    </div>
                                </div>
                                <div className="relative inline-block w-12 h-7 transition duration-200 ease-in-out cursor-pointer">
                                    <input type="checkbox" id="toggle-content" className="sr-only peer" defaultChecked />
                                    <label htmlFor="toggle-content" className="block w-full h-full bg-slate-700 rounded-full peer-checked:bg-primary transition-colors duration-200 relative
                                        before:content-[''] before:absolute before:top-1 before:left-1 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform before:duration-200 peer-checked:before:translate-x-full shadow-inner"
                                    ></label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Visual Graphic / Progress */}
                    <div className="mt-8 px-2">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                <span className="material-icons-round text-primary text-3xl">notifications_active</span>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Smart Reminders</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[240px]">We'll only notify you when it's the best time for your brain to learn new words.</p>
                        </div>
                    </div>
                </main>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>
        </div>
    );
};

export default Notifications;
