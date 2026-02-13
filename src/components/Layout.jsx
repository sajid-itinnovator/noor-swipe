import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Layers, Trophy, User, Settings, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/learn', label: 'Learn', icon: BookOpen },
        { path: '/badges', label: 'Decks', icon: Layers }, // "Decks" in design
        { path: '/leaderboard', label: 'Rank', icon: Trophy },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="bg-background-dark min-h-screen text-white font-display flex flex-row">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#111] border-r border-white/5 p-6 h-screen sticky top-0">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-white font-bold text-xl">ن</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Noor</h1>
                        <p className="text-xs text-gray-500">Arabic Learning</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[#2A2A2A] text-white shadow-inner'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={22} className={isActive ? 'text-[#F59E0B]' : 'group-hover:text-[#F59E0B] transition-colors'} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-[#2A2A2A] text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <Settings size={22} className="group-hover:text-gray-300 transition-colors" />
                        <span className="font-medium text-sm">Settings</span>
                    </NavLink>
                    <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-colors group">
                        <LogOut size={22} />
                        <span className="font-medium text-sm">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative bg-background-dark min-h-screen overflow-hidden">
                <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-[#0F0F0F]/90 backdrop-blur-xl border-t border-white/5 px-6 py-2 pb-8 flex justify-between items-center z-50">
                    {navItems.slice(0, 5).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#F59E0B]' : 'text-gray-500 hover:text-gray-300'
                                }`
                            }
                        >
                            <item.icon size={24} strokeWidth={2.5} />
                            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Layout;
