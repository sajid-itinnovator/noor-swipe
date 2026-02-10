import React, { useMemo } from 'react';

const StreakCalendar = ({ streakData }) => {
    const days = useMemo(() => {
        const today = new Date();
        const result = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                count: streakData[dateStr] || 0,
                dayOfMonth: date.getDate()
            });
        }
        return result;
    }, [streakData]);

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">30-Day Streak</h3>
            <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-xs text-white/50">{d}</div>
                ))}
                {/* Offset for first day alignment could be added here, but simple grid for now */}
                {days.map((day) => (
                    <div
                        key={day.date}
                        className={`
              aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
              ${day.count > 0
                                ? 'bg-amber-400 text-amber-900 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                                : 'bg-white/5 text-white/30'}
            `}
                        title={`${day.date}: ${day.count} sessions`}
                    >
                        {day.dayOfMonth}
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm text-white/70 text-center">
                {Object.values(streakData).filter(c => c > 0).length} days active
            </div>
        </div>
    );
};

export default StreakCalendar;
