import React, { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { getProgress } from '../../.agent/skills/progress_tracker/storage_provider';

const Leaderboard = ({ user }) => {
    const [timeframe, setTimeframe] = useState('weekly');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(0);

    const initialData = [
        { id: 1, name: "Ahmed Al-Fayed", xp: 1250000, rank: 1, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdseiG4Uv02-Gy1wEd40__dTtLQ7GdJIbf8_0LOj-bLyfDU002iMSIN-9Rp3T0oz0sYKTDrXnuFASvJoHaQBk8vQugXAhkW8x9r6aN0KBpI-13Jh3A7WC20Yy5u54ZOUT-nyi7HJx6oeJ9zNr8GmCBG--1W2m3k0JPvfgg6fiO-uST0Kl-hZPlgoieAnBsVqIDXzo_e-TSmVRLQhnQGZR2HhrprEzEZ4QQJhwHTSw_iqeLJrmdJ123OH-roKKL732tw" },
        { id: 2, name: "Layla Hassan", xp: 1120000, rank: 2, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNi_u9yy9mJQXJshKVUmM5Xr5F-E4atyWBeNzlcvK3Hxd6k5GGxyT9hiuZdMcLsv9GaEA9I4srGBgaBQDdEyNPH148SCp8ig4IsARIzPcmHgMZxM-Whnirtg2jBfVfgxBpmUAP3LUsbirp2uLkFPK_ovdRWOEDgoqy0Z9z_jCyNT80QMV2ls-LICG9JPuJtz0VqZivF_mvCnLRtHKkLCvkEq7UxWocifll5wlDycUjk2N2kp3X8rU8JySuT-gZLFwJB1ABceCplSE" },
        { id: 3, name: "Khalid Usman", xp: 1050000, rank: 3, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhBSaYn5yNw4CUlr9Jf1de96pOfCAwVy_ldPEoXROBOIPpoSKpBOVy1E_Ko_stbKtGk8OCn6Af-dKZAMKfldYQzrfS7u5p6PB_RMihRY05SokkJGi5dS9A0sqp-Ujfituhkf5WoaeDHd5NrfVv96Va_qouEact3XHl6ZtZUilYbcKjUIqOjWJtljziq_slugnYjWHz4aVnQCyhm12-W17r34bA_m5aIsVCikpcQs4w4z2byvKcUguCKS1U03WWuk-t4Cj_0jhcogM" },
        { id: 4, name: "Youssef Malik", xp: 980000, rank: 4, change: 3, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe_Vdmez007ykHW8sRAlkMf2n1V1Dm_XOLLqLRHEuWDUgX-PRMFQ2IUv9lwb5NAFJQCjmwD9gtZgAaurq6qYJwMqojLmzEwxmSrItP66g4Hlg2apUTWOg3eGY-_tZ3jXHu888mk-x8fKDgcsJmW00Avz5e2WKgszsM7mx0d4_3FcFCDxDlBLECSUR1K-vcMk4xhyH9l2IM2Sydl9FLF_g0dTYjc2PJC4FapiAKkbQc8DpErsoUwVtxK-bvrDvfQqT3nkeNCIa8IKY" },
        { id: 5, name: "Fatima Zahra", xp: 950000, rank: 5, change: 1, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA37Jan2EXKluRpetwYVPRExqq5DziV6STBWQOkbZT-kfCZAtuX6ICfdkfsgD7JA5lMjQROq2IqdFzcfFnGBh9_d3Z1qMdxcVBU_Y53P1az5gP0-2jeHze-jgz0im2vf5OOadGBQ7gkrnbNt3hcvIvGq8uZ8CQshwGnuylHyaUw6Iuuvf8E4ySZmk5et4reo9L8PErxPNdAFuY9Cv3dePPicuGRKsSK0rAOaPTusiQg4f_jAvJ6LiPxjEyRp7Iw1lltdJKbJyToXI" },
        { id: 6, name: "Omar Karim", xp: 920000, rank: 6, change: 0, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4P74wr4fi5zdUfEc9bjnce2AILlMGWqNW8MN2C_PBvKaW0PM7TNkbqhwuc7N7KYDbBLHyq7n6Clc9Y8cdL_FduzPp0udkfOa42iLjcB_Mn8JN4FOsQDq5VkrWsASi18NASdYcCuaPwYHGmxU5odroCIQBMI4nqm_xPLOqLYoxVHAs6HgA1HWAWJrsElcrAQtkxFHRRMmxa13Mmm-tOu2WkKyGxE8ZeBVjFsIom7ZE2QFNNsts44P7pxgzMiW3zHk1xTSGEVBRoKY" },
        { id: 7, name: "Amina Said", xp: 890000, rank: 7, change: -2, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhD1XA0yNfLhMWzcQemVENnHdWjw3kWjhN-6Nj94K2Vhlwr8U-14QigOMuMoz-u8BsLODo2GZSFbI6e00vWxzL4N66oo4oDuIeZd02UtDP4h5MGA5y3kOY6rfAbExxRQ-JcZlQfWwEoy3abxtm3mdrW7e_txBWIrhGwB_NCZVjUUpr1Kcr5YTqGEKMbgV0Owi3nAtdQ4LfSC419VNCx9YgE1NbPTpxGWhtnXjJjziQQIVUQ2LrO1qGjfMTaFH_H6nqQae2IHcJ3oQ" },
    ];

    useEffect(() => {
        const progress = getProgress();
        const userXP = progress.totalStars || 0;

        const currentUser = {
            id: 'current-user',
            name: user?.name || "You",
            xp: userXP,
            avatar: user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1skqy1lwoMBsZrtneEY5yEZ7CEdyD0tETAI4kgQyMeDQwsWKMRNlIytDY_dqLg2oGZ7C_1n-B_VBqkUdv-vOWYM3IKDwSh0acQKDbrP1iFCTVbJqTwz0iDbufFnqyoRbuuva9c_XL1Nnyi87I_BoWOgLH3FdSyT5_2ycB1_HDECHeu7z6JuTTMM5e6unFFHLGBUB7W8zWjkPkf8CYmpv3OJ-CGp9fRxk0rePo1fZaisdhvepTFbsGtaQVysLkA5flLrpHhOK4Sw",
            isCurrentUser: true,
            change: 5 // Mock positive change for motivation
        };

        const allUsers = [...initialData, currentUser];

        // Sort by XP descending
        const sortedUsers = allUsers.sort((a, b) => b.xp - a.xp);

        // Assign ranks
        const rankedUsers = sortedUsers.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        setLeaderboardData(rankedUsers);

        const myRank = rankedUsers.find(u => u.id === 'current-user')?.rank || 0;
        setCurrentUserRank(myRank);

    }, []);

    // Get top 3 for podium
    const top3 = leaderboardData.slice(0, 3);
    const podium1 = top3.find(u => u.rank === 1) || initialData[0];
    const podium2 = top3.find(u => u.rank === 2) || initialData[1];
    const podium3 = top3.find(u => u.rank === 3) || initialData[2];

    return (
        <div className="bg-[#1a1c1a] min-h-screen text-white font-display overflow-x-hidden">
            {/* Header */}
            <div className="p-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl text-[#E8B05C] font-serif mb-1">Global Leaderboard</h1>
                    <p className="text-gray-400 text-sm">Competitors from around the world</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-[#2A2A2A] rounded-full p-1 border border-[#E8B05C]/30">
                        <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${timeframe === 'weekly' ? 'bg-[#E8B05C] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            WEEKLY
                        </button>
                        <button
                            onClick={() => setTimeframe('alltime')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${timeframe === 'alltime' ? 'bg-[#E8B05C] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            ALL-TIME
                        </button>
                    </div>
                </div>
            </div>

            {/* Podium Section */}
            <div className="relative px-6 pt-12 pb-24 flex flex-wrap justify-center items-end gap-4 md:gap-12">
                {/* Rank 2 */}
                <div className="flex flex-col items-center order-2 md:order-1">
                    <span className={`text-xl font-bold mb-2 ${podium2.isCurrentUser ? 'text-[#E8B05C]' : 'text-gray-300'}`}>{podium2.name}</span>
                    <span className="text-sm text-gray-400 mb-4 flex items-center gap-1">
                        <ChevronUp size={16} className="text-green-500" /> {podium2.xp.toLocaleString()} XP
                    </span>
                    <div className="relative">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 p-1 ${podium2.isCurrentUser ? 'border-[#E8B05C]' : 'border-gray-300'}`}>
                            <img src={podium2.avatar} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
                                <span className="material-icons text-gray-300 text-4xl md:text-6xl drop-shadow-lg">crown</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-32 w-32 md:w-48 bg-gradient-to-t from-gray-400/20 to-gray-300/40 mt-4 rounded-t-lg flex items-start justify-center pt-4 relative backdrop-blur-sm border-t border-gray-300/50">
                        <span className="text-6xl md:text-8xl font-black text-white/20">2</span>
                    </div>
                </div>

                {/* Rank 1 */}
                <div className="flex flex-col items-center order-1 md:order-2 -mt-12 md:-mt-24 z-10">
                    <div className="absolute top-0 animate-pulse">
                        <span className="material-icons text-[#E8B05C] text-6xl md:text-8xl drop-shadow-[0_0_15px_rgba(232,176,92,0.5)]">crown</span>
                    </div>

                    <span className={`text-2xl font-bold mb-2 mt-16 md:mt-24 ${podium1.isCurrentUser ? 'text-[#F59E0B]' : 'text-[#E8B05C]'}`}>{podium1.name}</span>
                    <span className="text-sm text-[#E8B05C]/80 mb-6 flex items-center gap-1">
                        <ChevronUp size={16} className="text-green-500" /> {podium1.xp.toLocaleString()} XP
                    </span>

                    <div className="relative">
                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 p-1 shadow-[0_0_30px_rgba(232,176,92,0.3)] ${podium1.isCurrentUser ? 'border-[#F59E0B]' : 'border-[#E8B05C]'}`}>
                            <img src={podium1.avatar} className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>
                    <div className="h-48 w-40 md:w-56 bg-gradient-to-t from-[#E8B05C]/20 to-[#E8B05C]/60 mt-6 rounded-t-lg flex items-start justify-center pt-4 relative backdrop-blur-sm border-t border-[#E8B05C]/50 shadow-[0_0_50px_rgba(232,176,92,0.1)]">
                        <span className="text-8xl md:text-9xl font-black text-[#FFE5B4]/40">1</span>
                    </div>
                </div>

                {/* Rank 3 */}
                <div className="flex flex-col items-center order-3 md:order-3">
                    <span className={`text-xl font-bold mb-2 ${podium3.isCurrentUser ? 'text-[#E8B05C]' : 'text-amber-700'}`}>{podium3.name}</span>
                    <span className="text-sm text-gray-400 mb-4 flex items-center gap-1">
                        <ChevronUp size={16} className="text-green-500" /> {podium3.xp.toLocaleString()} XP
                    </span>
                    <div className="relative">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 p-1 ${podium3.isCurrentUser ? 'border-[#E8B05C]' : 'border-amber-700'}`}>
                            <img src={podium3.avatar} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
                                <span className="material-icons text-amber-700 text-4xl md:text-6xl drop-shadow-lg">crown</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-24 w-32 md:w-48 bg-gradient-to-t from-amber-900/20 to-amber-700/40 mt-4 rounded-t-lg flex items-start justify-center pt-4 relative backdrop-blur-sm border-t border-amber-700/50">
                        <span className="text-6xl md:text-8xl font-black text-amber-900/40">3</span>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="max-w-4xl mx-auto px-4 md:px-0 pb-20">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider text-gray-500 mb-4 px-8">
                    <span>Rank</span>
                    <span>User</span>
                    <span>XP Gained</span>
                    <span>Movement</span>
                </div>

                <div className="space-y-4">
                    {leaderboardData.slice(3).map((user) => (
                        <div key={user.id} className="relative group">
                            {/* Selection Indicator */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-opacity ${user.isCurrentUser ? 'bg-[#E8B05C] opacity-100' : 'bg-[#E8B05C] opacity-0 group-hover:opacity-100'}`}></div>

                            <div className={`border rounded-xl p-4 md:px-8 flex items-center justify-between transition-all 
                                ${user.isCurrentUser ? 'bg-[#2A2A2A] border-[#E8B05C]' : 'bg-[#1a1c1a] border-gray-800 hover:border-[#E8B05C]/50 hover:bg-[#2A2A2A]'}
                            `}>
                                <div className="flex items-center gap-8 md:gap-12 min-w-[200px]">
                                    <div className="flex items-center gap-1">
                                        {user.change > 0 && <ChevronUp size={14} className="text-green-500" />}
                                        {user.change < 0 && <ChevronDown size={14} className="text-red-500" />}
                                        {user.change === 0 && <Minus size={14} className="text-gray-500" />}
                                        <span className={`font-bold text-xl ${user.isCurrentUser ? 'text-[#E8B05C]' : 'text-gray-500'}`}>{user.rank}</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                                        <span className={`font-semibold ${user.isCurrentUser ? 'text-[#E8B05C]' : 'text-white'}`}>{user.name} {user.isCurrentUser && '(You)'}</span>
                                    </div>
                                </div>

                                <span className="font-mono text-gray-300">{user.xp.toLocaleString()} XP</span>

                                <div className={`text-sm font-medium w-32 text-right ${user.change > 0 ? 'text-green-500' :
                                    user.change < 0 ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                    {user.change > 0 ? `+${user.change} Places` :
                                        user.change < 0 ? `${user.change} Places` : 'No Change'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
