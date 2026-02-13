import React, { useEffect } from 'react';
import { ArrowRight, Share2, Sun, Trophy, BookOpen, Zap, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const SessionComplete = ({ stats = { correct: 0, incorrect: 0 }, total = 10 }) => {

    useEffect(() => {
        // Simple CSS animation for confetti provided in CSS or we could use canvas-confetti
        // For now relying on the CSS keyframes defined in index.css
    }, []);

    // Confetti pieces data
    const confettiPieces = [
        { left: '10%', animationDuration: '4s', bg: '#ffd700', type: 'rounded-full' },
        { left: '25%', animationDuration: '5s', bg: '#ffae00', type: 'rounded-sm', transform: 'rotate(45deg)' },
        { left: '45%', animationDuration: '3s', bg: '#13ec5b', type: 'rounded-full' },
        { left: '65%', animationDuration: '6s', bg: '#ffd700', type: 'rounded-sm', transform: 'rotate(15deg)' },
        { left: '85%', animationDuration: '4.5s', bg: '#ffae00', type: 'rounded-full' },
        { left: '15%', animationDuration: '5.5s', bg: '#13ec5b', type: 'rounded-sm', transform: 'rotate(60deg)' },
        { left: '75%', animationDuration: '3.5s', bg: '#ffd700', type: 'rounded-full' }
    ];

    const percentage = Math.round((stats.correct / total) * 100);
    const xpEarned = stats.correct * 10;

    return (
        <div className="min-h-screen bg-background-dark text-white font-display flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Confetti Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {confettiPieces.map((piece, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 ${piece.type} top-[-20px] opacity-70`}
                        style={{
                            left: piece.left,
                            backgroundColor: piece.bg,
                            transform: piece.transform,
                            animation: `fall ${piece.animationDuration} infinite linear`
                        }}
                    ></div>
                ))}
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-md flex flex-col items-center z-10">
                {/* Animated Hero Icon */}
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-primary-green/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                    <div className="relative w-48 h-48 flex items-center justify-center bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full shadow-2xl border-8 border-white/10 gold-glow">
                        <Trophy size={80} className="text-white drop-shadow-md" />
                    </div>
                    {/* Smaller floating sun element */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg gold-glow animate-bounce" style={{ animationDuration: '3s' }}>
                        <Sun className="text-white" size={32} />
                    </div>
                </div>

                {/* Heading Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Session Complete!</h1>
                    <p className="text-white/70 text-lg font-light">
                        {percentage >= 80 ? "Excellent work!" : "Keep practicing!"}
                    </p>
                </div>

                {/* Summary Card */}
                <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-12 shadow-2xl">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Words Metric */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2 border border-blue-500/30">
                                <BookOpen className="text-blue-400" size={24} />
                            </div>
                            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Correct</span>
                            <span className="text-xl font-bold">{stats.correct}/{total}</span>
                        </div>
                        {/* XP Metric */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary-green/20 flex items-center justify-center mb-2 border border-primary-green/30">
                                <Zap className="text-primary-green" size={24} />
                            </div>
                            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Bonus</span>
                            <span className="text-xl font-bold text-primary-green">+{xpEarned} XP</span>
                        </div>
                        {/* Streak Metric */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-2 border border-orange-500/30">
                                <Flame className="text-orange-500" size={24} />
                            </div>
                            <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Accuracy</span>
                            <span className="text-xl font-bold">{percentage}%</span>
                        </div>
                    </div>

                    {/* Progress Bar Visualization */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-white/80">Arabic Level 4</span>
                            <span className="text-sm font-bold text-primary-green">85%</span>
                        </div>
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                            <div className="bg-primary-green h-full rounded-full w-[85%] relative shadow-[0_0_10px_rgba(19,236,91,0.5)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-4">
                    <Link to="/" className="w-full bg-primary-green hover:bg-primary-green/90 text-background-dark font-bold py-5 rounded-xl text-xl shadow-lg shadow-primary-green/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        Continue <ArrowRight size={24} />
                    </Link>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-xl text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-white/10">
                        <Share2 className="text-primary-green/80" size={24} />
                        Share Progress
                    </button>
                </div>
            </div>

            {/* Motivational Floating Banner (Lower) */}
            <div className="mt-8 px-6 py-2 bg-charcoal/50 backdrop-blur rounded-full border border-white/5 flex items-center gap-3">
                <div className="flex -space-x-2">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhfAvaFR0a4bU-Anr4oOyW6Pg0lsXgo1lyrj5FN6Egis5T80qYck5eg2J77Rpuw8K7YCi3OwTgaYg-Kb63vfURH352-J6_dBC8BmEync9SUDA-ll7klQLN-sGsl0qiv2V1ZdDDqDBhNN9knyWTOBhPwX3kx2jKdIWvaOsAgu6ZNJTrYTROyloCY24l3SIAjjDb5wILu7A0JQQPXtmYIhlN23Qwg2pn_da0rSWZM8qIoqAUC6fDVpAb9zAHYvN4bLdKdh1scHXBD8" alt="" className="w-6 h-6 rounded-full border border-charcoal bg-gray-600" />
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv2z7eay0x8gQdMIEX4rpsUMxRPAt6S-U2SQwXjhDaAkRZECIP-AAR_EtUOQMf0-XRKhq_n_Lf7QZ4IWwdZKneExjfLGmTcsSJGVH6JceuY5_Iim8R3pUjdRyRK2eC1tsB4c5_dtZ7o6SNhFK0Os0buAKgE8SxKiKmL_axFmgSCb6eUII4UvoCQoN4sHQ7ug1HyRAw2omxv9qLyVe_WkY0blrZ-gHzp3sdTkI42t6t8HFri9va63tifoHonJhuLDa0gUNNgtTtqVw" alt="" className="w-6 h-6 rounded-full border border-charcoal bg-gray-600" />
                </div>
                <p className="text-xs text-white/60">Join 1,240 others learning today!</p>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary-green/5 rounded-full blur-3xl"></div>
            <div className="absolute top-[-5%] right-[-5%] w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl"></div>

            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
             `}</style>

        </div>
    );
};

export default SessionComplete;
